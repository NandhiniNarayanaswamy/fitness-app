const express = require('express');
const router = express.Router();
const multer = require('multer');
const TrainerProfile = require('../models/TrainerProfile');

// Multer setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // store in uploads folder
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // unique name
    }
});

const upload = multer({ storage: storage });

// @route POST /api/trainer-profiles/upload
router.post('/upload', upload.single('photo'), async (req, res) => {
    try {
        const { name, qualifications, expertise, specialization, message, email } = req.body;

        const photo = req.file ? `/uploads/${req.file.filename}` : '';

        const newProfile = new TrainerProfile({
            name,
            qualifications,
            expertise,
            specialization,
            photo,
            message,
            email,
        });

        await newProfile.save();

        res.status(201).json({ success: true, profile: newProfile });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
});

// @route GET /api/trainer-profiles/all
router.get('/all', async (req, res) => {
    try {
        const profiles = await TrainerProfile.find();
        res.status(200).json({ success: true, profiles });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
});

module.exports = router;
