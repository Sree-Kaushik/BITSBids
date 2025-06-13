const User = require('../models/User');
const { validationResult } = require('express-validator');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

// Generate 6-digit OTP
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Request password reset - send OTP
const requestPasswordReset = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email address. Please check your email or register first.'
      });
    }

    // Check if user is locked
    if (user.isLocked) {
      return res.status(423).json({
        success: false,
        message: 'Account is temporarily locked due to multiple failed attempts. Please try again later.'
      });
    }

    // Enhanced rate limiting - max 3 requests per 15 minutes
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    const currentAttempts = user.passwordResetAttempts || 0;
    const lastRequest = user.lastPasswordResetRequest;

    // Reset attempts if more than 15 minutes have passed
    if (!lastRequest || lastRequest < fifteenMinutesAgo) {
      user.passwordResetAttempts = 0;
    }

    // Check rate limiting
    if (lastRequest && lastRequest > fifteenMinutesAgo && currentAttempts >= 3) {
      const timeLeft = Math.ceil((lastRequest.getTime() + 15 * 60 * 1000 - Date.now()) / (1000 * 60));
      return res.status(429).json({
        success: false,
        message: `Too many password reset requests. Please try again in ${timeLeft} minute(s).`,
        retryAfter: timeLeft,
        maxAttempts: 3,
        attemptsUsed: currentAttempts
      });
    }

    const otp = generateOtp();
    const otpExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes

    // Save OTP hash and expiry
    const otpHash = crypto.createHash('sha256').update(otp).digest('hex');

    const newAttempts = currentAttempts + 1;

    user.passwordResetOtp = otpHash;
    user.passwordResetOtpExpiry = otpExpiry;
    user.passwordResetAttempts = newAttempts;
    user.lastPasswordResetRequest = new Date();
    await user.save();

    // Enhanced email content with better styling
    const emailText = `
      <div style="text-align: center;">
        <div style="background: linear-gradient(135deg, #1a73e8, #4285f4); color: white; padding: 20px; border-radius: 12px; margin-bottom: 30px;">
          <h2 style="margin: 0; font-size: 24px; font-weight: 700;">🔐 Password Reset Request</h2>
        </div>
        <p style="font-size: 18px; margin-bottom: 30px; color: #333;">Hello <strong>${user.firstName}</strong>,</p>
        <p style="margin-bottom: 25px; color: #555; font-size: 16px;">You requested to reset your password for your BITSBids account.</p>
        
        <div style="background: linear-gradient(135deg, #f8f9fa, #e9ecef); padding: 30px; border-radius: 15px; margin: 30px 0; border: 2px solid #1a73e8;">
          <p style="margin: 0 0 15px 0; font-size: 16px; color: #6c757d; font-weight: 600;">Your One-Time Password (OTP) is:</p>
          <div style="background: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); margin: 15px 0;">
            <h1 style="color: #1a73e8; font-size: 42px; margin: 0; letter-spacing: 8px; font-family: 'Courier New', monospace; font-weight: bold; text-shadow: 0 2px 4px rgba(26, 115, 232, 0.2);">${otp}</h1>
          </div>
          <p style="margin: 15px 0 0 0; font-size: 14px; color: #dc3545; font-weight: 600;">⏰ Valid for 15 minutes only</p>
        </div>
        
        <div style="background: #fff3cd; padding: 20px; border-radius: 10px; margin: 25px 0; border-left: 4px solid #ffc107;">
          <p style="margin: 0; font-size: 14px; color: #856404; font-weight: 500;">
            <strong>🛡️ Security Note:</strong> If you didn't request this password reset, please ignore this email and consider changing your password immediately.
          </p>
        </div>
        
        <div style="margin-top: 30px; padding: 20px; background: linear-gradient(135deg, #e3f2fd, #bbdefb); border-radius: 10px;">
          <p style="margin: 0; font-size: 14px; color: #1976d2; font-weight: 500;">
            📧 Attempts remaining: <strong>${3 - newAttempts}</strong> out of 3
          </p>
        </div>
      </div>
    `;

    try {
      await sendEmail({
        to: user.email,
        subject: '🔐 BITSBids Password Reset - Your OTP Code',
        text: `Your OTP for password reset is: ${otp}. It is valid for 15 minutes. If you didn't request this, please ignore this email.`,
        html: emailText
      });

      // Enhanced development mode logging
      if (process.env.NODE_ENV === 'development') {
        console.log(`\n🔐 ===== DEVELOPMENT MODE OTP =====`);
        console.log(`📧 Email: ${user.email}`);
        console.log(`🔢 OTP: ${otp}`);
        console.log(`⏰ Expires: ${new Date(otpExpiry).toLocaleString()}`);
        console.log(`🔄 Attempt: ${newAttempts}/3`);
        console.log(`================================\n`);
      }

      res.status(200).json({
        success: true,
        message: 'OTP sent to your email address successfully',
        data: {
          email: user.email,
          expiresIn: '15 minutes',
          attemptsRemaining: 3 - newAttempts,
          maxAttempts: 3,
          // In development, include OTP in response for testing
          ...(process.env.NODE_ENV === 'development' && { 
            developmentOtp: otp,
            note: 'Check server console for OTP (development mode)',
            expiresAt: new Date(otpExpiry).toISOString()
          })
        }
      });
    } catch (emailError) {
      console.error('❌ Email sending failed:', emailError);
      
      // In development mode, still allow the process to continue
      if (process.env.NODE_ENV === 'development') {
        console.log(`\n🔐 ===== EMAIL FAILED - DEV MODE =====`);
        console.log(`📧 Email: ${user.email}`);
        console.log(`🔢 OTP: ${otp}`);
        console.log(`❌ Error: ${emailError.message}`);
        console.log(`================================\n`);
        
        res.status(200).json({
          success: true,
          message: 'OTP generated (email service unavailable in development)',
          data: {
            email: user.email,
            expiresIn: '15 minutes',
            developmentOtp: otp,
            note: 'Email service not configured - use the OTP shown in server console',
            emailError: emailError.message
          }
        });
      } else {
        // Clear the saved OTP if email fails in production
        user.passwordResetOtp = undefined;
        user.passwordResetOtpExpiry = undefined;
        await user.save();
        
        res.status(500).json({
          success: false,
          message: 'Failed to send OTP email. Please try again later.'
        });
      }
    }
  } catch (error) {
    console.error('❌ Request password reset error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while processing password reset request'
    });
  }
};

