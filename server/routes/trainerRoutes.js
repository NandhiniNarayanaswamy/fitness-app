const express = require('express');
const router = express.Router();
const { registerTrainer, loginTrainer } = require('../controllers/trainerController');
const Trainer = require('../models/Trainer');
const { protectUser } = require('../middleware/auth'); // Import protectUser

// Register and login
router.post('/register', registerTrainer);
router.post('/login', loginTrainer);



module.exports = router;
