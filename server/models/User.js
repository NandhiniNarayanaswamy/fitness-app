const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, default: 'user' },
    fitnessGoals: [String],
    photo: String,
    about: String,
});

module.exports = mongoose.model('User', userSchema);
