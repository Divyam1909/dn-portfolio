const express = require('express');
const router = express.Router();
const { login, getMe, updatePassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validate, validationRules } = require('../middleware/validation');

// Public route (but requires knowledge of admin path)
router.post('/login', validationRules.login, validate, login);

// Protected routes
router.get('/me', protect, getMe);
router.put('/password', protect, updatePassword);

module.exports = router;

