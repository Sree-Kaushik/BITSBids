const express = require('express');
const { body } = require('express-validator');
const {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword
} = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = express.Router();

// Register validation
const registerValidation = [
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('First name can only contain letters and spaces'),
  
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Last name can only contain letters and spaces'),
  
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail()
    .matches(/^[a-z]\d{8}@(pilani|goa|hyderabad|dubai)\.bits-pilani\.ac\.in$/)
    .withMessage('Please enter a valid BITS email address (e.g., f20220045@hyderabad.bits-pilani.ac.in)'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  body('campus')
    .isIn(['pilani', 'goa', 'hyderabad', 'dubai'])
    .withMessage('Please select a valid campus'),
  
  body('year')
    .isIn(['1', '2', '3', '4', '5'])
    .withMessage('Please select a valid year'),
  
  body('bitsId')
    .trim()
    .toUpperCase()
    .matches(/^\d{4}(A[1-9]|AB)\d{4}[HGPD]$/)
    .withMessage('Please enter a valid BITS ID (e.g., 2022A70045H)'),
  
  body('branch')
    .notEmpty()
    .withMessage('Please select your branch'),
  
  body('phoneNumber')
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Please enter a valid 10-digit Indian phone number')
];

// Login validation
const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Forgot password validation
const forgotPasswordValidation = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail()
];

// Reset password validation
const resetPasswordValidation = [
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
];

// Routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/me', auth, getMe);
router.post('/forgot-password', forgotPasswordValidation, forgotPassword);
router.put('/reset-password/:token', resetPasswordValidation, resetPassword);

module.exports = router;