// Resend OTP - Enhanced version
const resendOtp = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email address.'
      });
    }

    // Check if there's an active OTP session
    if (!user.passwordResetOtp || !user.passwordResetOtpExpiry) {
      return res.status(400).json({
        success: false,
        message: 'No active password reset session found. Please start a new password reset.'
      });
    }

    // Check if previous OTP is still valid (at least 2 minutes old before allowing resend)
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
    if (user.lastPasswordResetRequest > twoMinutesAgo) {
      const timeLeft = Math.ceil((user.lastPasswordResetRequest.getTime() + 2 * 60 * 1000 - Date.now()) / 1000);
      return res.status(429).json({
        success: false,
        message: `Please wait ${timeLeft} seconds before requesting a new OTP.`,
        retryAfter: timeLeft
      });
    }

    // Generate new OTP
    const otp = generateOtp();
    const otpExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes
    const otpHash = crypto.createHash('sha256').update(otp).digest('hex');

    // Update user with new OTP
    user.passwordResetOtp = otpHash;
    user.passwordResetOtpExpiry = otpExpiry;
    user.lastPasswordResetRequest = new Date();
    await user.save();

    // Enhanced resend email template
    const emailText = `
      <div style="text-align: center;">
        <div style="background: linear-gradient(135deg, #28a745, #20c997); color: white; padding: 20px; border-radius: 12px; margin-bottom: 30px;">
          <h2 style="margin: 0; font-size: 24px; font-weight: 700;">🔄 New OTP Requested</h2>
        </div>
        <p style="font-size: 18px; margin-bottom: 30px; color: #333;">Hello <strong>${user.firstName}</strong>,</p>
        <p style="margin-bottom: 25px; color: #555; font-size: 16px;">You requested a new OTP for your password reset.</p>
        
        <div style="background: linear-gradient(135deg, #f8f9fa, #e9ecef); padding: 30px; border-radius: 15px; margin: 30px 0; border: 2px solid #28a745;">
          <p style="margin: 0 0 15px 0; font-size: 16px; color: #6c757d; font-weight: 600;">Your New One-Time Password (OTP) is:</p>
          <div style="background: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); margin: 15px 0;">
            <h1 style="color: #28a745; font-size: 42px; margin: 0; letter-spacing: 8px; font-family: 'Courier New', monospace; font-weight: bold; text-shadow: 0 2px 4px rgba(40, 167, 69, 0.2);">${otp}</h1>
          </div>
          <p style="margin: 15px 0 0 0; font-size: 14px; color: #dc3545; font-weight: 600;">⏰ Valid for 15 minutes only</p>
        </div>
        
        <div style="background: #d1ecf1; padding: 20px; border-radius: 10px; margin: 25px 0; border-left: 4px solid #17a2b8;">
          <p style="margin: 0; font-size: 14px; color: #0c5460; font-weight: 500;">
            <strong>🔄 This is a resent OTP.</strong> Your previous OTP has been invalidated.
          </p>
        </div>
      </div>
    `;

    try {
      await sendEmail({
        to: user.email,
        subject: '🔄 BITSBids Password Reset - New OTP Code',
        text: `Your new OTP for password reset is: ${otp}. It is valid for 15 minutes. Your previous OTP has been invalidated.`,
        html: emailText
      });

      // Enhanced development mode logging
      if (process.env.NODE_ENV === 'development') {
        console.log(`\n🔄 ===== RESENT OTP - DEV MODE =====`);
        console.log(`📧 Email: ${user.email}`);
        console.log(`🔢 New OTP: ${otp}`);
        console.log(`⏰ Expires: ${new Date(otpExpiry).toLocaleString()}`);
        console.log(`================================\n`);
      }

      res.status(200).json({
        success: true,
        message: 'New OTP sent to your email address successfully',
        data: {
          email: user.email,
          expiresIn: '15 minutes',
          resent: true,
          // In development, include OTP in response for testing
          ...(process.env.NODE_ENV === 'development' && { 
            developmentOtp: otp,
            note: 'Check server console for new OTP (development mode)'
          })
        }
      });
    } catch (emailError) {
      console.error('❌ Resend email failed:', emailError);
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`\n🔄 ===== RESEND FAILED - DEV MODE =====`);
        console.log(`📧 Email: ${user.email}`);
        console.log(`🔢 New OTP: ${otp}`);
        console.log(`❌ Error: ${emailError.message}`);
        console.log(`================================\n`);
        
        res.status(200).json({
          success: true,
          message: 'New OTP generated (email service unavailable in development)',
          data: {
            email: user.email,
            developmentOtp: otp,
            note: 'Email service not configured - use the OTP shown in server console'
          }
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to send new OTP email. Please try again later.'
        });
      }
    }
  } catch (error) {
    console.error('❌ Resend OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while resending OTP'
    });
  }
};

