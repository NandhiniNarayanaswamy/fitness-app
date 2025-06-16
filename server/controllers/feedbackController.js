const Feedback = require('../models/Feedback');
const Booking = require('../models/Booking');

// Create feedback (user)
exports.createFeedback = async (req, res) => {
    const { bookingId, trainerId, userEmail, rating, comment } = req.body;

    try {
        const existingFeedback = await Feedback.findOne({ bookingId });
        if (existingFeedback) {
            return res.status(400).json({ message: 'Feedback already submitted' });
        }

        const newFeedback = new Feedback({
            bookingId,
            trainerId,
            userEmail,
            rating,
            comment
        });

        await newFeedback.save();

        res.status(201).json({ message: 'Feedback submitted successfully', feedback: newFeedback });
    } catch (err) {
        res.status(500).json({ message: 'Error submitting feedback', error: err.message });
    }
};

// Trainer responds to feedback
exports.respondToFeedback = async (req, res) => {
    const { feedbackId } = req.params;
    const { response } = req.body;

    try {
        const feedback = await Feedback.findById(feedbackId);
        if (!feedback) return res.status(404).json({ message: 'Feedback not found' });

        feedback.response = response;
        await feedback.save();

        res.json({ message: 'Response added successfully', feedback });
    } catch (err) {
        res.status(500).json({ message: 'Error responding to feedback', error: err.message });
    }
};

// Get all feedbacks for a specific trainer
exports.getTrainerFeedback = async (req, res) => {
    const { trainerId } = req.params;

    try {
        const feedbacks = await Feedback.find({ trainerId });

        res.json(feedbacks);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch feedback', error: err.message });
    }
};
