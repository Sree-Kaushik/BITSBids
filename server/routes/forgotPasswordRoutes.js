const express = require('express');
const { body } = require('express-validator');
const {
  requestPasswordReset,
  resendOtp,
  verifyOtp,
  resetPassword
} = require('../controllers/forgotPasswordController');

const router = express.Router();

// Enhanced validation rules
const emailValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required')
    .custom((value) => {
      // Check if it's a BITS email (optional validation)
      const bitsEmailPattern = /@(pilani|goa|hyderabad|dubai)\.bits-pilani\.ac\.in$/;
      if (!bitsEmailPattern.test(value)) {
        console.log(`⚠️ Non-BITS email used: ${value}`);
      }
      return true; // Allow all emails for now
    })
];

const otpValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('otp')
    .isLength({ min: 6, max: 6 })
    .withMessage('OTP must be exactly 6 digits')
    .isNumeric()
    .withMessage('OTP must contain only numbers')
];

const resetPasswordValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('otp')
    .isLength({ min: 6, max: 6 })
    .withMessage('OTP must be exactly 6 digits')
    .isNumeric()
    .withMessage('OTP must contain only numbers'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
];

// Routes
router.post('/request-reset', emailValidation, requestPasswordReset);
router.post('/resend-otp', emailValidation, resendOtp);
router.post('/verify-otp', otpValidation, verifyOtp);
router.post('/reset-password', resetPasswordValidation, resetPassword);

// Development only: Reset rate limiting for a user
if (process.env.NODE_ENV === 'development') {
  router.post('/dev-reset-limits', async (req, res) => {
    try {
      const User = require('../models/User');
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email is required'
        });
      }
      
      const user = await User.findOne({ email: email.toLowerCase() });
      
      if (user) {
        user.passwordResetAttempts = 0;
        user.lastPasswordResetRequest = undefined;
        user.passwordResetOtp = undefined;
        user.passwordResetOtpExpiry = undefined;
        user.loginAttempts = 0;
        user.lockUntil = undefined;
        await user.save();
        
        res.json({
          success: true,
          message: 'All limits reset for user',
          data: {
            email: user.email,
            resetFields: ['passwordResetAttempts', 'lastPasswordResetRequest', 'passwordResetOtp', 'passwordResetOtpExpiry', 'loginAttempts', 'lockUntil']
          }
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error resetting limits',
        error: error.message
      });
    }
  });
}

module.exports = router;
