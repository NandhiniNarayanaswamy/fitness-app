const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
    trainer: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer' },
    type: String,
    duration: String,
    timeSlot: String,
    date: Date,
    price: Number, // 👈 Add this field
});

module.exports = mongoose.model('Availability', availabilitySchema);
