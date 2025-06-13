const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async sendEmail(to, subject, html) {
    try {
      const mailOptions = {
        from: `"BITSBids" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email sent successfully:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('❌ Email send error:', error);
      return { success: false, error: error.message };
    }
  }

  // Welcome email template
  getWelcomeEmailTemplate(userName) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1a73e8, #4285f4); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Welcome to BITSBids!</h1>
        </div>
        <div style="padding: 20px; background: #f8f9fa;">
          <h2>Hello ${userName}!</h2>
          <p>Welcome to BITSBids - the premier auction platform for BITS Pilani students.</p>
          <p>You can now:</p>
          <ul>
            <li>🎯 Bid on items from fellow students</li>
            <li>💰 Sell your items through auctions</li>
            <li>🔔 Get real-time notifications</li>
            <li>📱 Access from any device</li>
          </ul>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.CLIENT_URL}/dashboard" 
               style="background: #1a73e8; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
              Go to Dashboard
            </a>
          </div>
        </div>
      </div>
    `;
  }

  // Bid notification template
  getBidNotificationTemplate(itemTitle, bidAmount, bidderName) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #28a745; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">New Bid Received!</h1>
        </div>
        <div style="padding: 20px;">
          <h2>Great news!</h2>
          <p>Your item "<strong>${itemTitle}</strong>" has received a new bid.</p>
          <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p><strong>Bid Amount:</strong> ₹${bidAmount}</p>
            <p><strong>Bidder:</strong> ${bidderName}</p>
          </div>
          <div style="text-align: center;">
            <a href="${process.env.CLIENT_URL}/dashboard" 
               style="background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
              View Details
            </a>
          </div>
        </div>
      </div>
    `;
  }

  // Auction ending template
  getAuctionEndingTemplate(itemTitle, timeLeft) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #ffc107; padding: 20px; text-align: center;">
          <h1 style="color: #212529; margin: 0;">⏰ Auction Ending Soon!</h1>
        </div>
        <div style="padding: 20px;">
          <h2>Don't miss out!</h2>
          <p>Your auction for "<strong>${itemTitle}</strong>" is ending soon.</p>
          <div style="background: #fff3cd; padding: 15px; border-radius: 6px; margin: 20px 0; text-align: center;">
            <p style="font-size: 18px; margin: 0;"><strong>Time Remaining: ${timeLeft}</strong></p>
          </div>
          <div style="text-align: center;">
            <a href="${process.env.CLIENT_URL}/dashboard" 
               style="background: #ffc107; color: #212529; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
              Check Auction
            </a>
          </div>
        </div>
      </div>
    `;
  }

  // Send welcome email
  async sendWelcomeEmail(userEmail, userName) {
    const subject = 'Welcome to BITSBids! 🎉';
    const html = this.getWelcomeEmailTemplate(userName);
    return await this.sendEmail(userEmail, subject, html);
  }

  // Send bid notification
  async sendBidNotification(sellerEmail, itemTitle, bidAmount, bidderName) {
    const subject = `New bid on your item: ${itemTitle}`;
    const html = this.getBidNotificationTemplate(itemTitle, bidAmount, bidderName);
    return await this.sendEmail(sellerEmail, subject, html);
  }

  // Send auction ending notification
  async sendAuctionEndingNotification(sellerEmail, itemTitle, timeLeft) {
    const subject = `⏰ Your auction is ending soon: ${itemTitle}`;
    const html = this.getAuctionEndingTemplate(itemTitle, timeLeft);
    return await this.sendEmail(sellerEmail, subject, html);
  }
}

module.exports = new EmailService();
