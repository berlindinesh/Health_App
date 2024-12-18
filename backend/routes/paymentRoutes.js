const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Initiate payment
router.post('/initiate', paymentController.initiatePayment);

// Callback from PhonePe after payment
router.post('/callback', paymentController.paymentCallback);

module.exports = router;
