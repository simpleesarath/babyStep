const express = require('express');
const router = express.Router();
const doctorRoutes = require('./doctors');
const appointmentRoutes = require('./appointments');

// Mount the routes
router.use('/doctors', doctorRoutes);
router.use('/appointments', appointmentRoutes);

module.exports = router;  // Export the router object