const express = require('express');
const router = express.Router();
const {
    addAvailability,
    getTrainerSlots,
    editSlot,
    deleteSlot,
    getAllSlots,
} = require('../controllers/availabilityController');

const { protectTrainer } = require('../middleware/auth');

router.post('/add', protectTrainer, addAvailability);
router.get('/trainer', protectTrainer, getTrainerSlots);
router.put('/edit/:id', protectTrainer, editSlot);
router.delete('/:id', protectTrainer, deleteSlot); // ✅ FIXED: matches frontend

router.get('/all', getAllSlots); // Public route for users

module.exports = router;
