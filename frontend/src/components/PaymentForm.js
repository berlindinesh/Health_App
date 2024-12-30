// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { initiatePayment } from '../services/paymentService';

// const PaymentForm = ({ doctor, userDetails }) => {
//     const [amount, setAmount] = useState(0);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState('');
//     const navigate = useNavigate();

//     const handlePayment = async () => {
//         if (amount <= 0) {
//             setError('Amount should be greater than 0');
//             return;
//         }

//         setLoading(true);

//         try {
//             const paymentData = {
//                 doctorId: doctor.id,
//                 userName: userDetails.name,
//                 userEmail: userDetails.email,
//                 appointmentId: userDetails.appointmentId,
//                 amount,
//             };

//             const response = await initiatePayment(paymentData);

//             if (response.success) {
//                 window.location.href = response.paymentUrl; // Redirect to PhonePe's payment page
//             } else {
//                 setError('Payment initiation failed. Please try again.');
//             }
//         } catch (err) {
//             setError('Error initiating payment: ' + err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="payment-form">
//             <h2>Complete Payment</h2>
//             {error && <p className="error">{error}</p>}
//             <p>Doctor: {doctor.name}</p>
//             <p>Amount: ₹{amount}</p>
//             <button onClick={handlePayment} disabled={loading}>
//                 {loading ? 'Processing...' : 'Pay Now'}
//             </button>
//         </div>
//     );
// };

// export default PaymentForm;
