const Trainer = require('../models/Trainer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// REGISTER TRAINER
exports.registerTrainer = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existing = await Trainer.findOne({ email });
        if (existing) return res.status(400).json({ message: 'Trainer already exists' });

        const hashed = await bcrypt.hash(password, 10);
        const trainer = new Trainer({ name, email, password: hashed });

        await trainer.save();
        res.json({ message: 'Trainer registered' });
    } catch (err) {
        console.error('Trainer registration failed:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// LOGIN TRAINER
exports.loginTrainer = async (req, res) => {
    try {
        const { email, password } = req.body;
        const trainer = await Trainer.findOne({ email });

        if (!trainer) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, trainer.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign(
            { id: trainer._id, role: 'trainer' },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // ✅ Return token and trainerId as string
        res.json({
            token,
            trainerId: trainer._id.toString(),
            name: trainer.name,
            email: trainer.email,
            role: 'trainer',
        });
    } catch (err) {
        console.error('Trainer login failed:', err);
        res.status(500).json({ message: 'Server error' });
    }
};
