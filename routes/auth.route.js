const express = require('express');
const { login,logout,signup } = require('../controllers/auth.controller.js');
const authMiddleware = require('../middleware/auth.middleware.js');


const router = express.Router();

// login
router.post('/login', login);

// logout
router.post('/logout',authMiddleware, logout);

// signup
router.post('/signup', signup);

module.exports = router;