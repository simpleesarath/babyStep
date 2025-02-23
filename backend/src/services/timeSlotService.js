const { isBefore, isAfter, parseISO, addMinutes, format, startOfDay, endOfDay } = require('date-fns');
const { Appointment } = require('../models');

const getAvailableSlots = async (date, doctor) => {
  try {
    const dayStart = startOfDay(date);
    const dayEnd = endOfDay(date);
    
    // Fetch existing appointments for the day
    const appointments = await Appointment.find({
      doctorId: doctor._id,
      date: {
        $gte: dayStart,
        $lte: dayEnd
      }
    });

    // Convert working hours to datetime
    const dateStr = format(date, 'yyyy-MM-dd');
    const startTime = parseISO(`${dateStr}T${doctor.workingHours.start}`);
    const endTime = parseISO(`${dateStr}T${doctor.workingHours.end}`);

    // Generate 30-minute slots
    const slots = [];
    let currentSlot = startTime;

    while (isBefore(currentSlot, endTime)) {
      const slotEnd = addMinutes(currentSlot, 30);
      
      // Check if slot conflicts with any existing appointment
      const isBooked = appointments.some(apt => {
        const aptTime = parseISO(apt.date.toISOString());
        return (
          (isBefore(currentSlot, aptTime) && isAfter(slotEnd, aptTime)) ||
          (isBefore(currentSlot, addMinutes(aptTime, apt.duration)) && 
           isAfter(slotEnd, aptTime))
        );
      });

      if (!isBooked) {
        slots.push(format(currentSlot, "HH:mm"));
      }
      
      currentSlot = slotEnd;
    }

    return slots;
  } catch (error) {
    console.error('Error computing available slots:', error);
    return [];
  }
};

module.exports = { getAvailableSlots };