const sendEmail = require('./utils/sendEmail');
require('dotenv').config();

const testEmailConfiguration = async () => {
  try {
    console.log('🧪 Testing email configuration...');
    console.log('📧 Email User:', process.env.EMAIL_USER ? 'SET' : 'NOT SET');
    console.log('📧 Email Pass:', process.env.EMAIL_PASS ? 'SET' : 'NOT SET');
    
    const result = await sendEmail({
      to: 'test@example.com', // Use a test email first
      subject: '🧪 BITSBids Email Test',
      text: 'This is a test email from BITSBids to verify email configuration.',
      html: `
        <h2>🧪 Email Test Successful!</h2>
        <p>If you receive this email, your BITSBids email configuration is working correctly.</p>
        <p><strong>Test Time:</strong> ${new Date().toISOString()}</p>
      `
    });
    
    console.log('✅ Test email sent successfully:', result);
  } catch (error) {
    console.error('❌ Test email failed:', error.message);
  }
};

testEmailConfiguration();
