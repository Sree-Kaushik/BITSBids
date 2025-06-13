import io from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  socket = null;

  connect(userId) {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        autoConnect: false,
      });

      this.socket.connect();

      this.socket.on('connect', () => {
        console.log('Connected to server');
        if (userId) {
          this.socket.emit('join-user', userId);
        }
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from server');
      });
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinAuction(itemId) {
    if (this.socket) {
      this.socket.emit('join-auction', itemId);
    }
  }

  leaveAuction(itemId) {
    if (this.socket) {
      this.socket.emit('leave-auction', itemId);
    }
  }

  placeBid(bidData) {
    if (this.socket) {
      this.socket.emit('new-bid', bidData);
    }
  }

  onBidUpdate(callback) {
    if (this.socket) {
      this.socket.on('bid-update', callback);
    }
  }

  onAuctionFinished(callback) {
    if (this.socket) {
      this.socket.on('auction-finished', callback);
    }
  }

  offBidUpdate() {
    if (this.socket) {
      this.socket.off('bid-update');
    }
  }

  offAuctionFinished() {
    if (this.socket) {
      this.socket.off('auction-finished');
    }
  }
}

export default new SocketService();
