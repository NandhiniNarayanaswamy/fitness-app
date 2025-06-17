const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../utils/cloudinary'); // Make sure this file is correctly configured
const TrainerProfile = require('../models/TrainerProfile');

// Configure Cloudinary Storage for Multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'fitbook/trainers', // Folder in your Cloudinary account
        allowed_formats: ['jpg', 'jpeg', 'png'],
        public_id: (req, file) => Date.now() + '-' + file.originalname,
    },
});

const upload = multer({ storage });

// @route POST /api/trainer-profiles/upload
router.post('/upload', upload.single('photo'), async (req, res) => {
    try {
        const { name, qualifications, expertise, specialization, message, email } = req.body;
        const photo = req.file?.secure_url || req.file?.path || ''; // ✅ Corrected here

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

        console.log("New trainer profile created:", newProfile); // Optional
        res.status(201).json({ success: true, profile: newProfile });
    } catch (error) {
        console.error("Error uploading trainer profile:", error);
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

// ✅ Export the router to fix "handler must be a function" error
module.exports = router;
