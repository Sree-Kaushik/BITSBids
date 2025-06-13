const Item = require('../models/Item');
const Bid = require('../models/Bid');
const User = require('../models/User');

class AuctionService {
  // Update auction statuses based on end times
  static async updateAuctionStatuses() {
    try {
      const now = new Date();
      
      // Find all active auctions that have ended
      const endedAuctions = await Item.find({
        status: 'active',
        auctionEndTime: { $lte: now }
      }).populate('seller', 'firstName lastName email');

      console.log(`🔄 Checking ${endedAuctions.length} ended auctions...`);

      for (const auction of endedAuctions) {
        await this.finalizeAuction(auction._id);
      }

      // Start auctions that should be active now
      const auctionsToStart = await Item.find({
        status: 'draft',
        auctionStartTime: { $lte: now },
        auctionEndTime: { $gt: now }
      });

      for (const auction of auctionsToStart) {
        await Item.findByIdAndUpdate(auction._id, { status: 'active' });
        console.log(`🚀 Started auction for: ${auction.title}`);
      }

      return {
        endedCount: endedAuctions.length,
        startedCount: auctionsToStart.length
      };
    } catch (error) {
      console.error('Error updating auction statuses:', error);
      throw error;
    }
  }

  // Finalize an ended auction
  static async finalizeAuction(auctionId) {
    try {
      const auction = await Item.findById(auctionId).populate('seller');
      if (!auction) {
        throw new Error('Auction not found');
      }

      // Find the highest bid
      const highestBid = await Bid.findOne({ 
        item: auctionId 
      }).sort({ amount: -1 }).populate('bidder', 'firstName lastName email');

      if (highestBid) {
        // Update item with winner
        await Item.findByIdAndUpdate(auctionId, {
          status: 'sold',
          winner: highestBid.bidder._id,
          finalPrice: highestBid.amount,
          soldAt: new Date()
        });

        // Mark winning bid
        await Bid.findByIdAndUpdate(highestBid._id, { isWinning: true });

        console.log(`🏆 Auction finalized: ${auction.title} - Winner: ${highestBid.bidder.firstName} - Price: ₹${highestBid.amount}`);
        
        return {
          status: 'sold',
          winner: highestBid.bidder,
          finalPrice: highestBid.amount
        };
      } else {
        // No bids, mark as ended
        await Item.findByIdAndUpdate(auctionId, { 
          status: 'ended',
          endedAt: new Date()
        });
        
        console.log(`📝 Auction ended with no bids: ${auction.title}`);
        
        return {
          status: 'ended',
          winner: null,
          finalPrice: 0
        };
      }
    } catch (error) {
      console.error(`Error finalizing auction ${auctionId}:`, error);
      throw error;
    }
  }

  // Get active auctions with filters
  static async getActiveAuctions(filters = {}) {
    try {
      const query = { 
        status: 'active',
        auctionEndTime: { $gt: new Date() },
        ...filters 
      };

      const auctions = await Item.find(query)
        .populate('seller', 'firstName lastName bitsId campus')
        .populate('highestBidder', 'firstName lastName')
        .sort({ auctionEndTime: 1 })
        .lean();

      // Add time remaining and bid count for each auction
      const enrichedAuctions = await Promise.all(
        auctions.map(async (auction) => {
          const bidCount = await Bid.countDocuments({ item: auction._id });
          const timeRemaining = auction.auctionEndTime - new Date();
          
          return {
            ...auction,
            totalBids: bidCount,
            timeRemaining: Math.max(0, timeRemaining),
            isEndingSoon: timeRemaining < 60 * 60 * 1000, // Less than 1 hour
            isUrgent: timeRemaining < 15 * 60 * 1000 // Less than 15 minutes
          };
        })
      );

      return enrichedAuctions;
    } catch (error) {
      console.error('Error getting active auctions:', error);
      throw error;
    }
  }

  // Get ending auctions (within specified minutes)
  static async getEndingAuctions(withinMinutes = 5) {
    try {
      const now = new Date();
      const endTime = new Date(now.getTime() + withinMinutes * 60 * 1000);

      const endingAuctions = await Item.find({
        status: 'active',
        auctionEndTime: { $gt: now, $lte: endTime }
      }).populate('seller', 'firstName lastName').lean();

      return endingAuctions.map(auction => ({
        ...auction,
        timeRemaining: auction.auctionEndTime - now
      }));
    } catch (error) {
      console.error('Error getting ending auctions:', error);
      throw error;
    }
  }

  // Get auction statistics
  static async getAuctionStats() {
    try {
      const stats = await Item.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            totalValue: { $sum: '$currentPrice' }
          }
        }
      ]);

      const totalBids = await Bid.countDocuments();
      const totalUsers = await User.countDocuments();
      
      return {
        stats,
        totalBids,
        totalUsers,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting auction stats:', error);
      throw error;
    }
  }

  // Get user auction activity
  static async getUserAuctionActivity(userId) {
    try {
      const userAuctions = await Item.find({ seller: userId })
        .sort({ createdAt: -1 })
        .lean();

      const userBids = await Bid.find({ bidder: userId })
        .populate('item', 'title status currentPrice auctionEndTime')
        .sort({ createdAt: -1 })
        .lean();

      return {
        auctions: userAuctions,
        bids: userBids,
        stats: {
          totalAuctions: userAuctions.length,
          activeAuctions: userAuctions.filter(a => a.status === 'active').length,
          soldAuctions: userAuctions.filter(a => a.status === 'sold').length,
          totalBids: userBids.length,
          winningBids: userBids.filter(b => b.isWinning).length
        }
      };
    } catch (error) {
      console.error('Error getting user auction activity:', error);
      throw error;
    }
  }
}

module.exports = AuctionService;
