/**
 * User API Routes
 * Handles all user-related API endpoints
 */

const express = require('express');
const router = express.Router();
const UserController = require('./userController');
const authMiddleware = require('../middleware/auth');

/**
 * @route   POST /api/users/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, walletAddress } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide username, email, and password' 
      });
    }
    
    const result = await UserController.registerUser(username, email, password, walletAddress);
    
    if (result.success) {
      return res.status(201).json(result);
    } else {
      return res.status(400).json(result);
    }
    
  } catch (error) {
    console.error('Registration error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during registration' 
    });
  }
});

/**
 * @route   POST /api/users/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide email and password' 
      });
    }
    
    const result = await UserController.loginUser(email, password);
    
    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(401).json(result);
    }
    
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during login' 
    });
  }
});

/**
 * @route   POST /api/users/wallet-connect
 * @desc    Connect wallet to user account
 * @access  Private
 */
router.post('/wallet-connect', authMiddleware, async (req, res) => {
  try {
    const { walletAddress, signature } = req.body;
    const userId = req.user.id;
    
    if (!walletAddress || !signature) {
      return res.status(400).json({ 
        success: false, 
        message: 'Wallet address and signature required' 
      });
    }
    
    const result = await UserController.connectWallet(userId, walletAddress, signature);
    
    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }
    
  } catch (error) {
    console.error('Wallet connection error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during wallet connection' 
    });
  }
});

/**
 * @route   GET /api/users/profile
 * @desc    Get user profile
 * @access  Private
 */
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await UserController.getUserProfile(userId);
    
    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
    
  } catch (error) {
    console.error('Profile retrieval error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while retrieving profile' 
    });
  }
});

/**
 * @route   PUT /api/users/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const updateData = req.body;
    
    const result = await UserController.updateUserProfile(userId, updateData);
    
    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }
    
  } catch (error) {
    console.error('Profile update error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while updating profile' 
    });
  }
});

/**
 * @route   GET /api/users/assets
 * @desc    Get user's owned assets
 * @access  Private
 */
router.get('/assets', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await UserController.getUserAssets(userId);
    
    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
    
  } catch (error) {
    console.error('Asset retrieval error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while retrieving assets' 
    });
  }
});

/**
 * @route   GET /api/users/transactions
 * @desc    Get user's transaction history
 * @access  Private
 */
router.get('/transactions', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const result = await UserController.getUserTransactions(userId, page, limit);
    
    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
    
  } catch (error) {
    console.error('Transaction history error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while retrieving transactions' 
    });
  }
});

/**
 * @route   DELETE /api/users
 * @desc    Delete user account
 * @access  Private
 */
router.delete('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password is required to delete account' 
      });
    }
    
    const result = await UserController.deleteUserAccount(userId, password);
    
    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }
    
  } catch (error) {
    console.error('Account deletion error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while deleting account' 
    });
  }
});

module.exports = router; 