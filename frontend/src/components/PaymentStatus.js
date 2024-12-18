import React, { useEffect, useState } from 'react';

const PaymentStatus = () => {
    const [status, setStatus] = useState('Loading...');
    const [transactionDetails, setTransactionDetails] = useState(null);

    useEffect(() => {
        // Simulating a payment callback or status check
        // In reality, this would call an API to fetch payment status from backend
        setTimeout(() => {
            setStatus('Payment Successful');
            setTransactionDetails({
                transactionId: 'TXN123456',
                amount: '500',
                paymentMode: 'Credit Card',
            });
        }, 2000);
    }, []);

    return (
        <div className="payment-status">
            <h2>{status}</h2>
            {transactionDetails && (
                <div>
                    <p>Transaction ID: {transactionDetails.transactionId}</p>
                    <p>Amount: ₹{transactionDetails.amount}</p>
                    <p>Payment Mode: {transactionDetails.paymentMode}</p>
                </div>
            )}
        </div>
    );
};

export default PaymentStatus;
