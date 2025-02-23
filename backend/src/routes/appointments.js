const express = require('express');
const router = express.Router();
const { Appointment, Doctor } = require('../models');
const { parseISO } = require('date-fns');

// CREATE new appointment
router.post('/', async (req, res, next) => {
  try {
    const { doctorId, date, appointmentType, patientName, notes } = req.body;
    
    // Validate required fields
    if (!doctorId || !date || !appointmentType || !patientName) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['doctorId', 'date', 'appointmentType', 'patientName']
      });
    }

    // Find doctor
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    // Create appointment with default 30-minute duration
    const appointment = new Appointment({
      doctorId,
      date: parseISO(date),
      appointmentType,
      patientName,
      notes,
      duration: 30
    });

    await appointment.save();

    // Populate doctor info before sending response
    await appointment.populate('doctorId');
    
    res.status(201).json({
      message: 'Appointment booked successfully',
      appointment
    });

  } catch (error) {
    console.error('Appointment creation error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Validation Error',
        details: Object.values(error.errors).map(err => err.message)
      });
    }
    next(error);
  }
});

// GET appointments
router.get('/', async (req, res, next) => {
  try {
    const appointments = await Appointment.find()
      .populate('doctorId')
      .sort({ date: 1 }); // Sort by date ascending
    res.json(appointments);
  } catch (error) {
    next(error);
  }
});

module.exports = router;