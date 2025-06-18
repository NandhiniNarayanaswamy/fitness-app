const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('../models/Booking');
const Availability = require('../models/Availability');
const sendMail = require('../utils/mailer');

// ✅ Create a new booking with duplicate check
router.post('/', async (req, res) => {
    const { userId, userEmail, trainerId, scheduleId } = req.body;

    try {
        const schedule = await Availability.findById(scheduleId);
        if (!schedule) {
            return res.status(404).json({ message: 'Schedule not found' });
        }

        // Check for existing active booking for the same schedule and user
        const existingBooking = await Booking.findOne({
            userEmail,
            scheduleId,
            status: { $ne: 'cancelled' }
        });

        if (existingBooking) {
            return res.status(400).json({ message: 'You have already booked this session.' });
        }

        const booking = await Booking.create({
            userId,
            userEmail,
            trainerId,
            scheduleId
        });

        await sendMail(
            userEmail,
            'Booking Confirmed',
            `You have booked a ${schedule.type} class (${schedule.duration}) at ${schedule.timeSlot}.`
        );

        res.status(201).json(booking);
    } catch (err) {
        console.error('Booking failed:', err);
        res.status(500).json({ message: 'Booking failed', error: err });
    }
});

// ✅ Create Stripe Payment Intent
router.post('/payment/create-payment-intent', async (req, res) => {
    const { amount, userEmail, trainerId, scheduleId } = req.body;

    if (!amount || typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ error: 'Invalid amount provided' });
    }

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100),
            currency: 'inr',
            metadata: {
                userEmail: userEmail || 'unknown',
                trainerId: trainerId || 'unknown',
                scheduleId: scheduleId || 'unknown',
            }
        });

        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (err) {
        console.error('Payment intent error:', err);
        res.status(500).json({ error: 'Payment intent creation failed' });
    }
});

// ✅ Get bookings for a specific user
router.get('/user/:email', async (req, res) => {
    try {
        const bookings = await Booking.find({ userEmail: req.params.email })
            .populate({
                path: 'scheduleId',
                populate: { path: 'trainer', select: 'name' }
            });
        res.json(bookings);
    } catch (err) {
        console.error('Failed to fetch bookings:', err);
        res.status(500).json({ message: 'Failed to fetch bookings' });
    }
});

// ✅ Reschedule a booking
router.put('/:id', async (req, res) => {
    try {
        const { scheduleId } = req.body;
        const updated = await Booking.findByIdAndUpdate(
            req.params.id,
            { scheduleId, status: 'rescheduled' },
            { new: true }
        ).populate('scheduleId');

        await sendMail(
            updated.userEmail,
            'Booking Rescheduled',
            `Your class has been rescheduled to ${updated.scheduleId.timeSlot} (${updated.scheduleId.type}).`
        );

        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: 'Failed to reschedule' });
    }
});

// ✅ Cancel a booking
router.delete('/:id', async (req, res) => {
    try {
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status: 'cancelled' },
            { new: true }
        ).populate('scheduleId');

        await sendMail(
            booking.userEmail,
            'Booking Cancelled',
            `Your class for ${booking.scheduleId.timeSlot} (${booking.scheduleId.type}) has been cancelled.`
        );

        res.json({ message: 'Booking cancelled', booking });
    } catch (err) {
        res.status(500).json({ message: 'Cancellation failed' });
    }
});

// ✅ Get bookings for a specific trainer
router.get('/trainer/:id', async (req, res) => {
    try {
        const bookings = await Booking.find({ trainerId: req.params.id })
            .populate('scheduleId')
            .populate('userId', 'name email');

        res.json(bookings);
    } catch (err) {
        console.error('Failed to fetch trainer bookings:', err);
        res.status(500).json({ message: 'Failed to fetch trainer bookings' });
    }
});

// ✅ Confirm booking after payment with duplicate check
router.post('/payment/confirm-booking', async (req, res) => {
    const { userId, userEmail, trainerId, scheduleId } = req.body;

    try {
        const schedule = await Availability.findById(scheduleId);
        if (!schedule) {
            return res.status(404).json({ message: 'Schedule not found' });
        }

        // Check for existing active booking
        const existingBooking = await Booking.findOne({
            userEmail,
            scheduleId,
            status: { $ne: 'cancelled' }
        });

        if (existingBooking) {
            return res.status(400).json({ message: 'You have already booked this session.' });
        }

        const booking = await Booking.create({
            userId,
            userEmail,
            trainerId,
            scheduleId
        });

        await sendMail(
            userEmail,
            'Booking Confirmed',
            `You have booked a ${schedule.type} class (${schedule.duration}) at ${schedule.timeSlot}.`
        );

        res.status(201).json(booking);
    } catch (err) {
        console.error('Booking confirmation failed:', err);
        res.status(500).json({ message: 'Booking confirmation failed' });
    }
});

module.exports = router;
