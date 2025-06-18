const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userEmail: { type: String, required: true },
    trainerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer', required: true },
    scheduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Availability', required: true },
    status: { type: String, default: 'confirmed' },
    feedback: {
        rating: Number,
        comment: String,
        response: String
    }
}, { timestamps: true });

// ✅ Prevent duplicate bookings for same user and schedule unless cancelled
bookingSchema.index(
    { userEmail: 1, scheduleId: 1 },
    {
        unique: true,
        partialFilterExpression: { status: { $ne: 'cancelled' } }
    }
);

module.exports = mongoose.model('Booking', bookingSchema);
