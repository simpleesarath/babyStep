import React from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import BookAppointment from './pages/BookAppointment/BookAppointment';
import Home from './pages/Home/Home';

function App() {
  return (
    <Router>
      <div>
        {/* Add navigation */}
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/book">Book Appointment</Link></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/book" element={<BookAppointment />} />
          {/* Add a catch-all route */}
          <Route path="*" element={<div>Page not found!</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
