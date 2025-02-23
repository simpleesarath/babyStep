const { isBefore, isAfter, parseISO, addMinutes, format } = require('date-fns');
const { Appointment } = require('../models');

/**
 * Generate available time slots based on doctor's working hours and existing appointments.
 * @param {Date} date - The date for which to find available slots.
 * @param {Object} doctor - The doctor object containing working hours.
 * @returns {Promise<Array>} - List of available time slots.
 */
const getAvailableSlots = async (date, doctor) => {
  try {
    // Define working hours
    const startTime = parseISO(`${format(date, 'yyyy-MM-dd')}T${doctor.workingHours.start}`);
    const endTime = parseISO(`${format(date, 'yyyy-MM-dd')}T${doctor.workingHours.end}`);

    // Fetch existing appointments
    const appointments = await Appointment.find({
      doctorId: doctor._id,
      date: { $gte: startTime, $lt: endTime }
    });

    // Define slot duration (30 mins)
    const slotDuration = 30;
    let slots = [];
    let currentSlot = startTime;

    while (isBefore(currentSlot, endTime)) {
      const slotEnd = addMinutes(currentSlot, slotDuration);
      const isConflict = appointments.some(
        (appointment) => isBefore(appointment.date, slotEnd) && isAfter(appointment.date, currentSlot)
      );

      if (!isConflict) {
        slots.push(format(currentSlot, 'HH:mm'));
      }

      currentSlot = addMinutes(currentSlot, slotDuration);
    }

    return slots;
  } catch (error) {
    console.error('Error computing available slots:', error);
    return [];
  }
};

module.exports = { getAvailableSlots };
