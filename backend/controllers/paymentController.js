const axios = require('axios');
const phonepeConfig = require('../config/ponepeConfig');
const Payment = require('../models/Payment');
const crypto = require('crypto');

const paymentController = {
    initiatePayment: async (req, res) => {
        try {
            const { amount, doctorId, appointmentId, userEmail } = req.body;
            console.log('Payment Data:', { amount, doctorId, appointmentId, userEmail });
            console.log('Phonepe Config:', phonepeConfig);
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const merchantTransactionId = `TXN_${Date.now()}_${Math.random().toString(36).slice(2)}`;
            
            const payload = {
                merchantId: phonepeConfig.PHONEPE_MERCHANT_ID,
                merchantTransactionId: merchantTransactionId,
                amount: amount * 100,
                redirectUrl: `${process.env.FRONTEND_URL}/payment-status`,
                redirectMode: "POST",
                callbackUrl: `${process.env.BACKEND_URL}/api/payment/callback`,
                mobileNumber: "",
                paymentInstrument: {
                    type: "PAY_PAGE"
                }
            };

            const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
            const checksum = crypto
                .createHash('sha256')
                .update(base64Payload + "/pg/v1/pay" + phonepeConfig.PHONEPE_SALT_KEY)
                .digest('hex') + "###" + 1;

            const response = await axios.post(
                `${phonepeConfig.PHONEPE_BASE_URL}/pg/v1/pay`,
                {
                    request: base64Payload
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-VERIFY': checksum
                    }
                }
            );

            // Create payment record with all required fields
            await Payment.create({
                userId: req.user?._id,
                appointmentId: appointmentId,
                doctorId: doctorId,
                paymentMethod: 'PhonePe',
                paymentStatus: 'Pending',
                transactionId: merchantTransactionId,
                amount: amount,
                createdAt: Date.now(),
                updatedAt: Date.now()
            });

            return res.json({
                success: true,
                paymentUrl: response.data.data.instrumentResponse.redirectInfo.url
            });
        } catch (error) {
            if (error.response?.status === 429) {
                return res.status(429).json({
                    success: false,
                    message: 'Please wait a moment before trying again'
                });
            }
            console.error('Payment Error:', error);
            return res.status(500).json({
                success: false,
                message: 'Payment initiation failed',
                error: error.message
            });
        }
    },


    paymentCallback: async (req, res) => {
        try {
            const { merchantTransactionId, transactionId, status } = req.body;

            const checksum = crypto
                .createHash('sha256')
                .update(`/pg/v1/status/${phonepeConfig.PHONEPE_MERCHANT_ID}/${merchantTransactionId}` + phonepeConfig.PHONEPE_SALT_KEY)
                .digest('hex') + "###" + 1;

            const statusResponse = await axios.get(
                `${phonepeConfig.PHONEPE_BASE_URL}/pg/v1/status/${phonepeConfig.PHONEPE_MERCHANT_ID}/${merchantTransactionId}`,
                {
                    headers: {
                        'X-VERIFY': checksum,
                        'X-MERCHANT-ID': phonepeConfig.PHONEPE_MERCHANT_ID
                    }
                }
            );

            await Payment.findOneAndUpdate(
                { transactionId: merchantTransactionId },
                { 
                    paymentStatus: statusResponse.data.code === 'PAYMENT_SUCCESS' ? 'Completed' : 'Failed',
                    updatedAt: Date.now()
                }
            );

            return res.json({
                success: true,
                message: 'Payment status updated successfully'
            });

        } catch (error) {
            console.error('Payment callback error:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to process payment callback'
            });
        }
    }
};

module.exports = paymentController;