// Verify OTP - Enhanced version
const verifyOtp = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { email, otp } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user || !user.passwordResetOtp || !user.passwordResetOtpExpiry) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP. Please request a new one.',
        code: 'OTP_NOT_FOUND'
      });
    }

    if (user.passwordResetOtpExpiry < Date.now()) {
      // Clear expired OTP
      user.passwordResetOtp = undefined;
      user.passwordResetOtpExpiry = undefined;
      await user.save();
      
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.',
        code: 'OTP_EXPIRED'
      });
    }

    const otpHash = crypto.createHash('sha256').update(otp).digest('hex');

    if (otpHash !== user.passwordResetOtp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP. Please check and try again.',
        code: 'OTP_INVALID'
      });
    }

    console.log(`✅ OTP verified successfully for user: ${user.email}`);

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      data: {
        email: user.email,
        verified: true,
        expiresAt: new Date(user.passwordResetOtpExpiry).toISOString()
      }
    });
  } catch (error) {
    console.error('❌ Verify OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while verifying OTP'
    });
  }
};

// Reset password - Enhanced version
const resetPassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user || !user.passwordResetOtp || !user.passwordResetOtpExpiry) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP. Please request a new one.',
        code: 'OTP_NOT_FOUND'
      });
    }

    if (user.passwordResetOtpExpiry < Date.now()) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.',
        code: 'OTP_EXPIRED'
      });
    }

    const otpHash = crypto.createHash('sha256').update(otp).digest('hex');

    if (otpHash !== user.passwordResetOtp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP. Please check and try again.',
        code: 'OTP_INVALID'
      });
    }

    // Update password and clear reset fields
    user.password = newPassword;
    user.passwordResetOtp = undefined;
    user.passwordResetOtpExpiry = undefined;
    user.passwordResetAttempts = 0;
    user.lastPasswordResetRequest = undefined;
    
    // Reset login attempts if any
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    
    await user.save();

    // Send confirmation email
    const confirmationText = `
      <div style="text-align: center;">
        <div style="background: linear-gradient(135deg, #28a745, #20c997); color: white; padding: 20px; border-radius: 12px; margin-bottom: 30px;">
          <h2 style="margin: 0; font-size: 24px; font-weight: 700;">✅ Password Reset Successful</h2>
        </div>
        <p style="font-size: 18px; margin-bottom: 30px; color: #333;">Hello <strong>${user.firstName}</strong>,</p>
        <p style="margin-bottom: 25px; color: #555; font-size: 16px;">Your password has been successfully reset for your BITSBids account.</p>
        
        <div style="background: #d4edda; padding: 25px; border-radius: 12px; margin: 25px 0; border-left: 4px solid #28a745;">
          <p style="margin: 0; color: #155724; font-weight: 600; font-size: 16px;">
            🔒 Your account is now secure with your new password.
          </p>
        </div>
        
        <div style="background: #fff3cd; padding: 20px; border-radius: 10px; margin: 25px 0; border-left: 4px solid #ffc107;">
          <p style="margin: 0; font-size: 14px; color: #856404; font-weight: 500;">
            <strong>🛡️ Security Alert:</strong> If you didn't make this change, please contact support immediately.
          </p>
        </div>
        
        <p style="margin-bottom: 25px; color: #555; font-size: 16px;">You can now log in with your new password.</p>
        
        <div style="margin-top: 30px;">
          <a href="${process.env.CLIENT_URL}/login" style="background: linear-gradient(135deg, #28a745, #20c997); color: white; padding: 15px 35px; text-decoration: none; border-radius: 30px; font-weight: 600; display: inline-block; box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);">
            Login Now 🚀
          </a>
        </div>
      </div>
    `;

    try {
      await sendEmail({
        to: user.email,
        subject: '✅ BITSBids Password Reset Successful',
        text: 'Your password has been successfully reset. You can now log in with your new password.',
        html: confirmationText
      });
    } catch (emailError) {
      console.error('❌ Confirmation email failed:', emailError);
      // Don't fail the password reset if confirmation email fails
    }

    console.log(`✅ Password reset successful for user: ${user.email}`);

    res.status(200).json({
      success: true,
      message: 'Password reset successfully',
      data: {
        email: user.email,
        resetAt: new Date().toISOString(),
        message: 'You can now log in with your new password'
      }
    });
  } catch (error) {
    console.error('❌ Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while resetting password'
    });
  }
};

module.exports = {
  requestPasswordReset,
  resendOtp,
  verifyOtp,
  resetPassword
};
