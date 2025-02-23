import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BookAppointment from './pages/BookAppointment/BookAppointment'; // Ensure this path is correct

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<h1>Welcome to BabyStep App</h1>} />
        <Route path="/book" element={<BookAppointment />} />
       
      </Routes>
    </Router>
  
    
    
  );
}

export default App;
