// routes/feedbackRoutes.js
const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const Booking = require('../models/Booking');
const { protectUser, protectTrainer } = require('../middleware/auth');

// Submit feedback (User)
router.post('/', protectUser, async (req, res) => {
    const { bookingId, rating, comment } = req.body;
    try {
        const booking = await Booking.findById(bookingId);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        const feedback = new Feedback({
            bookingId,
            trainerId: booking.trainerId,
            userEmail: booking.userEmail,
            rating,
            comment
        });

        await feedback.save();
        res.status(201).json({ message: 'Feedback submitted', feedback });
    } catch (err) {
        res.status(500).json({ message: 'Failed to submit feedback', error: err.message });
    }
});

// Trainer responds to feedback
router.put('/response/:id', protectTrainer, async (req, res) => {
    try {
        const feedback = await Feedback.findByIdAndUpdate(
            req.params.id,
            { response: req.body.response },
            { new: true }
        );
        res.json(feedback);
    } catch (err) {
        res.status(500).json({ message: 'Failed to respond to feedback', error: err.message });
    }
});

// Get feedback for a trainer
router.get('/trainer/:trainerId', protectTrainer, async (req, res) => {
    try {
        const feedbacks = await Feedback.find({ trainerId: req.params.trainerId });
        res.json(feedbacks);
    } catch (err) {
        res.status(500).json({ message: 'Failed to get trainer feedback' });
    }
});

// Get feedback for a user (only theirs)
router.get('/user/:email', protectUser, async (req, res) => {
    try {
        const feedbacks = await Feedback.find({ userEmail: req.params.email });
        res.json(feedbacks);
    } catch (err) {
        res.status(500).json({ message: 'Failed to get user feedback' });
    }
});

module.exports = router;
