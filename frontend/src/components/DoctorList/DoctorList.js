import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';

const DoctorList = ({ onDoctorSelect }) => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await api.getDoctors();
        setDoctors(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  if (loading) return <div>Loading doctors...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 doctor-list">
      {doctors.map(doctor => (
        <div 
          key={doctor._id}
          className="p-4 border rounded-lg shadow hover:shadow-md cursor-pointer doctornameview"
          onClick={() => onDoctorSelect(doctor)}
        >
          <h3 className="text font-semibold">{doctor.name}</h3>
          <p className="text-gray-600">{doctor.specialization}</p>
          <p className="text-sm text-gray-500">
            Hours: {doctor.workingHours.start}- {doctor.workingHours.end} 
          </p>
        </div>
      ))}
    </div>
  );
};

export default DoctorList;
