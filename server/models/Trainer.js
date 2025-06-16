const mongoose = require('mongoose');

const trainerSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, default: 'trainer' }
});

module.exports = mongoose.model('Trainer', trainerSchema);
