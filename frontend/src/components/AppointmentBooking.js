import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
//import { gsap } from 'gsap';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { FaCalendarAlt, FaEnvelope, FaUser, FaClock } from 'react-icons/fa';

const AppointmentBooking = () => {
    const location = useLocation();
    const selectedDoctor = location.state?.doctor;
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // useEffect(() => {
    //     gsap.from(".appointment-container", {
    //         duration: 1,
    //         y: 50,
    //         opacity: 0,
    //         ease: "power3.out"
    //     });
    // }, []);

    const getCurrentDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    const validationSchema = Yup.object().shape({
        userName: Yup.string().required('Name is required'),
        userEmail: Yup.string().email('Invalid email').required('Email is required'),
        date: Yup.date().min(new Date(), 'Cannot select past dates').required('Date is required'),
    });

    const handleSubmit = async (values, { setSubmitting, setStatus }) => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/appointments/book', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...values,
                    doctorName: selectedDoctor.name,
                    specialty: selectedDoctor.specialty,
                    location: selectedDoctor.location,
                }),
            });

            if (!response.ok) throw new Error('Booking failed');

            alert('Appointment booked successfully! Check your email for confirmation.');
            navigate('/');
        } catch (error) {
            setStatus({ error: error.message });
        } finally {
            setLoading(false);
            setSubmitting(false);
        }
    };

    if (!selectedDoctor) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                    textAlign: 'center',
                    padding: '20px',
                    color: '#666'
                }}
            >
                Please select a doctor first.
            </motion.div>
        );
    }

    return (
        <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
    style={{
        maxWidth: '600px',
        margin: '40px auto',
        padding: '30px',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
        overflow: 'hidden' // Add this to contain all content
    }}
>
    <h2 style={{
        textAlign: 'center',
        color: '#333',
        fontSize: '28px',
        marginBottom: '30px'
    }}>
        Book an Appointment with {selectedDoctor.name}
    </h2>

    <Formik
        initialValues={{
            userName: '',
            userEmail: '',
            date: '',
            selectedPeriod: 'morning'
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
    >
        {({ errors, touched, status }) => (
            <Form style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '20px',
                width: '90%', // Ensure form takes full container width
                padding: '0 10px' // Add padding for better spacing
            }}>
                        <div style={{ position: 'relative' }}>
                            <FaUser style={{
                                position: 'absolute',
                                left: '12px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#666'
                            }} />
                            <Field
                                name="userName"
                                style={{
                                    width: '100%',
                                    padding: '12px 12px 12px 40px',
                                    border: '2px solid #e0e0e0',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    transition: 'border-color 0.3s ease'
                                }}
                                placeholder="Your Name"
                            />
                            {errors.userName && touched.userName && (
                                <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
                                    {errors.userName}
                                </div>
                            )}
                        </div>

                        <div style={{ position: 'relative' }}>
                            <FaCalendarAlt style={{
                                position: 'absolute',
                                left: '12px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#666'
                            }} />
                            <Field
                                name="date"
                                type="date"
                                min={getCurrentDate()}
                                style={{
                                    width: '100%',
                                    padding: '12px 12px 12px 40px',
                                    border: '2px solid #e0e0e0',
                                    borderRadius: '8px',
                                    fontSize: '16px'
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <FaClock style={{ marginRight: '8px', color: '#666' }} />
                            <div style={{
                                display: 'flex',
                                gap: '15px',
                                marginTop: '10px'
                            }}>
                                {['morning', 'afternoon', 'evening'].map((period) => (
                                    <label
                                        key={period}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            padding: '10px 15px',
                                            border: '2px solid #e0e0e0',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        <Field
                                            type="radio"
                                            name="selectedPeriod"
                                            value={period}
                                            style={{ marginRight: '8px' }}
                                        />
                                        {period.charAt(0).toUpperCase() + period.slice(1)}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div style={{ position: 'relative' }}>
                            <FaEnvelope style={{
                                position: 'absolute',
                                left: '12px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#666'
                            }} />
                            <Field
                                name="userEmail"
                                type="email"
                                style={{
                                    width: '100%',
                                    padding: '12px 12px 12px 40px',
                                    border: '2px solid #e0e0e0',
                                    borderRadius: '8px',
                                    fontSize: '16px'
                                }}
                                placeholder="Your Email"
                            />
                            {errors.userEmail && touched.userEmail && (
                                <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
                                    {errors.userEmail}
                                </div>
                            )}
                        </div>

                        {status && status.error && (
                            <div style={{
                                color: 'red',
                                textAlign: 'center',
                                marginTop: '10px'
                            }}>
                                {status.error}
                            </div>
                        )}

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '14px',
                                backgroundColor: '#479eaf',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {loading ? 'Processing...' : 'Book Appointment'}
                        </motion.button>
                    </Form>
                )}
            </Formik>
        </motion.div>
    );
};

export default AppointmentBooking;




// for paymentent path

// import React, { useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { initiatePayment } from '../services/paymentService';
// import './AppointmentBooking.css';

// const AppointmentBooking = () => {
//     const location = useLocation();
//     const selectedDoctor = location.state?.doctor;
//     const navigate = useNavigate();

//     const [date, setDate] = useState('');
//     const [userEmail, setUserEmail] = useState('');
//     const [userName, setUserName] = useState('');
//     const [selectedPeriod, setSelectedPeriod] = useState('morning');
//     const [amount, setAmount] = useState(selectedDoctor?.fee || 500); // Default fee
//     const [error, setError] = useState('');
//     const [loading, setLoading] = useState(false);

//     const handleBooking = async () => {
//         if (!date.trim() || !userEmail.trim() || !userName.trim()) {
//             setError('Please fill all required fields');
//             return;
//         }

//         setLoading(true);
//         try {
//             // First create appointment
//             const appointmentResponse = await fetch('http://localhost:5000/api/appointments/book', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     doctorName: selectedDoctor.name,
//                     userName,
//                     date,
//                     time: selectedPeriod,
//                     userEmail,
//                     specialty: selectedDoctor.specialty,
//                     location: selectedDoctor.location,
//                 }),
//             });

//             if (!appointmentResponse.ok) {
//                 throw new Error('Failed to create appointment');
//             }

//             const appointmentData = await appointmentResponse.json();

//             // Then initiate payment
//             const paymentData = {
//                 doctorId: selectedDoctor._id,
//                 doctorName: selectedDoctor.name,
//                 userName,
//                 userEmail,
//                 appointmentId: appointmentData._id,
//                 date,
//                 time: selectedPeriod,
//                 amount: Number(amount)
//             };

//             const paymentResponse = await initiatePayment(paymentData);

//             if (paymentResponse.success && paymentResponse.paymentUrl) {
//                 window.location.href = paymentResponse.paymentUrl;
//             } else {
//                 setError('Payment initiation failed. Please try again.');
//             }
//         } catch (error) {
//             console.error('Error:', error);
//             setError('Failed to process your request. Please try again.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     if (!selectedDoctor) {
//         return <p>Please select a doctor first.</p>;
//     }

//     return (
//         <div className="appointment-booking-container">
//             <h2>Book an Appointment with {selectedDoctor.name}</h2>
//             {error && <p className="error-message">{error}</p>}
//             <div className="form-group">
//                 <label>Your Name:</label>
//                 <input
//                     type="text"
//                     value={userName}
//                     onChange={(e) => setUserName(e.target.value)}
//                     required
//                 />
//             </div>
//             <div className="form-group">
//                 <label>Select Date:</label>
//                 <input
//                     type="date"
//                     value={date}
//                     onChange={(e) => setDate(e.target.value)}
//                     required
//                 />
//             </div>
//             <div className="form-group">
//                 <label>Select Time Period:</label>
//                 <div className="radio-group">
//                     <label>
//                         <input
//                             type="radio"
//                             value="morning"
//                             checked={selectedPeriod === 'morning'}
//                             onChange={() => setSelectedPeriod('morning')}
//                         />
//                         Morning
//                     </label>
//                     <label>
//                         <input
//                             type="radio"
//                             value="afternoon"
//                             checked={selectedPeriod === 'afternoon'}
//                             onChange={() => setSelectedPeriod('afternoon')}
//                         />
//                         Afternoon
//                     </label>
//                     <label>
//                         <input
//                             type="radio"
//                             value="evening"
//                             checked={selectedPeriod === 'evening'}
//                             onChange={() => setSelectedPeriod('evening')}
//                         />
//                         Evening
//                     </label>
//                 </div>
//             </div>
//             <div className="form-group">
//                 <label>Your Email:</label>
//                 <input
//                     type="email"
//                     value={userEmail}
//                     onChange={(e) => setUserEmail(e.target.value)}
//                     required
//                 />
//             </div>
//             <div className="form-group">
//                 <label>Consultation Fee:</label>
//                 <input
//                     type="number"
//                     value={amount}
//                     readOnly
//                 />
//             </div>
//             <button 
//                 onClick={handleBooking} 
//                 disabled={loading}
//             >
//                 {loading ? 'Processing...' : 'Book Appointment & Pay'}
//             </button>
//         </div>
//     );
// };

// export default AppointmentBooking;

//dont take this

// import React, { useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { initiatePayment } from '../services/paymentService';
// import './AppointmentBooking.css';

// const AppointmentBooking = () => {
//     const location = useLocation();
//     const selectedDoctor = location.state?.doctor;  // Get selected doctor from state
//     const navigate = useNavigate();

//     // State variables
//     const [date, setDate] = useState('');
//     const [userEmail, setUserEmail] = useState('');
//     const [userName, setUserName] = useState('');
//     const [selectedPeriod, setSelectedPeriod] = useState('morning');
//     const [amount, setAmount] = useState(selectedDoctor?.fee || 0); // Default fee is the doctor's fee
//     const [error, setError] = useState('');

//     // Handle booking and payment initiation
//     const handleBooking = async () => {
//         // Validate fields
//         if (!date.trim()) {
//             setError('Please select a date.');
//             return;
//         }
//         if (!userEmail.trim()) {
//             setError('Please enter your email.');
//             return;
//         }
//         if (!userName.trim()) {
//             setError('Please enter your name.');
//             return;
//         }

//         try {
//             const paymentData = {
//                 doctorId: selectedDoctor.id,
//                 doctorName: selectedDoctor.name,
//                 userName,
//                 userEmail,
//                 date,
//                 time: selectedPeriod,
//                 amount,
//             };

//             const response = await initiatePayment(paymentData);

//             if (response.success) {
//                 // Redirect to PhonePe payment page
//                 window.location.href = response.paymentUrl;
//             } else {
//                 setError('Failed to initiate payment. Please try again.');
//             }
//         } catch (error) {
//             console.error('Error initiating payment:', error);
//             setError('An unexpected error occurred. Please try again later.');
//         }
//     };

//     // If no doctor is selected, show a message
//     if (!selectedDoctor) {
//         return <p>Please select a doctor first.</p>;
//     }

//     return (
//         <div className="appointment-booking-container">
//             <h2>Book an Appointment with {selectedDoctor.name}</h2>
//             {error && <p className="error-message">{error}</p>}
//             <div className="form-group">
//                 <label>Your Name:</label>
//                 <input
//                     type="text"
//                     value={userName}
//                     onChange={(e) => setUserName(e.target.value)}
//                     required
//                 />
//             </div>
//             <div className="form-group">
//                 <label>Select Date:</label>
//                 <input
//                     type="date"
//                     value={date}
//                     onChange={(e) => setDate(e.target.value)}
//                     required
//                 />
//             </div>
//             <div className="form-group">
//                 <label>Select Time Period:</label>
//                 <div className="radio-group">
//                     <label>
//                         <input
//                             type="radio"
//                             value="morning"
//                             checked={selectedPeriod === 'morning'}
//                             onChange={() => setSelectedPeriod('morning')}
//                         />
//                         Morning
//                     </label>
//                     <label>
//                         <input
//                             type="radio"
//                             value="afternoon"
//                             checked={selectedPeriod === 'afternoon'}
//                             onChange={() => setSelectedPeriod('afternoon')}
//                         />
//                         Afternoon
//                     </label>
//                     <label>
//                         <input
//                             type="radio"
//                             value="evening"
//                             checked={selectedPeriod === 'evening'}
//                             onChange={() => setSelectedPeriod('evening')}
//                         />
//                         Evening
//                     </label>
//                 </div>
//             </div>
//             <div className="form-group">
//                 <label>Your Email:</label>
//                 <input
//                     type="email"
//                     value={userEmail}
//                     onChange={(e) => setUserEmail(e.target.value)}
//                     required
//                 />
//             </div>
//             <button onClick={handleBooking}>Book Appointment & Pay</button>
//         </div>
//     );
// };

// export default AppointmentBooking;

// import React, { useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import './AppointmentBooking.css';

// const AppointmentBooking = () => {
//     const location = useLocation();
//     const selectedDoctor = location.state?.doctor; // Get the selected doctor from the location state

//     // State variables
//     const [date, setDate] = useState('');
//     const [userEmail, setUserEmail] = useState('');
//     const [userName, setUserName] = useState(''); // Add userName state
//     const [selectedPeriod, setSelectedPeriod] = useState('morning');
//     const [error, setError] = useState('');

//     // Handle booking function
//     const handleBooking = async () => {
//         // Validate fields
//         if (!date.trim()) {
//             setError('Please select a date.');
//             return;
//         }
//         if (!userEmail.trim()) {
//             setError('Please enter your email.');
//             return;
//         }
//         if (!userName.trim()) {
//             setError('Please enter your name.'); // Validate user name
//             return;
//         }

//         try {
//             const response = await fetch('http://localhost:5000/api/appointments/book', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     doctorName: selectedDoctor.name, // Send doctor's name
//                     userName, // Send user's name
//                     date,
//                     time: selectedPeriod,
//                     userEmail,
//                     specialty: selectedDoctor.specialty,
//                     location: selectedDoctor.location,
//                 }),
//             });

//             if (response.ok) {
//                 alert('Appointment booked successfully!');
//                 setDate('');
//                 setUserEmail('');
//                 setUserName(''); // Clear user name field
//                 setSelectedPeriod('morning');
//                 setError(''); // Clear error message
//             } else {
//                 const errorData = await response.json();
//                 setError(errorData.message || 'Failed to book appointment.');
//             }
//         } catch (error) {
//             console.error('Error booking appointment:', error);
//             setError('An unexpected error occurred. Please try again later.');
//         }
//     };

//     // If no doctor is selected, show a message
//     if (!selectedDoctor) {
//         return <p>Please select a doctor first.</p>;
//     }

//     return (
//         <div className="appointment-booking-container">
//             <h2>Book an Appointment with {selectedDoctor.name}</h2>
//             {error && <p className="error-message">{error}</p>}
//             <div className="form-group">
//                 <label htmlFor="userName">Your Name:</label>
//                 <input
//                     type="text"
//                     id="userName"
//                     value={userName}
//                     onChange={(e) => setUserName(e.target.value)}
//                     required
//                 />
//             </div>
//             <div className="form-group">
//                 <label htmlFor="date">Select Date:</label>
//                 <input
//                     type="date"
//                     id="date"
//                     value={date}
//                     onChange={(e) => setDate(e.target.value)}
//                     required
//                 />
//             </div>
//             <div className="form-group">
//                 <label>Select Time Period:</label>
//                 <div className="radio-group">
//                     <label>
//                         <input
//                             type="radio"
//                             value="morning"
//                             checked={selectedPeriod === 'morning'}
//                             onChange={() => setSelectedPeriod('morning')}
//                         />
//                         Morning
//                     </label>
//                     <label>
//                         <input
//                             type="radio"
//                             value="afternoon"
//                             checked={selectedPeriod === 'afternoon'}
//                             onChange={() => setSelectedPeriod('afternoon')}
//                         />
//                         Afternoon
//                     </label>
//                     <label>
//                         <input
//                             type="radio"
//                             value="evening"
//                             checked={selectedPeriod === 'evening'}
//                             onChange={() => setSelectedPeriod('evening')}
//                         />
//                         Evening
//                     </label>
//                 </div>
//             </div>
//             <div className="form-group">
//                 <label htmlFor="email">Your Email:</label>
//                 <input
//                     type="email"
//                     id="email"
//                     value={userEmail}
//                     onChange={(e) => setUserEmail(e.target.value)}
//                     required
//                 />
//             </div>
//             <button className="book-button" onClick={handleBooking}>Book Appointment</button>
//         </div>
//     );
// };

// export default AppointmentBooking;
