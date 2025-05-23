import React, { useState, useEffect } from 'react';

// Used the environment variable from Render deployment
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

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
    if (selectedDate && doctor?._id) {
      fetchAvailableSlots();
    }
  }, [selectedDate, doctor?._id]);

  const fetchAvailableSlots = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching slots from:', `${API_URL}/api/doctors/${doctor._id}/slots?date=${selectedDate}`);
      const response = await fetch(`${API_URL}/api/doctors/${doctor._id}/slots?date=${selectedDate}`);
      
      if (!response.ok) {
        console.error('Slots fetch failed:', response.status, response.statusText);
        throw new Error('Failed to fetch time slots');
      }
      
      const slots = await response.json();
      console.log('Fetched slots:', slots);
      setAvailableSlots(slots);
    } catch (err) {
      console.error('Error in fetchAvailableSlots:', err);
      setError('Failed to fetch available slots');
      setAvailableSlots([]);
    } finally {
      setLoading(false);
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
    if (!selectedSlot) {
      setError('Please select a time slot');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage('');

    try {
      const appointmentDateTime = `${selectedDate}T${selectedSlot}`;
      console.log('Submitting appointment to:', `${API_URL}/api/appointments`);
      
      const response = await fetch(`${API_URL}/api/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          doctorId: doctor._id,
          date: appointmentDateTime,
          appointmentType: formData.appointmentType,
          patientName: formData.patientName,
          notes: formData.notes
        }),
      });

      if (!response.ok) {
        console.error('Appointment creation failed:', response.status, response.statusText);
        throw new Error('Failed to book appointment');
      }

      const result = await response.json();
      console.log('Appointment created:', result);

      setSuccessMessage('Appointment booked successfully!');
      // Reset form
      setFormData({
        patientName: '',
        appointmentType: 'Routine Check-Up',
        notes: ''
      });
      setSelectedDate('');
      setSelectedSlot('');
      
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (err) {
      console.error('Error in handleSubmit:', err);
      setError(err.message);
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

      {loading && <div className="text-blue-600">Loading available time slots...</div>}

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
                {slot}
              </option>
            ))}
          </select>
        </div>
      )}

      {availableSlots.length === 0 && selectedDate && !loading && (
        <div className="text-yellow-600">
          No available time slots for the selected date. Please choose another date.
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
        className="w-full bg-blue-500 text-white p-2 rounded disabled:bg-gray-300 hover:bg-blue-600"
      >
        {loading ? 'Booking...' : 'Book Appointment'}
      </button>
    </form>
  );
};

export default AppointmentForm;
