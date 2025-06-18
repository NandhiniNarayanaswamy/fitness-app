const Availability = require('../models/Availability');

exports.addAvailability = async (req, res) => {
    const { type, timeSlot, duration, price, date } = req.body;
    const trainerId = req.trainer.id;

    console.log("Trainer ID:", trainerId); // ✅ Debug

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
};

exports.getTrainerSlots = async (req, res) => {
    const slots = await Availability.find({ trainer: req.trainer.id });
    res.json(slots);
};

exports.editSlot = async (req, res) => {
    const { id } = req.params;
    const updated = await Availability.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updated);
};

exports.deleteSlot = async (req, res) => {
    await Availability.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
};

exports.getAllSlots = async (req, res) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Midnight - start of today

    const slots = await Availability.find({
        date: { $gte: today }
    }).populate('trainer', 'name');

    res.json(slots);
};

