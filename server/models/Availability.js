const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
    trainer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trainer',
        required: true
    },
    type: {
        type: String,
        required: true,
        trim: true
    },
    duration: {
        type: String,
        required: true,
        trim: true,
        enum: ['30', '45', '60', '90'] // Optional: only allow common durations (mins)
    },
    timeSlot: {
        type: String,
        required: true,
        trim: true // Example: "06:30 PM"
    },
    date: {
        type: Date,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }
}, {
    timestamps: true // Adds createdAt and updatedAt
});

module.exports = mongoose.model('Availability', availabilitySchema);
