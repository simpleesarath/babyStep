
const BASE_URL = 'http://localhost:5000/api';

export const api = {
  async getDoctors() {
    const response = await fetch(`${BASE_URL}/doctors`);
    if (!response.ok) throw new Error('Failed to fetch doctors');
    return response.json();
  },

  async getAvailableSlots(doctorId, date) {
    const response = await fetch(`${BASE_URL}/doctors/${doctorId}/slots?date=${date}`);
    if (!response.ok) throw new Error('Failed to fetch slots');
    return response.json();
  },

  async createAppointment(appointmentData) {
    const response = await fetch(`${BASE_URL}/appointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(appointmentData),
    });
    if (!response.ok) throw new Error('Failed to create appointment');
    return response.json();
  },

  async getAppointments() {
    const response = await fetch(`${BASE_URL}/appointments`);
    if (!response.ok) throw new Error('Failed to fetch appointments');
    return response.json();
  },

  async cancelAppointment(appointmentId) {
    const response = await fetch(`${BASE_URL}/appointments/${appointmentId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to cancel appointment');
    return response.json();
  },
};