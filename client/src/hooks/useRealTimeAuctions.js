import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

const useRealTimeAuctions = (itemId = null) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [auctionData, setAuctionData] = useState(null);
  const [bidHistory, setBidHistory] = useState([]);
  const [activeUsers, setActiveUsers] = useState(0);
  const [connectionError, setConnectionError] = useState(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(process.env.REACT_APP_SERVER_URL || 'http://localhost:5000', {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true
    });

    setSocket(newSocket);

    // Connection event handlers
    newSocket.on('connect', () => {
      console.log('✅ Connected to auction server');
      setIsConnected(true);
      setConnectionError(null);
      reconnectAttempts.current = 0;

      // Join user room if authenticated
      if (user) {
        newSocket.emit('join-user', user.id);
      }

      // Join specific auction room if itemId provided
      if (itemId) {
        newSocket.emit('join-auction', itemId);
      }

      // Join dashboard for general updates
      newSocket.emit('join-dashboard', user?.id);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('❌ Disconnected from auction server:', reason);
      setIsConnected(false);
      
      if (reason === 'io server disconnect') {
        // Server initiated disconnect, try to reconnect
        setTimeout(() => {
          if (reconnectAttempts.current < maxReconnectAttempts) {
            reconnectAttempts.current++;
            newSocket.connect();
          }
        }, 1000 * reconnectAttempts.current);
      }
    });

    newSocket.on('connect_error', (error) => {
      console.error('🔴 Connection error:', error);
      setConnectionError(error.message);
      setIsConnected(false);
    });

    // Auction-specific event handlers
    newSocket.on('auction-status', (data) => {
      console.log('📊 Auction status update:', data);
      setAuctionData(data);
    });

    newSocket.on('bid-update', (bidData) => {
      console.log('💰 New bid received:', bidData);
      
      // Update auction data
      setAuctionData(prev => ({
        ...prev,
        currentBid: bidData.amount,
        leadingBidder: bidData.bidder,
        totalBids: (prev?.totalBids || 0) + 1,
        lastBidTime: new Date(bidData.timestamp)
      }));

      // Add to bid history
      setBidHistory(prev => [bidData, ...prev.slice(0, 19)]); // Keep last 20 bids
    });

    newSocket.on('auction-finished', (data) => {
      console.log('🏁 Auction finished:', data);
      setAuctionData(prev => ({
        ...prev,
        status: 'ended',
        winner: data.winner,
        finalPrice: data.finalPrice,
        endedAt: new Date(data.timestamp)
      }));
    });

    newSocket.on('auction-ending-soon', (data) => {
      console.log('⏰ Auction ending soon:', data);
      setAuctionData(prev => ({
        ...prev,
        timeRemaining: data.timeRemaining,
        isEndingSoon: true
      }));
    });

    newSocket.on('dashboard-update', (data) => {
      console.log('📊 Dashboard update received');
      // Handle dashboard-wide updates
    });

    newSocket.on('auction-update', (data) => {
      console.log('🔄 Auction update:', data);
      if (data.itemId === itemId) {
        setAuctionData(prev => ({
          ...prev,
          currentPrice: data.currentPrice,
          totalBids: data.totalBids
        }));
      }
    });

    newSocket.on('user-count-update', (count) => {
      setActiveUsers(count);
    });

    return () => {
      console.log('🔌 Cleaning up socket connection');
      newSocket.disconnect();
    };
  }, [user, itemId]);

  // Function to place a bid
  const placeBid = (bidData) => {
    if (socket && isConnected) {
      console.log('📤 Placing bid:', bidData);
      socket.emit('new-bid', {
        ...bidData,
        itemId,
        bidder: user?.id,
        timestamp: new Date().toISOString()
      });
    } else {
      console.error('❌ Cannot place bid: Not connected to server');
      throw new Error('Not connected to auction server');
    }
  };

  // Function to join a specific auction
  const joinAuction = (auctionId) => {
    if (socket && isConnected) {
      console.log('🎯 Joining auction:', auctionId);
      socket.emit('join-auction', auctionId);
    }
  };

  // Function to leave an auction
  const leaveAuction = (auctionId) => {
    if (socket && isConnected) {
      console.log('🚪 Leaving auction:', auctionId);
      socket.emit('leave-auction', auctionId);
    }
  };

  // Function to get current auction status
  const getAuctionStatus = () => {
    return {
      isConnected,
      auctionData,
      bidHistory,
      activeUsers,
      connectionError
    };
  };

  // Function to manually reconnect
  const reconnect = () => {
    if (socket && !isConnected) {
      console.log('🔄 Attempting manual reconnection...');
      socket.connect();
    }
  };

  return {
    socket,
    isConnected,
    auctionData,
    bidHistory,
    activeUsers,
    connectionError,
    placeBid,
    joinAuction,
    leaveAuction,
    getAuctionStatus,
    reconnect
  };
};

export default useRealTimeAuctions;
