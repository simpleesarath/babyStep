import React, { useState } from 'react';
import DoctorList from '../../components/DoctorList/DoctorList';
import AppointmentForm from '../../components/AppointForm/AppointmentForm'; 

const BookAppointment = () => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Book Doctor Appointment</h1>
      
      {!selectedDoctor ? (
        <>
          <h2 className="text-xl mb space ">Select a Doctor</h2>
          <DoctorList onDoctorSelect={setSelectedDoctor} />
        </>
      ) : (
        <>
          <button
            onClick={() => setSelectedDoctor(null)}
            className="mb-4 text-blue hover:text-blue-800"
          >
            ← Back to doctor selection
          </button>
          <AppointmentForm 
            doctor={selectedDoctor}
            onSuccess={() => setSelectedDoctor(null)}
          />
        </>
      )}
    </div>
      
  );
};

export default BookAppointment;
