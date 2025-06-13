const ProxyBid = require('../models/ProxyBid');
const Bid = require('../models/Bid');
const Item = require('../models/Item');
const User = require('../models/User');

class ProxyBiddingService {
  // Create or update proxy bid
  static async createProxyBid(itemId, bidderId, maxAmount) {
    try {
      // Check if user already has a proxy bid for this item
      let proxyBid = await ProxyBid.findOne({
        item: itemId,
        bidder: bidderId,
        isActive: true
      });

      if (proxyBid) {
        // Update existing proxy bid
        proxyBid.maxAmount = maxAmount;
        proxyBid.lastBidTime = new Date();
        await proxyBid.save();
      } else {
        // Create new proxy bid
        proxyBid = await ProxyBid.create({
          item: itemId,
          bidder: bidderId,
          maxAmount,
          currentAmount: 0
        });
      }

      // Trigger proxy bidding process
      await this.processProxyBidding(itemId);

      return proxyBid;
    } catch (error) {
      console.error('Error creating proxy bid:', error);
      throw error;
    }
  }

  // Process proxy bidding when new bid is placed
  static async processProxyBidding(itemId) {
    try {
      const item = await Item.findById(itemId);
      if (!item || item.status !== 'active') {
        return;
      }

      // Get all active proxy bids for this item, sorted by max amount
      const proxyBids = await ProxyBid.find({
        item: itemId,
        isActive: true,
        maxAmount: { $gt: item.currentPrice }
      }).sort({ maxAmount: -1 }).populate('bidder', 'firstName lastName');

      if (proxyBids.length === 0) {
        return;
      }

      // Get current highest bidder
      const currentHighestBid = await Bid.findOne({ item: itemId })
        .sort({ amount: -1 });

      let newBidAmount = item.currentPrice + (item.minimumIncrement || 50);
      let winningProxyBid = null;

      // Find the winning proxy bid
      for (const proxyBid of proxyBids) {
        // Skip if this user is already the highest bidder
        if (currentHighestBid && 
            currentHighestBid.bidder.toString() === proxyBid.bidder._id.toString()) {
          continue;
        }

        if (proxyBid.maxAmount >= newBidAmount) {
          // Calculate optimal bid amount
          const nextHighestProxy = proxyBids.find(pb => 
            pb._id.toString() !== proxyBid._id.toString() &&
            pb.maxAmount < proxyBid.maxAmount
          );

          if (nextHighestProxy) {
            newBidAmount = Math.min(
              nextHighestProxy.maxAmount + (item.minimumIncrement || 50),
              proxyBid.maxAmount
            );
          } else {
            newBidAmount = Math.min(
              item.currentPrice + (item.minimumIncrement || 50),
              proxyBid.maxAmount
            );
          }

          winningProxyBid = proxyBid;
          break;
        }
      }

      // Place the proxy bid
      if (winningProxyBid && newBidAmount <= winningProxyBid.maxAmount) {
        await this.placeProxyBid(itemId, winningProxyBid, newBidAmount);
      }

    } catch (error) {
      console.error('Error processing proxy bidding:', error);
      throw error;
    }
  }

  // Place actual bid from proxy
  static async placeProxyBid(itemId, proxyBid, amount) {
    try {
      // Create the bid
      const bid = await Bid.create({
        item: itemId,
        bidder: proxyBid.bidder._id,
        amount,
        isProxyBid: true
      });

      // Update item
      await Item.findByIdAndUpdate(itemId, {
        currentPrice: amount,
        highestBidder: proxyBid.bidder._id,
        $inc: { totalBids: 1 }
      });

      // Update proxy bid
      proxyBid.currentAmount = amount;
      proxyBid.totalBidsPlaced += 1;
      proxyBid.lastBidTime = new Date();
      await proxyBid.save();

      // Mark other bids as not winning
      await Bid.updateMany(
        { item: itemId, _id: { $ne: bid._id } },
        { isWinning: false }
      );

      // Mark this bid as winning
      await Bid.findByIdAndUpdate(bid._id, { isWinning: true });

      console.log(`Proxy bid placed: ₹${amount} for item ${itemId} by ${proxyBid.bidder.firstName}`);

      return bid;
    } catch (error) {
      console.error('Error placing proxy bid:', error);
      throw error;
    }
  }

  // Get user's proxy bids
  static async getUserProxyBids(userId) {
    try {
      const proxyBids = await ProxyBid.find({
        bidder: userId,
        isActive: true
      }).populate('item', 'title currentPrice auctionEndTime status images')
        .sort({ createdAt: -1 });

      return proxyBids;
    } catch (error) {
      console.error('Error getting user proxy bids:', error);
      throw error;
    }
  }

  // Cancel proxy bid
  static async cancelProxyBid(proxyBidId, userId) {
    try {
      const proxyBid = await ProxyBid.findOne({
        _id: proxyBidId,
        bidder: userId,
        isActive: true
      });

      if (!proxyBid) {
        throw new Error('Proxy bid not found');
      }

      proxyBid.isActive = false;
      await proxyBid.save();

      return proxyBid;
    } catch (error) {
      console.error('Error canceling proxy bid:', error);
      throw error;
    }
  }
}

module.exports = ProxyBiddingService;
