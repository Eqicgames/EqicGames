/**
 * User Controller
 * Handles business logic for user-related operations
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const Transaction = require('../../models/Transaction');
const Asset = require('../../models/Asset');
const { verifyWalletSignature } = require('../../utils/crypto');
const config = require('../../config');

/**
 * Register a new user
 * @param {String} username - User's username
 * @param {String} email - User's email
 * @param {String} password - User's password
 * @param {String} walletAddress - Optional wallet address to connect immediately
 * @returns {Object} Registration result
 */
exports.registerUser = async (username, email, password, walletAddress = null) => {
  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return { success: false, message: 'User already exists with that email' };
    }

    // Check if username is taken
    user = await User.findOne({ username });
    if (user) {
      return { success: false, message: 'Username is already taken' };
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    user = new User({
      username,
      email,
      password: hashedPassword,
      walletAddresses: walletAddress ? [walletAddress] : []
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      config.jwtSecret,
      { expiresIn: '1d' }
    );

    return {
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        walletAddresses: user.walletAddresses,
        avatar: user.avatar,
        createdAt: user.createdAt
      }
    };
  } catch (error) {
    console.error('Registration error:', error.message);
    return { success: false, message: 'Server error during registration' };
  }
};

/**
 * Login a user
 * @param {String} email - User's email
 * @param {String} password - User's password
 * @returns {Object} Login result
 */
exports.loginUser = async (email, password) => {
  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return { success: false, message: 'Invalid credentials' };
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { success: false, message: 'Invalid credentials' };
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      config.jwtSecret,
      { expiresIn: '1d' }
    );

    return {
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        walletAddresses: user.walletAddresses,
        avatar: user.avatar,
        createdAt: user.createdAt
      }
    };
  } catch (error) {
    console.error('Login error:', error.message);
    return { success: false, message: 'Server error during login' };
  }
};

/**
 * Connect wallet to user account
 * @param {String} userId - User ID
 * @param {String} walletAddress - Wallet address to connect
 * @param {String} signature - Signature to verify wallet ownership
 * @returns {Object} Connection result
 */
exports.connectWallet = async (userId, walletAddress, signature) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return { success: false, message: 'User not found' };
    }

    // Check if wallet is already connected to this user
    if (user.walletAddresses.includes(walletAddress)) {
      return { success: false, message: 'Wallet already connected to this account' };
    }

    // Check if wallet is connected to another user
    const existingUser = await User.findOne({ walletAddresses: walletAddress });
    if (existingUser) {
      return { success: false, message: 'Wallet already connected to another account' };
    }

    // Verify wallet signature
    const isVerified = await verifyWalletSignature(walletAddress, signature, userId);
    if (!isVerified) {
      return { success: false, message: 'Invalid wallet signature' };
    }

    // Add wallet to user
    user.walletAddresses.push(walletAddress);
    await user.save();

    return {
      success: true,
      message: 'Wallet connected successfully',
      walletAddresses: user.walletAddresses
    };
  } catch (error) {
    console.error('Wallet connection error:', error.message);
    return { success: false, message: 'Server error during wallet connection' };
  }
};

/**
 * Get user profile
 * @param {String} userId - User ID
 * @returns {Object} User profile
 */
exports.getUserProfile = async (userId) => {
  try {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return { success: false, message: 'User not found' };
    }

    // Get user's asset count
    const assetCount = await Asset.countDocuments({ owner: userId });

    return {
      success: true,
      user: {
        ...user.toObject(),
        assetCount
      }
    };
  } catch (error) {
    console.error('Profile retrieval error:', error.message);
    return { success: false, message: 'Server error while retrieving profile' };
  }
};

/**
 * Update user profile
 * @param {String} userId - User ID
 * @param {Object} updateData - Data to update (username, avatar, etc)
 * @returns {Object} Update result
 */
exports.updateUserProfile = async (userId, updateData) => {
  try {
    // Prevent updating sensitive fields
    const { password, email, walletAddresses, role, ...safeUpdateData } = updateData;

    // Check if username is being updated and is unique
    if (safeUpdateData.username) {
      const existingUser = await User.findOne({ 
        username: safeUpdateData.username,
        _id: { $ne: userId }
      });
      
      if (existingUser) {
        return { success: false, message: 'Username is already taken' };
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: safeUpdateData },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return { success: false, message: 'User not found' };
    }

    return {
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    };
  } catch (error) {
    console.error('Profile update error:', error.message);
    return { success: false, message: 'Server error while updating profile' };
  }
};

/**
 * Get user's owned assets
 * @param {String} userId - User ID
 * @returns {Object} User's assets
 */
exports.getUserAssets = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return { success: false, message: 'User not found' };
    }

    const assets = await Asset.find({ owner: userId })
      .populate('game')
      .sort({ createdAt: -1 });

    return {
      success: true,
      count: assets.length,
      assets
    };
  } catch (error) {
    console.error('Asset retrieval error:', error.message);
    return { success: false, message: 'Server error while retrieving assets' };
  }
};

/**
 * Get user's transaction history
 * @param {String} userId - User ID
 * @param {Number} page - Page number for pagination
 * @param {Number} limit - Number of transactions per page
 * @returns {Object} User's transactions
 */
exports.getUserTransactions = async (userId, page = 1, limit = 10) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return { success: false, message: 'User not found' };
    }

    const skip = (page - 1) * limit;
    
    // Get transactions where user is either sender or receiver
    const transactions = await Transaction.find({
      $or: [
        { sender: userId },
        { receiver: userId }
      ]
    })
      .populate('asset')
      .populate({
        path: 'sender',
        select: 'username avatar walletAddresses'
      })
      .populate({
        path: 'receiver',
        select: 'username avatar walletAddresses'
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const totalCount = await Transaction.countDocuments({
      $or: [
        { sender: userId },
        { receiver: userId }
      ]
    });

    return {
      success: true,
      transactions,
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit)
      }
    };
  } catch (error) {
    console.error('Transaction history error:', error.message);
    return { success: false, message: 'Server error while retrieving transactions' };
  }
};

/**
 * Delete user account
 * @param {String} userId - User ID
 * @param {String} password - Password for verification
 * @returns {Object} Deletion result
 */
exports.deleteUserAccount = async (userId, password) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return { success: false, message: 'User not found' };
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { success: false, message: 'Invalid password' };
    }

    // Check if user owns any assets
    const assetCount = await Asset.countDocuments({ owner: userId });
    if (assetCount > 0) {
      return { 
        success: false, 
        message: 'Cannot delete account with owned assets. Please transfer or sell your assets first.' 
      };
    }

    // Delete user
    await User.findByIdAndDelete(userId);

    return {
      success: true,
      message: 'Account deleted successfully'
    };
  } catch (error) {
    console.error('Account deletion error:', error.message);
    return { success: false, message: 'Server error while deleting account' };
  }
}; 