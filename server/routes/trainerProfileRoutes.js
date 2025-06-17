const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../utils/cloudinary');
const TrainerProfile = require('../models/TrainerProfile');
const path = require('path'); // ✅ Needed to remove file extension

// ✅ Configure Cloudinary Storage for Multer with extension-safe public_id
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'fitbook/trainers',
        allowed_formats: ['jpg', 'jpeg', 'png'],
        public_id: (req, file) => {
            const nameWithoutExt = path.parse(file.originalname).name;
            return Date.now() + '-' + nameWithoutExt;
        },
    },
});

const upload = multer({ storage });

// ✅ POST route to upload a trainer profile
router.post('/upload', upload.single('photo'), async (req, res) => {
    try {
        const { name, qualifications, expertise, specialization, message, email } = req.body;
        const photo = req.file?.secure_url || req.file?.path || '';

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

        console.log("✅ New trainer profile created:", newProfile);
        res.status(201).json({ success: true, profile: newProfile });
    } catch (error) {
        console.error("❌ Error uploading trainer profile:", error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
});

// ✅ GET route to fetch all trainer profiles
router.get('/all', async (req, res) => {
    try {
        const profiles = await TrainerProfile.find();
        res.status(200).json({ success: true, profiles });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
});

module.exports = router;
