const Item = require('../models/Item');
const Bid = require('../models/Bid');

class SnipingPreventionService {
  // Extend auction time if bid placed in last minutes
  static async checkAndExtendAuction(itemId, bidTime) {
    try {
      const item = await Item.findById(itemId);
      if (!item || item.status !== 'active') {
        return false;
      }

      const auctionEndTime = new Date(item.auctionEndTime);
      const timeDifference = auctionEndTime.getTime() - bidTime.getTime();
      const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds

      // If bid placed within last 5 minutes, extend auction by 5 minutes
      if (timeDifference <= fiveMinutes && timeDifference > 0) {
        const newEndTime = new Date(bidTime.getTime() + fiveMinutes);
        
        await Item.findByIdAndUpdate(itemId, {
          auctionEndTime: newEndTime,
          $inc: { extensionCount: 1 }
        });

        console.log(`Auction extended for item ${itemId} until ${newEndTime}`);
        
        // Emit socket event for real-time update
        const io = require('../server').io;
        if (io) {
          io.to(`auction-${itemId}`).emit('auction-extended', {
            itemId,
            newEndTime,
            message: 'Auction extended due to last-minute bid'
          });
        }

        return true;
      }

      return false;
    } catch (error) {
      console.error('Error checking auction extension:', error);
      return false;
    }
  }

  // Get auction extension history
  static async getExtensionHistory(itemId) {
    try {
      const item = await Item.findById(itemId).select('extensionCount originalEndTime auctionEndTime');
      
      if (!item) {
        return null;
      }

      // Get bids that caused extensions
      const extensionBids = await Bid.find({
        item: itemId,
        createdAt: {
          $gte: new Date(item.originalEndTime - 5 * 60 * 1000) // 5 minutes before original end
        }
      }).populate('bidder', 'firstName lastName').sort({ createdAt: 1 });

      return {
        extensionCount: item.extensionCount || 0,
        originalEndTime: item.originalEndTime,
        currentEndTime: item.auctionEndTime,
        extensionBids
      };
    } catch (error) {
      console.error('Error getting extension history:', error);
      return null;
    }
  }

  // Set maximum extensions limit
  static async checkExtensionLimit(itemId) {
    try {
      const item = await Item.findById(itemId);
      const maxExtensions = 3; // Maximum 3 extensions per auction

      return (item.extensionCount || 0) < maxExtensions;
    } catch (error) {
      console.error('Error checking extension limit:', error);
      return false;
    }
  }
}

module.exports = SnipingPreventionService;
