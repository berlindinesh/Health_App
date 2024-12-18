const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Email transporter setup
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

// Register User
exports.registerUser = async (req, res) => {
    const { name, email, password, phone } = req.body; // Include 'phone'
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, phone, password: hashedPassword, otp }); // Include 'phone' in User model
        await user.save();

        const mailOptions = {
            from: process.env.USER,
            to: email,
            subject: "Thanks for Signing up in HealthCare - OTP Verification",
            text: `Hi ${name}, welcome to HealthCare! Your OTP is ${otp}.`,
        };

        await transporter.sendMail(mailOptions);

        res.status(201).json({ message: "User Registered Successfully. An OTP has been sent to your email." });
    } catch (error) {
        console.error("Registration Error:", error); // Debugging log
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// Verify OTP Handler
exports.verifyOtpHandler = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        console.log("Stored OTP:", user.otp); // Debugging logs
        console.log("Provided OTP:", otp);

        if (user.otp === otp) {
            user.isVerified = true;
            user.otp = null;

            const token = jwt.sign(
                { email: user.email, userId: user._id, isVerified: true },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            user.token = token;
            await user.save();

            return res.status(200).json({ message: "OTP verified successfully", token });
        } else {
            return res.status(400).json({ message: "Invalid OTP" });
        }
    } catch (err) {
        console.error("OTP Verification Error:", err);
        return res.status(500).json({ message: "Failed to verify OTP", error: err.message });
    }
};

// Login User
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });

        if (!user.isVerified) {
            return res.status(400).json({ message: 'Please verify your email before logging in.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token, user });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
        const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

        const mailOptions = {
            from: process.env.USER,
            to: email,
            subject: 'Password Reset Request',
            html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link will expire in 15 minutes.</p>`,
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Password reset link has been sent to your email.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.findByIdAndUpdate(decoded.userId, { password: hashedPassword });
        res.status(200).json({ message: 'Password reset successful. You can now log in.' });
    } catch (error) {
        res.status(400).json({ message: 'Invalid or expired token.' });
    }
};

// Handle Google and GitHub Login
exports.handleOAuthCallback = async (req, res) => {
    try {
        const user = req.user; // User info comes from passport
        if (!user) {
            return res.status(400).json({ message: 'User authentication failed.' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        // Redirect to frontend with the token
        res.redirect(`http://localhost:3000/doctor-selection?token=${token}`);
    } catch (error) {
        console.error('OAuth callback error:', error);
        res.status(500).json({ message: 'An error occurred during authentication, please try again.' });
    }
};

