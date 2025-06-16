const mongoose = require('mongoose');

const TrainerProfileSchema = new mongoose.Schema({
    name: { type: String, required: true },
    qualifications: { type: String, required: true },
    expertise: { type: String, required: true },
    specialization: { type: String, required: true },
    photo: { type: String }, // Image URL
    message: { type: String }, // Introductory message
    email: { type: String, required: true }, // Link profile to trainer
}, { timestamps: true });

module.exports = mongoose.model('TrainerProfile', TrainerProfileSchema);
