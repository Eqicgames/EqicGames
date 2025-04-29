/**
 * User Controller
 * Handles logic for user-related operations
 */

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Register a new user
exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res.status(400).json({ 
        success: false, 
        message: 'User already exists with this email or username'
      });
    }

    // Create new user
    user = new User({
      username,
      email,
      password
    });

    // Hash password before saving
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // Generate JWT token
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      token,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// Login user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Update last login
    user.lastLogin = Date.now();
    await user.save();

    // Generate JWT token
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    res.json({ success: true, user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const { username, avatar, bio, preferences, socialLinks } = req.body;

    const updateData = {};
    if (username) updateData.username = username;
    if (avatar) updateData.avatar = avatar;
    if (bio) updateData.bio = bio;
    if (preferences) updateData.preferences = preferences;
    if (socialLinks) updateData.socialLinks = socialLinks;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// Connect wallet
exports.connectWallet = async (req, res) => {
  try {
    const { walletAddress, walletType } = req.body;

    if (!walletAddress) {
      return res.status(400).json({ 
        success: false, 
        message: 'Wallet address is required' 
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Check if wallet is already connected
    const walletExists = user.walletAddresses.some(w => 
      w.address === walletAddress
    );

    if (walletExists) {
      return res.status(400).json({ 
        success: false, 
        message: 'Wallet already connected' 
      });
    }

    // Add new wallet
    user.walletAddresses.push({
      address: walletAddress,
      type: walletType || 'unknown',
      isPrimary: user.walletAddresses.length === 0
    });

    await user.save();

    res.json({ 
      success: true, 
      message: 'Wallet connected successfully',
      wallets: user.walletAddresses
    });
  } catch (error) {
    console.error('Connect wallet error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// Get user assets
exports.getUserAssets = async (req, res) => {
  try {
    // This would normally include logic to fetch assets from blockchain
    res.json({ 
      success: true, 
      message: 'Assets endpoint - implementation pending',
      assets: []
    });
  } catch (error) {
    console.error('Get assets error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// Get user transactions
exports.getUserTransactions = async (req, res) => {
  try {
    // This would normally include logic to fetch transaction history
    res.json({ 
      success: true, 
      message: 'Transactions endpoint - implementation pending',
      transactions: []
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// Delete user account
exports.deleteUserAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    await User.findByIdAndDelete(req.user.id);

    res.json({ 
      success: true, 
      message: 'User account deleted successfully' 
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// Admin: List all users (restricted to admin role)
exports.adminListUsers = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Admin privileges required' 
      });
    }

    const users = await User.find().select('-password');
    res.json({ success: true, users });
  } catch (error) {
    console.error('Admin list users error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
}; 