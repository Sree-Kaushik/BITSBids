
BITSBids - Student Auction Platform
A comprehensive auction platform exclusively for BITS Pilani students across all campuses. Buy, sell, and trade items with fellow BITSians through a secure, student-verified marketplace.

Project Overview
BITSBids is a full-stack web application built with React.js frontend and Node.js backend, designed specifically for the BITS Pilani student community. The platform enables students to create auctions, place bids, and conduct secure transactions within a trusted academic environment.

Key Features
Student-Only Access: BITS email verification ensures only genuine students participate

Real-Time Auctions: Live bidding with automatic updates and proxy bidding

Multi-Campus Support: Connect students from Pilani, Goa, Hyderabad, and Dubai campuses

Comprehensive Categories: Electronics, books, furniture, vehicles, and more

Secure Transactions: Built-in safety features and dispute resolution

Responsive Design: Works seamlessly on desktop, tablet, and mobile devices

Tech Stack
Frontend
React.js (v18.2.0) - Component-based UI framework

React Router (v6.8.0) - Client-side routing

React Toastify (v9.1.1) - Notification system

CSS3 - Custom styling with responsive design

Backend
Node.js (v18+) - Server runtime

Express.js (v4.18.2) - Web application framework

MongoDB (v6.0+) - NoSQL database

Mongoose (v7.0.1) - MongoDB object modeling

JWT (jsonwebtoken v9.0.0) - Authentication

bcryptjs (v2.4.3) - Password hashing

Multer (v1.4.5) - File upload handling

Prerequisites
Before you begin, ensure you have the following installed on your system:

Node.js (v18.0.0 or higher) - Download here

npm (v8.0.0 or higher) - Comes with Node.js

MongoDB (v6.0 or higher) - Download here

Git - Download here

Code Editor - VS Code recommended

Installation & Setup
Step 1: Clone the Repository
Open your first terminal and run:

bash
git clone https://github.com/Sree-Kaushik/bitsbids.git
cd bitsbids
Step 2: Project Structure Setup
The project should have the following structure:

text
bitsbids/
├── client/          # React frontend
├── server/          # Node.js backend
├── README.md
└── .gitignore
Step 3: Backend Setup
In your first terminal (stay in the root directory):

bash
# Navigate to server directory
cd server

# Initialize npm project
npm init -y

# Install backend dependencies
npm install express mongoose cors dotenv bcryptjs jsonwebtoken multer helmet morgan express-rate-limit nodemailer

# Install development dependencies
npm install -D nodemon concurrently
Create the backend folder structure:

bash
# Create necessary directories
mkdir models routes middleware controllers uploads config utils

# Create main server file
touch server.js

# Create environment file
touch .env
Step 4: Frontend Setup
Open a second terminal and navigate to the project root:

bash
cd bitsbids

# Navigate to client directory
cd client

# Create React app
npx create-react-app .

# Install additional frontend dependencies
npm install react-router-dom react-toastify axios
Step 5: Database Setup
Open a third terminal for MongoDB:

bash
# Start MongoDB service (Windows)
mongod

# OR for macOS with Homebrew
brew services start mongodb-community

# OR for Linux
sudo systemctl start mongod
Keep this terminal running throughout development.

Step 6: Environment Configuration
In your first terminal (server directory), edit the .env file:

bash
# Open .env file in your editor
code .env
Add the following environment variables:

text
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/bitsbids

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_complex
JWT_EXPIRE=7d

# Email Configuration (for development, use temporary email service)
EMAIL_FROM=noreply@bitsbids.com
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# Security Configuration
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
Step 7: Backend Implementation
In your first terminal (server directory), create the main server file:

bash
# Edit server.js
code server.js
Add the basic server setup:

javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://your-domain.com' 
    : 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX)
});
app.use(limiter);

// Logging
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static('uploads'));

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'BITSBids API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 API URL: http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
});
Update package.json scripts in server directory:

json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  }
}
Step 8: Frontend Implementation
In your second terminal (client directory), set up the basic React structure:

bash
# Create necessary directories
mkdir src/components src/pages src/context src/styles src/utils

# Create main files
touch src/context/AuthContext.js
touch src/styles/App.css
Update src/App.js:

javascript
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './context/AuthContext';

// Import components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Browse from './pages/Browse';
import ItemDetails from './pages/ItemDetails';
import CreateItem from './pages/CreateItem';
import MyAuctions from './pages/MyAuctions';
import MyBids from './pages/MyBids';
import Watchlist from './pages/Watchlist';
import Profile from './pages/Profile';
import Contact from './pages/Contact';
import Help from './pages/Help';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';

// Import styles
import './styles/App.css';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/browse" element={<Browse />} />
              <Route path="/item/:id" element={<ItemDetails />} />
              <Route path="/create-item" element={<CreateItem />} />
              <Route path="/my-auctions" element={<MyAuctions />} />
              <Route path="/my-bids" element={<MyBids />} />
              <Route path="/watchlist" element={<Watchlist />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/help" element={<Help />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
            </Routes>
          </main>
          <Footer />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
Step 9: Start Development Servers
Now you'll need three terminals running simultaneously:

Terminal 1 (Backend Server):

bash
cd bitsbids/server
npm run dev
You should see:

text
🚀 Server running on port 5000
📍 API URL: http://localhost:5000
✅ MongoDB connected successfully
Terminal 2 (Frontend Development Server):

bash
cd bitsbids/client
npm start
You should see:

text
Compiled successfully!

You can now view client in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
Terminal 3 (MongoDB):
Keep MongoDB running (should already be started from Step 5).

Step 10: Verify Installation
Backend API Test:
Open your browser and go to: http://localhost:5000/api/health
You should see:

json
{
  "status": "OK",
  "message": "BITSBids API is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
Frontend Test:
Open your browser and go to: http://localhost:3000
You should see the BITSBids homepage.

Database Test:
In a fourth terminal:

bash
mongo
show dbs
use bitsbids
show collections
Development Workflow
Daily Development Routine
Start all services (3 terminals):

bash
# Terminal 1: Backend
cd bitsbids/server && npm run dev

# Terminal 2: Frontend  
cd bitsbids/client && npm start

# Terminal 3: Database
mongod
Development URLs:

Frontend: http://localhost:3000

Backend API: http://localhost:5000

Database: mongodb://localhost:27017/bitsbids

Adding New Features
Backend Routes: Add to server/routes/

Frontend Pages: Add to client/src/pages/

Components: Add to client/src/components/

Styles: Update client/src/styles/App.css

File Structure After Setup
text
bitsbids/
├── server/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── controllers/
│   ├── uploads/
│   ├── config/
│   ├── utils/
│   ├── server.js
│   ├── .env
│   └── package.json
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── styles/
│   │   ├── utils/
│   │   └── App.js
│   └── package.json
└── README.md
Troubleshooting
Common Issues
Port Already in Use:

bash
# Kill process on port 3000 or 5000
npx kill-port 3000
npx kill-port 5000
MongoDB Connection Failed:

bash
# Check if MongoDB is running
ps aux | grep mongod

# Restart MongoDB
brew services restart mongodb-community  # macOS
sudo systemctl restart mongod            # Linux
Module Not Found Errors:

bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
CORS Errors:

Ensure backend CORS is configured for http://localhost:3000

Check that both servers are running on correct ports

