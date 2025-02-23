const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  date: { type: Date, required: true },
  appointmentType: { type: String, required: true },
  patientName: { type: String, required: true },
  notes: { type: String },
  duration: { type: Number, default: 30 } // Added default duration of 30 minutes
}, {
  timestamps: true // Add timestamps for tracking
});

module.exports = mongoose.model('Appointment', appointmentSchema);