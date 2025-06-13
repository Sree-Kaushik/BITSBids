const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const compression = require('compression');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const itemRoutes = require('./routes/itemRoutes');
const bidRoutes = require('./routes/bidRoutes');

// Import middleware
const errorMiddleware = require('./middleware/errorMiddleware');

// Import services
const AuctionService = require('./services/auctionService');

// Create Express app
const app = express();
const server = createServer(app);

// Configure Socket.IO with enhanced CORS
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
  },
  transports: ['websocket', 'polling']
});

// Trust proxy (for deployment)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp({
  whitelist: ['category', 'campus', 'status', 'sortBy']
}));

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Cookie parser
app.use(cookieParser());

// Rate limiting with different limits for different endpoints
const createRateLimit = (windowMs, max, message) => rateLimit({
  windowMs,
  max,
  message: { success: false, message },
  standardHeaders: true,
  legacyHeaders: false,
});

// General rate limiting
app.use('/api/', createRateLimit(
  15 * 60 * 1000, // 15 minutes
  100, // limit each IP to 100 requests per windowMs
  'Too many requests from this IP, please try again later.'
));

// Stricter rate limiting for auth endpoints
app.use('/api/auth/', createRateLimit(
  15 * 60 * 1000, // 15 minutes
  10, // limit each IP to 10 auth requests per windowMs
  'Too many authentication attempts, please try again later.'
));

// CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.CLIENT_URL || "http://localhost:3000",
      "http://localhost:3000",
      "http://127.0.0.1:3000"
    ];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body parsing middleware
app.use(express.json({ 
  limit: '10mb',
  verify: (req, res, buf) => {
    try {
      JSON.parse(buf);
    } catch (e) {
      res.status(400).json({ success: false, message: 'Invalid JSON' });
      throw new Error('Invalid JSON');
    }
  }
}));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Connect to MongoDB with enhanced options
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bitsbids', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
      bufferMaxEntries: 0
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Set up connection event listeners
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
    });

  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Connect to database
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/bids', bidRoutes);

// Health check route with detailed status
app.get('/api/health', async (req, res) => {
  try {
    // Check database connection
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    
    // Check memory usage
    const memUsage = process.memoryUsage();
    
    res.status(200).json({ 
      success: true,
      message: 'BITSBids Server is running!', 
      timestamp: new Date().toISOString(),
      env: process.env.NODE_ENV || 'development',
      database: dbStatus,
      uptime: process.uptime(),
      memory: {
        rss: Math.round(memUsage.rss / 1024 / 1024) + ' MB',
        heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024) + ' MB',
        heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024) + ' MB'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Health check failed',
      error: error.message
    });
  }
});

// Socket.IO connection handling for real-time features
const connectedUsers = new Map();
const activeAuctions = new Map();
const auctionRooms = new Map();

