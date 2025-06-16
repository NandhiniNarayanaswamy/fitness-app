const express = require('express');
const router = express.Router();
const { registerUser, loginUser, updateUserProfile, getOwnProfile, getRecommendations, } = require('../controllers/userController');
const { protectUser } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/profile', protectUser, upload.single('photo'), updateUserProfile);
router.get('/me', protectUser, getOwnProfile);
router.get('/recommendations', protectUser, getRecommendations);
module.exports = router;
