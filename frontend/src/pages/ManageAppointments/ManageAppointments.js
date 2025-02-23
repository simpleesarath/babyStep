import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';

const AppointmentForm = ({ doctor, onSuccess }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [formData, setFormData] = useState({
    patientName: '',
    appointmentType: 'Routine Check-Up',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots();
    }
  }, [selectedDate]);

  const fetchAvailableSlots = async () => {
    try {
      const slots = await api.getAvailableSlots(doctor._id, selectedDate);
      setAvailableSlots(slots);
      setSelectedSlot('');
    } catch (err) {
      setError('Failed to fetch available slots');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage('');

    try {
      await api.createAppointment({
        doctorId: doctor._id,
        date: selectedSlot,
        ...formData
      });
      setSuccessMessage('Appointment booked successfully!');
      // Reset form
      setFormData({
        patientName: '',
        appointmentType: 'Routine Check-Up',
        notes: ''
      });
      setSelectedDate('');
      setSelectedSlot('');
      // Wait for 2 seconds to show success message before redirecting
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (err) {
      setError('Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          {successMessage}
        </div>
      )}

      <div>
        <label className="block mb-2">Patient Name: </label>
        <input
          type="text"
          name="patientName"
          value={formData.patientName}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label className="block mb-2">Date: </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      {availableSlots.length > 0 && (
        <div>
          <label className="block mb-2">Available Time Slots: </label>
          <select
            value={selectedSlot}
            onChange={(e) => setSelectedSlot(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select a time slot</option>
            {availableSlots.map((slot) => (
              <option key={slot} value={slot}>
                {new Date(slot).toLocaleTimeString()}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="block mb-2">Appointment Type: </label>
        <select
          name="appointmentType"
          value={formData.appointmentType}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="Routine Check-Up">Routine Check-Up</option>
          <option value="Follow-Up">Follow-Up</option>
          <option value="Consultation">Consultation</option>
          <option value="Emergency">Emergency</option>
        </select>
      </div>

      <div>
        <label className="block mb-2">Notes: </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
          rows="3"
        />
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !selectedSlot}
        className="w-full bg-blue-500 text-white p-2 rounded disabled:bg-gray-300"
      >
        {loading ? 'Booking...' : 'Book Appointment'}
      </button>
    </form>
  );
};

export default AppointmentForm;