const nodemailer = require('nodemailer');

const sendEmailMailtrap = async ({ to, subject, text, html }) => {
  try {
    // Mailtrap configuration for testing
    const transporter = nodemailer.createTransporter({
      host: 'sandbox.smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: 'your-mailtrap-username', // Get from mailtrap.io
        pass: 'your-mailtrap-password'  // Get from mailtrap.io
      }
    });

    const mailOptions = {
      from: '"BITSBids Test" <test@bitsbids.com>',
      to: to,
      subject: subject,
      text: text,
      html: html
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Test email sent to Mailtrap:', result.messageId);
    
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Mailtrap email error:', error);
    throw error;
  }
};

module.exports = sendEmailMailtrap;
