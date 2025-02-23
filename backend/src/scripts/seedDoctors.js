// const mongoose = require('mongoose');
// const { Doctor } = require('../models');
// require('dotenv').config({ path: '../../.env' });

// const doctors = [
//   {
//     name: "Dr. Sarah Johnson",
//     workingHours: {
//       start: "09:00",
//       end: "17:00"
//     },
//     specialization: "General"
//   },
//   {
//     name: "Dr. Michael Chen",
//     workingHours: {
//       start: "08:00",
//       end: "16:00"
//     },
//     specialization: "High Risk"
//   },
//   {
//     name: "Dr. Emily Brown",
//     workingHours: {
//       start: "10:00",
//       end: "18:00"
//     },
//     specialization: "Ultrasound Specialist"
//   },
//   {
//     name: "Dr. David Wilson",
//     workingHours: {
//       start: "09:30",
//       end: "17:30"
//     },
//     specialization: "Genetic Counseling"
//   }
// ];

// const seedDoctors = async () => {
//   try {
//     // Connect to MongoDB
//     await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/prenatal-care');
//     console.log('Connected to MongoDB');

//     // Delete existing doctors
//     await Doctor.deleteMany({});
//     console.log('Cleared existing doctors');

//     // Insert new doctors
//     const insertedDoctors = await Doctor.insertMany(doctors);
//     console.log('Successfully inserted doctors:', insertedDoctors.length);
//     console.log('Doctor details:');
//     insertedDoctors.forEach(doctor => {
//       console.log(`- ${doctor.name} (${doctor.specialization})`);
//     });

//     // Close the connection
//     await mongoose.connection.close();
//     console.log('Database connection closed');

//   } catch (error) {
//     console.error('Error seeding doctors:', error);
//     // Ensure the connection is closed even if there's an error
//     if (mongoose.connection.readyState !== 0) {
//       await mongoose.connection.close();
//     }
//     process.exit(1);
//   }
// };

// // Run the seed function
// seedDoctors();