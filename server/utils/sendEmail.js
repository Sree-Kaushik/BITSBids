const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    // Check if email is configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('📧 Email service not configured - using development mode');
      console.log(`📧 Would send email to: ${to}`);
      console.log(`📧 Subject: ${subject}`);
      console.log(`📧 Content: ${text}`);
      
      // For development - simulate successful email send
      return { success: true, messageId: 'dev-' + Date.now() };
    }

    // FIXED: Correct method name is createTransport (not createTransporter)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // Use STARTTLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false
      },
      debug: true, // Enable debug logging
      logger: true // Enable logging
    });

    // Verify transporter configuration
    console.log('🔍 Verifying email transporter...');
    await transporter.verify();
    console.log('✅ Email transporter verified successfully');

    // Enhanced email template
    const emailHtml = html || `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
        <div style="background: linear-gradient(135deg, #1a73e8, #4285f4); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🎯 BITSBids</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">BITS Pilani Student Auction Platform</p>
        </div>
        <div style="padding: 30px; background: white;">
          ${text}
        </div>
        <div style="background: #f8f9fa; padding: 20px; text-align: center;">
          <p style="margin: 0; color: #6c757d; font-size: 14px;">
            This email was sent from BITSBids. If you didn't request this, please ignore this email.
          </p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: `"BITSBids - BITS Pilani" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      text: text,
      html: emailHtml,
      priority: 'high',
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'high',
        'X-Mailer': 'BITSBids Platform'
      }
    };

    console.log(`📧 Attempting to send email to: ${to}`);
    console.log(`📧 From: ${process.env.EMAIL_USER}`);
    console.log(`📧 Subject: ${subject}`);

    const result = await transporter.sendMail(mailOptions);
    
    console.log(`✅ Email sent successfully!`);
    console.log(`📧 Message ID: ${result.messageId}`);
    console.log(`📧 Response: ${result.response}`);
    
    return { success: true, messageId: result.messageId, response: result.response };
  } catch (error) {
    console.error('❌ Email send error:', error);
    console.error('❌ Error code:', error.code);
    console.error('❌ Error command:', error.command);
    console.error('❌ Error response:', error.response);
    
    // Provide specific error messages
    if (error.code === 'EAUTH') {
      console.error('❌ Authentication failed - check your Gmail credentials and app password');
    } else if (error.code === 'ECONNECTION') {
      console.error('❌ Connection failed - check your internet connection');
    } else if (error.code === 'EMESSAGE') {
      console.error('❌ Message error - check email content');
    }
    
    throw error;
  }
};

module.exports = sendEmail;