io.on('connection', (socket) => {
  console.log(`👤 User connected: ${socket.id}`);
  
  // Join user to their personal room
  socket.on('join-user', (userId) => {
    socket.join(`user-${userId}`);
    connectedUsers.set(socket.id, userId);
    console.log(`🏠 User ${userId} joined their room`);
    
    // Send connection confirmation
    socket.emit('connection-confirmed', {
      userId,
      timestamp: new Date().toISOString()
    });
  });
  
  // Join auction room for real-time bidding
  socket.on('join-auction', (itemId) => {
    socket.join(`auction-${itemId}`);
    
    // Track users in auction room
    if (!auctionRooms.has(itemId)) {
      auctionRooms.set(itemId, new Set());
    }
    auctionRooms.get(itemId).add(socket.id);
    
    console.log(`🎯 User joined auction ${itemId}`);
    
    // Send current auction status if available
    if (activeAuctions.has(itemId)) {
      socket.emit('auction-status', activeAuctions.get(itemId));
    }
    
    // Notify others in the room about new viewer
    socket.to(`auction-${itemId}`).emit('viewer-joined', {
      viewerCount: auctionRooms.get(itemId).size
    });
  });
  
  // Leave auction room
  socket.on('leave-auction', (itemId) => {
    socket.leave(`auction-${itemId}`);
    
    if (auctionRooms.has(itemId)) {
      auctionRooms.get(itemId).delete(socket.id);
      
      // Notify others about viewer leaving
      socket.to(`auction-${itemId}`).emit('viewer-left', {
        viewerCount: auctionRooms.get(itemId).size
      });
      
      // Clean up empty rooms
      if (auctionRooms.get(itemId).size === 0) {
        auctionRooms.delete(itemId);
      }
    }
  });
  
  // Join dashboard for real-time auction updates
  socket.on('join-dashboard', (userId) => {
    socket.join('dashboard');
    console.log(`📊 User ${userId} joined dashboard`);
  });
  
  // Handle new bids with enhanced data
  socket.on('new-bid', (bidData) => {
    const enhancedBidData = {
      ...bidData,
      timestamp: new Date().toISOString(),
      socketId: socket.id
    };
    
    // Broadcast to all users in the auction room except sender
    socket.to(`auction-${bidData.itemId}`).emit('bid-update', enhancedBidData);
    
    // Broadcast to dashboard users
    socket.to('dashboard').emit('auction-update', {
      itemId: bidData.itemId,
      currentPrice: bidData.amount,
      totalBids: (activeAuctions.get(bidData.itemId)?.totalBids || 0) + 1,
      timestamp: enhancedBidData.timestamp
    });
    
    // Update active auction data
    activeAuctions.set(bidData.itemId, {
      currentBid: bidData.amount,
      leadingBidder: bidData.bidder,
      bidderName: bidData.bidderName,
      timestamp: new Date(),
      totalBids: (activeAuctions.get(bidData.itemId)?.totalBids || 0) + 1,
      viewerCount: auctionRooms.get(bidData.itemId)?.size || 0
    });
    
    console.log(`💰 New bid: ₹${bidData.amount} for item ${bidData.itemId} by ${bidData.bidderName}`);
  });
  
  // Handle auction end
  socket.on('auction-ended', (auctionData) => {
    const enhancedAuctionData = {
      ...auctionData,
      timestamp: new Date().toISOString()
    };
    
    // Notify all auction participants
    io.to(`auction-${auctionData.itemId}`).emit('auction-finished', enhancedAuctionData);
    
    // Notify dashboard users
    io.to('dashboard').emit('auction-ended', enhancedAuctionData);
    
    // Clean up auction data
    activeAuctions.delete(auctionData.itemId);
    auctionRooms.delete(auctionData.itemId);
    
    console.log(`🏁 Auction ended for item ${auctionData.itemId}`);
  });
  
  // Handle typing indicators for chat (future feature)
  socket.on('typing-start', (data) => {
    socket.to(`auction-${data.itemId}`).emit('user-typing', {
      userId: data.userId,
      userName: data.userName
    });
  });
  
  socket.on('typing-stop', (data) => {
    socket.to(`auction-${data.itemId}`).emit('user-stopped-typing', {
      userId: data.userId
    });
  });
  
  // Handle disconnect
  socket.on('disconnect', (reason) => {
    const userId = connectedUsers.get(socket.id);
    connectedUsers.delete(socket.id);
    
    // Clean up auction rooms
    for (const [itemId, socketSet] of auctionRooms.entries()) {
      if (socketSet.has(socket.id)) {
        socketSet.delete(socket.id);
        
        // Notify others about viewer leaving
        socket.to(`auction-${itemId}`).emit('viewer-left', {
          viewerCount: socketSet.size
        });
        
        // Clean up empty rooms
        if (socketSet.size === 0) {
          auctionRooms.delete(itemId);
        }
      }
    }
    
    console.log(`👋 User disconnected: ${socket.id} (User ID: ${userId}) - Reason: ${reason}`);
  });
  
  // Handle errors
  socket.on('error', (error) => {
    console.error(`Socket error for ${socket.id}:`, error);
  });
});

// Auction status updater - runs every minute
const auctionStatusInterval = setInterval(async () => {
  try {
    await AuctionService.updateAuctionStatuses();
  } catch (error) {
    console.error('Error in auction status update:', error);
  }
}, 60 * 1000); // 60 seconds

// Real-time dashboard updates - every 30 seconds
const dashboardUpdateInterval = setInterval(async () => {
  try {
    const activeAuctionsData = await AuctionService.getActiveAuctions();
    io.to('dashboard').emit('dashboard-update', {
      auctions: activeAuctionsData,
      timestamp: new Date().toISOString(),
      connectedUsers: connectedUsers.size
    });
  } catch (error) {
    console.error('Error broadcasting dashboard updates:', error);
  }
}, 30 * 1000); // 30 seconds

// Initial auction status update on server start
(async () => {
  try {
    await AuctionService.updateAuctionStatuses();
    console.log('✅ Initial auction status update completed');
  } catch (error) {
    console.error('❌ Initial auction status update failed:', error);
  }
})();

// Error handling middleware
app.use(errorMiddleware);

// Handle 404 for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: `API route ${req.originalUrl} not found` 
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    ...(process.env.NODE_ENV === 'development' && { error: err.message })
  });
});

// Graceful shutdown handling
const gracefulShutdown = (signal) => {
  console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);
  
  // Clear intervals
  clearInterval(auctionStatusInterval);
  clearInterval(dashboardUpdateInterval);
  
  // Close server
  server.close(() => {
    console.log('✅ HTTP server closed');
    
    // Close database connection
    mongoose.connection.close(false, () => {
      console.log('✅ MongoDB connection closed');
      process.exit(0);
    });
  });
  
  // Force close after 10 seconds
  setTimeout(() => {
    console.error('❌ Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

// Listen for termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', err);
  gracefulShutdown('UNHANDLED_REJECTION');
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 BITSBids Server running on port ${PORT}`);
  console.log(`📡 Socket.IO server initialized`);
  console.log(`🌐 Client URL: ${process.env.CLIENT_URL || "http://localhost:3000"}`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`💾 Database: ${process.env.MONGODB_URI ? 'Remote' : 'Local'}`);
});

// Export for testing
module.exports = { app, server, io };
