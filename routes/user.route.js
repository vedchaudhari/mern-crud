const express = require('express')
const authMiddleware = require('../middleware/auth.middleware.js');
const { getUserProfile,updateUserProfile } = require('../controllers/user.controller.js');



const router = express.Router();

//getUserProfile
router.get('/profile', authMiddleware, getUserProfile);

//updateUser Profile
router.put('/profile', authMiddleware, updateUserProfile);

module.exports = router;


