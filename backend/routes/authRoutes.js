const express = require('express');
const { registerUser, loginUser, verifyOtpHandler,  forgotPassword, resetPassword, handleOAuthCallback} = require('../controllers/authController');
const router = express.Router();
const passport = require('passport');
const User = require("../models/User");

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify-otp', verifyOtpHandler)
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// Google OAuth Routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google callback route with error handling
router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        // If OAuth fails, redirect to login page with an error message
        if (!req.user) {
            return res.status(401).send({ message: 'Google authentication failed. Please try again.' });
        }
        handleOAuthCallback(req, res); // Proceed to handle OAuth callback
    }
);

// GitHub OAuth Routes
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

// GitHub callback route with error handling
router.get(
    '/github/callback',
    passport.authenticate('github', { failureRedirect: '/' }),
    (req, res) => {
        // If OAuth fails, redirect to login page with an error message
        if (!req.user) {
            return res.status(401).send({ message: 'GitHub authentication failed. Please try again.' });
        }
        handleOAuthCallback(req, res); // Proceed to handle OAuth callback
    }
);

// LinkedIn Authentication
router.get('/linkedin', passport.authenticate('linkedin', { state: 'SOME STATE' }));

router.get('/linkedin/callback', 
  passport.authenticate('linkedin', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication
    res.redirect('/dashboard');  // Redirect to your desired route after login
  });

// Facebook OAuth
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get(
    '/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/' }),
    handleOAuthCallback
);

// Twitter OAuth routes
router.get('/twitter', passport.authenticate('twitter'));
router.get('/twitter/callback',
    passport.authenticate('twitter', { failureRedirect: '/login' }),
    handleOAuthCallback
);


module.exports = router;
