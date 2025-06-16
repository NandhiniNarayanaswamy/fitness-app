const Booking = require('../models/Booking');

const updateCompletedBookings = async () => {
    try {
        const bookings = await Booking.find().populate('scheduleId');
        const now = new Date();

        for (const booking of bookings) {
            if (!booking.scheduleId || !booking.scheduleId.date) {
                console.warn(`Skipping booking ${booking._id} due to missing schedule or date`);
                continue;
            }

            const classDate = new Date(booking.scheduleId.date);

            if (classDate < now && booking.status === 'confirmed') {
                booking.status = 'completed';
                await booking.save();
                console.log(`Marked booking ${booking._id} as completed`);
            }
        }
    } catch (error) {
        console.error('Cron job failed', error);
    }
};

module.exports = { updateCompletedBookings };
