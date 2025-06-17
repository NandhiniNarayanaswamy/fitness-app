const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const bookingRoutes = require('./routes/bookings');
const feedbackRoutes = require('./routes/feedbackRoutes');
const trainerProfileRoutes = require('./routes/trainerProfileRoutes');
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { updateCompletedBookings } = require('./utils/cron');
const cron = require('node-cron');

dotenv.config();
const app = express();

// ✅ Proper CORS Configuration
app.use(cors({
    origin: 'https://illustrious-sawine-205dd1.netlify.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

app.use(express.json());

// Connect to MongoDB
connectDB();

// 🔄 Cron job to mark completed bookings
cron.schedule('*/15 * * * *', () => {
    console.log('Running automated booking completion check...');
    updateCompletedBookings();
});

// ✅ API Routes
app.use('/api/trainers', require('./routes/trainerRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/availability', require('./routes/availabilityRoutes'));
app.use('/api/trainer-profiles', trainerProfileRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/bookings', bookingRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/uploads/user_photos', express.static('uploads/user_photos'));

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
