const Availability = require('../models/Availability');

exports.addAvailability = async (req, res) => {
    try {
        const { type, timeSlot, duration, price, date } = req.body;
        const trainerId = req.trainer.id;

        console.log("Trainer ID:", trainerId);

        // ✅ Validate required fields
        if (!type || !timeSlot || !duration || !price || !date) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        // ✅ Parse timeSlot: expects format "06:30 PM"
        const [hourStr, minuteStr, meridian] = timeSlot.trim().split(/:| /);
        let hours = parseInt(hourStr, 10);
        const minutes = parseInt(minuteStr, 10);

        if (meridian === 'PM' && hours !== 12) hours += 12;
        if (meridian === 'AM' && hours === 12) hours = 0;

        const sessionDateTime = new Date(date);
        sessionDateTime.setHours(hours, minutes, 0, 0);

        const now = new Date();

        // ❌ Reject if the slot time is in the past
        if (sessionDateTime <= now) {
            return res.status(400).json({ message: '❌ Cannot set availability in the past.' });
        }

        const slot = new Availability({
            trainer: trainerId,
            type,
            timeSlot,
            duration,
            price,
            date
        });

        await slot.save();
        res.json(slot);

    } catch (error) {
        console.error('Error in addAvailability:', error);
        res.status(500).json({ message: 'Server error while adding availability.' });
    }
};

exports.getTrainerSlots = async (req, res) => {
    try {
        const slots = await Availability.find({ trainer: req.trainer.id });
        res.json(slots);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching trainer slots.' });
    }
};

exports.editSlot = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await Availability.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: 'Error updating slot.' });
    }
};

exports.deleteSlot = async (req, res) => {
    try {
        await Availability.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting slot.' });
    }
};

exports.getAllSlots = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Midnight today

        const slots = await Availability.find({
            date: { $gte: today }
        }).populate('trainer', 'name');

        res.json(slots);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching all slots.' });
    }
};
