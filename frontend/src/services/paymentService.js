// export const initiatePayment = async (paymentData) => {
//     try {
//         const response = await fetch('http://localhost:5000/api/payment/initiate', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 amount: paymentData.amount,
//                 doctorId: paymentData.doctorId,
//                 appointmentId: paymentData.appointmentId,
//                 userEmail: paymentData.userEmail
//             })
//         });

//         const data = await response.json();
//         return data;
//     } catch (error) {
//         console.error('Payment Error:', error);
//         throw new Error('Payment initiation failed');
//     }
// };
