import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { initiatePayment } from '../services/paymentService';
import './AppointmentBooking.css';

const AppointmentBooking = () => {
    const location = useLocation();
    const selectedDoctor = location.state?.doctor;
    const navigate = useNavigate();

    const [date, setDate] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userName, setUserName] = useState('');
    const [selectedPeriod, setSelectedPeriod] = useState('morning');
    const [amount, setAmount] = useState(selectedDoctor?.fee || 500); // Default fee
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleBooking = async () => {
        if (!date.trim() || !userEmail.trim() || !userName.trim()) {
            setError('Please fill all required fields');
            return;
        }

        setLoading(true);
        try {
            // First create appointment
            const appointmentResponse = await fetch('http://localhost:5000/api/appointments/book', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    doctorName: selectedDoctor.name,
                    userName,
                    date,
                    time: selectedPeriod,
                    userEmail,
                    specialty: selectedDoctor.specialty,
                    location: selectedDoctor.location,
                }),
            });

            if (!appointmentResponse.ok) {
                throw new Error('Failed to create appointment');
            }

            const appointmentData = await appointmentResponse.json();

            // Then initiate payment
            const paymentData = {
                doctorId: selectedDoctor._id,
                doctorName: selectedDoctor.name,
                userName,
                userEmail,
                appointmentId: appointmentData._id,
                date,
                time: selectedPeriod,
                amount: Number(amount)
            };

            const paymentResponse = await initiatePayment(paymentData);

            if (paymentResponse.success && paymentResponse.paymentUrl) {
                window.location.href = paymentResponse.paymentUrl;
            } else {
                setError('Payment initiation failed. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Failed to process your request. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!selectedDoctor) {
        return <p>Please select a doctor first.</p>;
    }

    return (
        <div className="appointment-booking-container">
            <h2>Book an Appointment with {selectedDoctor.name}</h2>
            {error && <p className="error-message">{error}</p>}
            <div className="form-group">
                <label>Your Name:</label>
                <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label>Select Date:</label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label>Select Time Period:</label>
                <div className="radio-group">
                    <label>
                        <input
                            type="radio"
                            value="morning"
                            checked={selectedPeriod === 'morning'}
                            onChange={() => setSelectedPeriod('morning')}
                        />
                        Morning
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="afternoon"
                            checked={selectedPeriod === 'afternoon'}
                            onChange={() => setSelectedPeriod('afternoon')}
                        />
                        Afternoon
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="evening"
                            checked={selectedPeriod === 'evening'}
                            onChange={() => setSelectedPeriod('evening')}
                        />
                        Evening
                    </label>
                </div>
            </div>
            <div className="form-group">
                <label>Your Email:</label>
                <input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label>Consultation Fee:</label>
                <input
                    type="number"
                    value={amount}
                    readOnly
                />
            </div>
            <button 
                onClick={handleBooking} 
                disabled={loading}
            >
                {loading ? 'Processing...' : 'Book Appointment & Pay'}
            </button>
        </div>
    );
};

export default AppointmentBooking;

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
