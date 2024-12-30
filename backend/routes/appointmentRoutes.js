// routes/appointments.js

const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const nodemailer = require('nodemailer');

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    service: process.env.SERVICE,
    port: Number(process.env.EMAIL_PORT),
    secure: Boolean(process.env.SECURE),
    auth: {
        user: process.env.USER,
        pass: process.env.PASS,
    },
});

// Book an appointment
router.post('/book', async (req, res) => {
    const { doctorName, userName, date, time, userEmail, specialty, location } = req.body;

    // Create a new appointment instance
    const newAppointment = new Appointment({
        doctorName,
        userName,
        date,
        time,
        userEmail,
        specialty,
        location,
    });

    try {
        // Save the appointment
        await newAppointment.save();

        // Send confirmation email
        const mailOptions = {
            from: process.env.USER,
            to: userEmail,
            subject: 'Appointment Confirmation',
            html: `
                <h2>Appointment Confirmation</h2>
                <p>Dear ${userName},</p>
                <p>Your appointment has been successfully booked with the following details:</p>
                <ul>
                    <li><strong>Doctor:</strong> ${doctorName}</li>
                    <li><strong>Specialty:</strong> ${specialty}</li>
                    <li><strong>Date:</strong> ${date}</li>
                    <li><strong>Time:</strong> ${time}</li>
                    <li><strong>Location:</strong> ${location}</li>
                </ul>
                <p>Please arrive 15 minutes before your scheduled appointment time.</p>
                <p>If you need to reschedule or cancel your appointment, please contact us at least 24 hours in advance.</p>
                <p>Best regards,<br>Healthcare App Team</p>
            `
        };

        await transporter.sendMail(mailOptions);

        res.status(201).json({ 
            message: 'Appointment booked successfully! Confirmation email sent.',
            appointment: newAppointment 
        });
    } catch (error) {
        console.error('Error booking appointment:', error);
        res.status(500).json({ message: 'Failed to book appointment.' });
    }
});

// Get all appointments
router.get('/', async (req, res) => {
    try {
        const appointments = await Appointment.find();
        res.status(200).json(appointments);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ message: 'Failed to fetch appointments.' });
    }
});

// Cancel an appointment by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedAppointment = await Appointment.findByIdAndDelete(id);
        if (!deletedAppointment) {
            return res.status(404).json({ message: 'Appointment not found.' });
        }
        res.status(200).json({ message: 'Appointment canceled successfully.' });
    } catch (error) {
        console.error('Error canceling appointment:', error);
        res.status(500).json({ message: 'Failed to cancel appointment.' });
    }
});

module.exports = router;


// const express = require('express');
// const router = express.Router();
// const Appointment = require('../models/Appointment'); // Ensure this path correctly points to your Appointment model

// // Book an appointment
// router.post('/book', async (req, res) => {
//     const { doctorName, userName, date, time, userEmail, specialty, location } = req.body;

//     // Create a new appointment instance with provided details
//     const newAppointment = new Appointment({
//         doctorName,    // Store doctor's name
//         userName,      // Store user's name
//         date,          // Appointment date
//         time,          // Appointment time
//         userEmail,     // User's email
//         specialty,     // Doctor's specialty
//         location,      // Doctor's location
//     });

//     try {
//         // Save the appointment to the database
//         await newAppointment.save();
//         res.status(201).json({ message: 'Appointment booked successfully!' });
//     } catch (error) {
//         console.error('Error booking appointment:', error);
//         res.status(500).json({ message: 'Failed to book appointment.' });
//     }
// });

// // Get all appointments
// router.get('/', async (req, res) => {
//     try {
//         const appointments = await Appointment.find();
//         res.status(200).json(appointments);
//     } catch (error) {
//         console.error('Error fetching appointments:', error);
//         res.status(500).json({ message: 'Failed to fetch appointments.' });
//     }
// });

// // Cancel an appointment by ID
// router.delete('/:id', async (req, res) => {
//     const { id } = req.params;

//     try {
//         const deletedAppointment = await Appointment.findByIdAndDelete(id);
//         if (!deletedAppointment) {
//             return res.status(404).json({ message: 'Appointment not found.' });
//         }
//         res.status(200).json({ message: 'Appointment canceled successfully.' });
//     } catch (error) {
//         console.error('Error canceling appointment:', error);
//         res.status(500).json({ message: 'Failed to cancel appointment.' });
//     }
// });

// module.exports = router;
