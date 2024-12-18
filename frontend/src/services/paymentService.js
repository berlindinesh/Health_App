export const initiatePayment = async (paymentData) => {
    const response = await fetch('/api/payment/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData),
    });

    return await response.json();
};

