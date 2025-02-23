const express = require('express');
const router = express.Router();
const { Appointment, Doctor } = require('../models');
const { getAvailableSlots } = require('../services/timeSlotService');

// GET all appointments
router.get('/', async (req, res, next) => {
  try {
    const appointments = await Appointment.find().populate('doctorId');
    res.json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// CREATE new appointment
router.post('/', async (req, res, next) => {
  console.log("Incoming request body:", req.body); // Debugging log

  try {
    const { doctorId, date, time, appointmentType, patientName, notes } = req.body;

    // Check if doctorId is valid
    if (!doctorId) {
      return res.status(400).json({ error: "Doctor ID is required" });
    }

    // Find doctor in the database
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      console.log("Doctor not found:", doctorId);
      return res.status(404).json({ error: 'Doctor not found' });
    }

    // Parse date correctly
    const appointmentDate = new Date(date);
    if (isNaN(appointmentDate.getTime())) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    // Get available slots for the doctor
    const availableSlots = await getAvailableSlots(appointmentDate, doctor);
    console.log("Available Slots:", availableSlots);

    // Check if requested time slot is available
    const requestedSlot = time;
    if (!availableSlots.includes(requestedSlot)) {
      console.log("Requested Slot is not available:", requestedSlot);
      return res.status(400).json({ error: 'Selected time slot is not available' });
    }

    // Create new appointment
    const appointment = new Appointment({
      doctorId,
      date: appointmentDate,
      time: requestedSlot,
      appointmentType,
      patientName,
      notes
    });

    await appointment.save();
    res.status(201).json(appointment);
  } catch (error) {
    console.error("Error in booking appointment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
