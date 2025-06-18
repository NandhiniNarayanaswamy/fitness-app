const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../utils/cloudinary');
const TrainerProfile = require('../models/TrainerProfile');
const path = require('path');

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

// ✅ Create new profile
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

// ✅ Get all profiles
router.get('/all', async (req, res) => {
    try {
        const profiles = await TrainerProfile.find();
        res.status(200).json({ success: true, profiles });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
});

// ✅ Get single profile by email
router.get('/:email', async (req, res) => {
    try {
        const profile = await TrainerProfile.findOne({ email: req.params.email });
        if (!profile) {
            return res.status(404).json({ success: false, message: 'Profile not found' });
        }
        res.status(200).json(profile);
    } catch (error) {
        console.error("❌ Error fetching trainer profile:", error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
});

// ✅ Update profile by ID
router.put('/update/:id', upload.single('photo'), async (req, res) => {
    try {
        const { name, qualifications, expertise, specialization, message, email } = req.body;
        const updates = {
            name,
            qualifications,
            expertise,
            specialization,
            message,
            email,
        };

        if (req.file) {
            updates.photo = req.file.secure_url || req.file.path;
        }

        const updatedProfile = await TrainerProfile.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true }
        );

        if (!updatedProfile) {
            return res.status(404).json({ success: false, message: 'Profile not found' });
        }

        console.log("✅ Trainer profile updated:", updatedProfile);
        res.status(200).json({ success: true, profile: updatedProfile });
    } catch (error) {
        console.error("❌ Error updating trainer profile:", error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
});

module.exports = router;
