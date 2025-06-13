const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    minlength: [2, 'First name must be at least 2 characters'],
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    minlength: [2, 'Last name must be at least 2 characters'],
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    validate: {
      validator: function(email) {
        // BITS email format: f20220045@hyderabad.bits-pilani.ac.in
        return /^[a-z]\d{8}@(pilani|goa|hyderabad|dubai)\.bits-pilani\.ac\.in$/.test(email);
      },
      message: 'Please enter a valid BITS email address (e.g., f20220045@hyderabad.bits-pilani.ac.in)'
    }
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  campus: {
    type: String,
    required: [true, 'Campus is required'],
    enum: {
      values: ['pilani', 'goa', 'hyderabad', 'dubai'],
      message: 'Campus must be one of: pilani, goa, hyderabad, dubai'
    }
  },
  year: {
    type: String,
    required: [true, 'Year is required'],
    enum: {
      values: ['1', '2', '3', '4', '5'],
      message: 'Year must be between 1 and 5'
    }
  },
  bitsId: {
    type: String,
    required: [true, 'BITS ID is required'],
    unique: true,
    uppercase: true,
    validate: {
      validator: function(id) {
        // Format: 2022A70045H (Year + Branch + StudentID + Campus)
        // Branches: A1, A2, A3, A4, A5, A7, A8, A9, AB
        // Campus: H, G, P, D
        return /^\d{4}(A[1-9]|AB)\d{4}[HGPD]$/.test(id);
      },
      message: 'Please enter a valid BITS ID (e.g., 2022A70045H)'
    }
  },
  branch: {
    type: String,
    required: [true, 'Branch is required'],
    enum: {
      values: [
        'Computer Science Engineering',
        'Electronics & Communication Engineering', 
        'Mechanical Engineering',
        'Chemical Engineering',
        'Civil Engineering',
        'Electrical & Electronics Engineering',
        'Biotechnology',
        'Manufacturing Engineering',
        'Economics',
        'Mathematics',
        'Physics',
        'Chemistry',
        'Pharmacy'
      ],
      message: 'Please select a valid branch'
    }
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    validate: {
      validator: function(phone) {
        return /^[6-9]\d{9}$/.test(phone);
      },
      message: 'Please enter a valid 10-digit Indian phone number'
    }
  },
  avatar: {
    type: String,
    default: null
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  lastLogin: {
    type: Date,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for better performance
userSchema.index({ email: 1 });
userSchema.index({ bitsId: 1 });
userSchema.index({ campus: 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Get campus code from BITS ID
userSchema.methods.getCampusFromBitsId = function() {
  const campusCode = this.bitsId.slice(-1);
  const campusMap = {
    'H': 'hyderabad',
    'G': 'goa', 
    'P': 'pilani',
    'D': 'dubai'
  };
  return campusMap[campusCode] || null;
};

// Get branch code from BITS ID
userSchema.methods.getBranchFromBitsId = function() {
  const branchCode = this.bitsId.substring(4, 6);
  const branchMap = {
    'A1': 'Chemical Engineering',
    'A2': 'Civil Engineering',
    'A3': 'Electrical & Electronics Engineering',
    'A4': 'Mechanical Engineering',
    'A5': 'Electronics & Communication Engineering',
    'A7': 'Computer Science Engineering',
    'A8': 'Electronics & Instrumentation Engineering',
    'A9': 'Manufacturing Engineering',
    'AB': 'Biotechnology'
  };
  return branchMap[branchCode] || 'Other';
};

module.exports = mongoose.model('User', userSchema);
