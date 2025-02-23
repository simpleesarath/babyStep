const express = require('express');
const router = express.Router();
const { Doctor } = require('../models');
const { getAvailableSlots } = require('../services/timeSlotService');

// GET all doctors
router.get('/', async (req, res, next) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (error) {
    next(error);
  }
});

// GET available slots for a specific doctor
router.get('/:id/slots', async (req, res, next) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ error: 'Date parameter is required' });

    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ error: 'Doctor not found' });

    const availableSlots = await getAvailableSlots(new Date(date), doctor);
    res.json(availableSlots);
  } catch (error) {
    next(error);
  }
});
router.post('/', async (req, res, next) => {
  try {
    const { name, workingHours, specialization } = req.body;
    
    const doctor = new Doctor({
      name,
      workingHours,
      specialization
    });

    await doctor.save();
    res.status(201).json(doctor);
  } catch (error) {
    next(error);
  }
});


module.exports = router;
