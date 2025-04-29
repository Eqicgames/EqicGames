/**
 * User Model
 * Defines the schema for users in the application
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  walletAddresses: {
    type: [String],
    default: []
  },
  avatar: {
    type: String,
    default: '/images/default-avatar.png'
  },
  bio: {
    type: String,
    maxlength: 500,
    default: ''
  },
  role: {
    type: String,
    enum: ['user', 'creator', 'admin'],
    default: 'user'
  },
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system'
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      marketing: {
        type: Boolean,
        default: false
      },
      transactions: {
        type: Boolean,
        default: true
      }
    }
  },
  socialLinks: {
    twitter: {
      type: String,
      default: ''
    },
    discord: {
      type: String,
      default: ''
    },
    website: {
      type: String,
      default: ''
    }
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // Automatically manage createdAt and updatedAt
});

// Virtual field for full user profile URL
UserSchema.virtual('profileUrl').get(function() {
  return `/profile/${this.username}`;
});

// Method to safely return user data without sensitive info
UserSchema.methods.toPublicJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

// Index for faster queries
UserSchema.index({ username: 1 });
UserSchema.index({ email: 1 });
UserSchema.index({ walletAddresses: 1 });

module.exports = mongoose.model('User', UserSchema); 