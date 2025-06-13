const nodemailer = require('nodemailer');
const twilio = require('twilio');
const webpush = require('web-push');
const User = require('../models/User');
const Notification = require('../models/Notification');

class NotificationService {
  constructor() {
    // Email setup
    this.emailTransporter = nodemailer.createTransporter({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // SMS setup (Twilio)
    this.smsClient = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    // Push notification setup
    webpush.setVapidDetails(
      'mailto:' + process.env.EMAIL_USER,
      process.env.VAPID_PUBLIC_KEY,
      process.env.VAPID_PRIVATE_KEY
    );
  }

  // Send email notification
  async sendEmail(to, subject, template, data) {
    try {
      const htmlContent = this.generateEmailTemplate(template, data);
      
      const mailOptions = {
        from: `BITSBids <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html: htmlContent
      };

      const result = await this.emailTransporter.sendMail(mailOptions);
      console.log('Email sent successfully:', result.messageId);
      return result;
    } catch (error) {
      console.error('Email sending failed:', error);
      throw error;
    }
  }

  // Send SMS notification
  async sendSMS(to, message) {
    try {
      if (!process.env.TWILIO_PHONE_NUMBER) {
        throw new Error('Twilio phone number not configured');
      }

      const result = await this.smsClient.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: to
      });

      console.log('SMS sent successfully:', result.sid);
      return result;
    } catch (error) {
      console.error('SMS sending failed:', error);
      throw error;
    }
  }

  // Send push notification
  async sendPushNotification(userId, title, body, data = {}) {
    try {
      const user = await User.findById(userId);
      if (!user || !user.pushSubscriptions || user.pushSubscriptions.length === 0) {
        return;
      }

      const payload = JSON.stringify({
        title,
        body,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        data: {
          url: data.url || '/',
          ...data
        }
      });

      const promises = user.pushSubscriptions.map(subscription => 
        webpush.sendNotification(subscription, payload)
          .catch(error => {
            console.error('Push notification failed:', error);
            // Remove invalid subscription
            if (error.statusCode === 410) {
              this.removeInvalidSubscription(userId, subscription);
            }
          })
      );

      await Promise.allSettled(promises);
      console.log('Push notifications sent');
    } catch (error) {
      console.error('Push notification error:', error);
    }
  }

  // Remove invalid push subscription
  async removeInvalidSubscription(userId, subscription) {
    try {
      await User.findByIdAndUpdate(userId, {
        $pull: { pushSubscriptions: subscription }
      });
    } catch (error) {
      console.error('Error removing invalid subscription:', error);
    }
  }

  // Create in-app notification
  async createNotification(userId, type, title, message, data = {}) {
    try {
      const notification = await Notification.create({
        user: userId,
        type,
        title,
        message,
        data,
        createdAt: new Date()
      });

      // Emit real-time notification
      const io = require('../server').io;
      if (io) {
        io.to(`user-${userId}`).emit('new-notification', notification);
      }

      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  // Send comprehensive notification (all channels)
  async sendNotification(userId, type, data) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const notificationConfig = this.getNotificationConfig(type, data);
      
      // Create in-app notification
      await this.createNotification(
        userId, 
        type, 
        notificationConfig.title, 
        notificationConfig.message, 
        data
      );

      // Send email if user has email notifications enabled
      if (user.emailNotifications !== false) {
        await this.sendEmail(
          user.email,
          notificationConfig.emailSubject,
          type,
          { user, ...data }
        );
      }

      // Send SMS if user has SMS notifications enabled and phone number
      if (user.smsNotifications && user.phoneNumber) {
        await this.sendSMS(
          user.phoneNumber,
          notificationConfig.smsMessage
        );
      }

      // Send push notification
      await this.sendPushNotification(
        userId,
        notificationConfig.title,
        notificationConfig.message,
        { type, ...data }
      );

    } catch (error) {
      console.error('Error sending comprehensive notification:', error);
    }
  }

  // Get notification configuration based on type
  getNotificationConfig(type, data) {
    const configs = {
      'bid_placed': {
        title: 'New Bid Placed',
        message: `Someone bid ₹${data.amount?.toLocaleString()} on your item "${data.itemTitle}"`,
        emailSubject: 'New Bid on Your Item - BITSBids',
        smsMessage: `New bid of ₹${data.amount?.toLocaleString()} on ${data.itemTitle}. Check BITSBids app.`
      },
      'outbid': {
        title: 'You\'ve Been Outbid',
        message: `You were outbid on "${data.itemTitle}". Current price: ₹${data.currentPrice?.toLocaleString()}`,
        emailSubject: 'You\'ve Been Outbid - BITSBids',
        smsMessage: `Outbid on ${data.itemTitle}. New price: ₹${data.currentPrice?.toLocaleString()}`
      },
      'auction_won': {
        title: 'Congratulations! You Won',
        message: `You won the auction for "${data.itemTitle}" at ₹${data.winningPrice?.toLocaleString()}`,
        emailSubject: 'Auction Won - BITSBids',
        smsMessage: `Congratulations! You won ${data.itemTitle} for ₹${data.winningPrice?.toLocaleString()}`
      },
      'auction_ending': {
        title: 'Auction Ending Soon',
        message: `"${data.itemTitle}" auction ends in ${data.timeRemaining}`,
        emailSubject: 'Auction Ending Soon - BITSBids',
        smsMessage: `${data.itemTitle} auction ends in ${data.timeRemaining}. Place your bid now!`
      },
      'item_sold': {
        title: 'Item Sold',
        message: `Your item "${data.itemTitle}" sold for ₹${data.finalPrice?.toLocaleString()}`,
        emailSubject: 'Item Sold - BITSBids',
        smsMessage: `${data.itemTitle} sold for ₹${data.finalPrice?.toLocaleString()}. Congratulations!`
      }
    };

    return configs[type] || {
      title: 'BITSBids Notification',
      message: 'You have a new notification',
      emailSubject: 'Notification - BITSBids',
      smsMessage: 'You have a new notification from BITSBids'
    };
  }

  // Generate email templates
  generateEmailTemplate(type, data) {
    const baseTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>BITSBids Notification</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1a73e8; color: white; padding: 20px; text-align: center; }
          .content { background: white; padding: 30px; border: 1px solid #ddd; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #666; }
          .btn { display: inline-block; background: #1a73e8; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
          .highlight { background: #e3f2fd; padding: 15px; border-left: 4px solid #1a73e8; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>BITSBids</h1>
            <p>Student Marketplace</p>
          </div>
          <div class="content">
            ${this.getEmailContent(type, data)}
          </div>
          <div class="footer">
            <p>This is an automated message from BITSBids.</p>
            <p>Visit <a href="${process.env.CLIENT_URL}">BITSBids</a> to manage your account.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return baseTemplate;
  }

  // Get specific email content based on type
  getEmailContent(type, data) {
    switch (type) {
      case 'bid_placed':
        return `
          <h2>New Bid on Your Item!</h2>
          <div class="highlight">
            <h3>${data.itemTitle}</h3>
            <p><strong>New Bid Amount:</strong> ₹${data.amount?.toLocaleString()}</p>
            <p><strong>Bidder:</strong> ${data.bidderName}</p>
            <p><strong>Total Bids:</strong> ${data.totalBids}</p>
          </div>
          <p>Someone just placed a bid on your item. Check your dashboard for more details.</p>
          <a href="${process.env.CLIENT_URL}/item/${data.itemId}" class="btn">View Item</a>
        `;
      
      case 'outbid':
        return `
          <h2>You've Been Outbid</h2>
          <div class="highlight">
            <h3>${data.itemTitle}</h3>
            <p><strong>Your Bid:</strong> ₹${data.yourBid?.toLocaleString()}</p>
            <p><strong>Current Price:</strong> ₹${data.currentPrice?.toLocaleString()}</p>
            <p><strong>Time Remaining:</strong> ${data.timeRemaining}</p>
          </div>
          <p>Don't let this opportunity slip away. Place a higher bid now!</p>
          <a href="${process.env.CLIENT_URL}/item/${data.itemId}" class="btn">Place New Bid</a>
        `;

      case 'auction_won':
        return `
          <h2>Congratulations! You Won the Auction</h2>
          <div class="highlight">
            <h3>${data.itemTitle}</h3>
            <p><strong>Winning Price:</strong> ₹${data.winningPrice?.toLocaleString()}</p>
            <p><strong>Seller:</strong> ${data.sellerName}</p>
          </div>
          <p>You have successfully won this auction. The seller will contact you soon for payment and delivery details.</p>
          <a href="${process.env.CLIENT_URL}/dashboard" class="btn">View Dashboard</a>
        `;

      default:
        return `
          <h2>BITSBids Notification</h2>
          <p>You have a new notification from BITSBids.</p>
          <a href="${process.env.CLIENT_URL}/dashboard" class="btn">View Dashboard</a>
        `;
    }
  }

  // Bulk notification sending
  async sendBulkNotifications(userIds, type, data) {
    try {
      const promises = userIds.map(userId => 
        this.sendNotification(userId, type, data)
          .catch(error => console.error(`Failed to send notification to user ${userId}:`, error))
      );

      await Promise.allSettled(promises);
      console.log(`Bulk notifications sent to ${userIds.length} users`);
    } catch (error) {
      console.error('Bulk notification error:', error);
    }
  }

  // Schedule notification
  async scheduleNotification(userId, type, data, sendAt) {
    try {
      const delay = new Date(sendAt).getTime() - Date.now();
      
      if (delay > 0) {
        setTimeout(() => {
          this.sendNotification(userId, type, data);
        }, delay);
        
        console.log(`Notification scheduled for ${sendAt}`);
      }
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  }
}

module.exports = new NotificationService();
