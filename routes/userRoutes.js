/**
 * User Routes
 * Handles all user-related API endpoints
 */

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const userController = require('../controllers/userController');

// Public routes
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

// Protected routes (require authentication)
router.get('/profile', auth, userController.getUserProfile);
router.put('/profile', auth, userController.updateUserProfile);
router.post('/connect-wallet', auth, userController.connectWallet);
router.get('/assets', auth, userController.getUserAssets);
router.get('/transactions', auth, userController.getUserTransactions);
router.delete('/account', auth, userController.deleteUserAccount);

// Admin routes
router.get('/admin/users', auth, userController.adminListUsers);

module.exports = router; 