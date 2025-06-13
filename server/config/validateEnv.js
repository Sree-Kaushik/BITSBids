const dotenv = require('dotenv');
const crypto = require('crypto');

// Load environment variables
dotenv.config();

// Required environment variables
const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'CLIENT_URL'
];

// Optional environment variables with defaults
const optionalEnvVars = {
  PORT: '5000',
  NODE_ENV: 'development',
  BCRYPT_ROUNDS: '12',
  RATE_LIMIT_WINDOW: '15',
  RATE_LIMIT_MAX: '100',
  MAX_FILE_SIZE: '5242880',
  ALLOWED_FILE_TYPES: 'jpg,jpeg,png,gif,webp'
};

// Validate environment variables
const validateEnv = () => {
  console.log('🔧 Validating environment variables...');
  
  // Check required variables
  const missingRequired = requiredEnvVars.filter(envVar => !process.env[envVar]);
  
  if (missingRequired.length > 0) {
    console.error('❌ Missing required environment variables:');
    missingRequired.forEach(envVar => {
      console.error(`   - ${envVar}`);
    });
    console.error('\n📝 Please check your .env file and ensure all required variables are set.');
    console.error('💡 Copy .env.example to .env and fill in the values.');
    process.exit(1);
  }
  
  // Set defaults for optional variables
  Object.keys(optionalEnvVars).forEach(envVar => {
    if (!process.env[envVar]) {
      process.env[envVar] = optionalEnvVars[envVar];
      console.log(`⚙️  Set default value for ${envVar}: ${optionalEnvVars[envVar]}`);
    }
  });
  
  // Validate JWT secret strength
  if (process.env.JWT_SECRET.length < 32) {
    console.warn('⚠️  JWT_SECRET is too short. Consider using a longer secret for better security.');
  }
  
  // Validate MongoDB URI format
  if (!process.env.MONGODB_URI.startsWith('mongodb://') && !process.env.MONGODB_URI.startsWith('mongodb+srv://')) {
    console.error('❌ Invalid MONGODB_URI format. Must start with mongodb:// or mongodb+srv://');
    process.exit(1);
  }
  
  // Validate CLIENT_URL format
  if (!process.env.CLIENT_URL.startsWith('http://') && !process.env.CLIENT_URL.startsWith('https://')) {
    console.error('❌ Invalid CLIENT_URL format. Must start with http:// or https://');
    process.exit(1);
  }
  
  console.log('✅ Environment variables validated successfully');
  
  // Log configuration summary
  console.log('\n📋 Configuration Summary:');
  console.log(`   🌐 Environment: ${process.env.NODE_ENV}`);
  console.log(`   🚀 Port: ${process.env.PORT}`);
  console.log(`   🔗 Client URL: ${process.env.CLIENT_URL}`);
  console.log(`   💾 Database: ${process.env.MONGODB_URI.includes('localhost') ? 'Local' : 'Remote'}`);
  console.log(`   🔐 JWT Secret: ${process.env.JWT_SECRET ? 'Set' : 'Not Set'}`);
  console.log(`   📧 Email: ${process.env.EMAIL_USER ? 'Configured' : 'Not Configured'}`);
  console.log(`   ☁️  Cloudinary: ${process.env.CLOUDINARY_CLOUD_NAME ? 'Configured' : 'Not Configured'}`);
  console.log(`   💳 Razorpay: ${process.env.RAZORPAY_KEY_ID ? 'Configured' : 'Not Configured'}`);
};

// Generate secure JWT secret if needed
const generateJWTSecret = () => {
  return crypto.randomBytes(64).toString('hex');
};

module.exports = {
  validateEnv,
  generateJWTSecret
};
