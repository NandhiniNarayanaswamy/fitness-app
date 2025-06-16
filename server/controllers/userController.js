const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Booking = require('../models/Booking');
const Availability = require('../models/Availability');


exports.registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashed = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashed });
        await user.save();
        res.json({ message: 'User registered' });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ message: 'Registration failed' });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Sign JWT
        const token = jwt.sign(
            { id: user._id, role: 'user' },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        // ✅ Return token, email, and userId
        res.json({
            token,
            email: user.email,
            userId: user._id.toString(),
            role: 'user',
            name: user.name,
        });

    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Login failed' });
    }




};

exports.updateUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, fitnessGoals, about } = req.body;

        const updateData = {};
        if (name) updateData.name = name;
        if (about) updateData.about = about;
        if (fitnessGoals) {
            updateData.fitnessGoals = fitnessGoals.split(',').map(g => g.trim());
        }
        if (req.file) {
            updateData.photo = req.file.filename;
        }

        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

        res.json({
            message: 'Profile updated successfully',
            user: updatedUser,
        });
    } catch (err) {
        console.error('Profile update error:', err);
        res.status(500).json({ message: 'Profile update failed' });
    }
};
exports.getOwnProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select('-password'); // exclude password

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (err) {
        console.error('Get profile error:', err);
        res.status(500).json({ message: 'Failed to retrieve profile' });
    }
};

exports.getRecommendations = async (req, res) => {
    try {
        const userId = req.user.id;
        console.log("User ID:", userId);

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        console.log("User fitnessGoals:", user.fitnessGoals);

        const bookings = await Booking.find({ userId });
        const preferredTypes = bookings.map(b => b.classType);

        console.log("Past booking types:", preferredTypes);

        const matchingAvailability = await Availability.find({
            $or: [
                { type: { $in: user.fitnessGoals || [] } },
                { type: { $in: preferredTypes } },
            ]
        }).populate('trainer', 'name email'); // 👈 Only populate name & email from Trainer

        console.log("Matching recommendations:", matchingAvailability.length);

        res.json(matchingAvailability);

    } catch (err) {
        console.error('Recommendation error:', err);
        res.status(500).json({ message: 'Could not fetch recommendations' });
    }
};