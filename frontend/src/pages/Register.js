import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography, IconButton, InputAdornment } from '@mui/material';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { FaEyeSlash, FaEye } from 'react-icons/fa'; 
import './styles/Register.css';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const googleLogin = () => {
        window.location.href = 'http://localhost:5000/api/auth/google';
    };

    const githubLogin = () => {
        window.location.href = 'http://localhost:5000/api/auth/github';
    };

    const linkedinLogin = () => {
        window.location.href = 'http://localhost:5000/api/auth/linkedin';
    };

    const facebookLogin = () => {
        window.location.href = 'http://localhost:5000/api/auth/facebook';
    };

    const twitterLogin = () => {
        window.location.href = 'http://localhost:5000/auth/twitter';
    };



    const handleRegister = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            await axios.post('http://localhost:5000/api/auth/register', {
                name,
                email,
                password,
                phone,
            });

            setMessage('An OTP has been sent to your email successfully! Please verify.');
            setTimeout(() => {
                navigate('/verify-otp', { state: { email } });
            }, 2000);
        } catch (error) {
            console.error("Registration Error:", error.response?.data); 
            setMessage(error.response?.data?.message || 'Registration failed. Please try again.');
        }
    };

    React.useEffect(() => {
        gsap.from(".register-container", { opacity: 0, y: -50, duration: 1 });
    }, []);

    return (
        <Box
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="register-container"
            sx={{
                maxWidth: '400px',
                margin: 'auto',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                background: '#f9f9f9',
                mt: 8,
            }}
        >
            <Typography
                variant="h4"
                component={motion.h2}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                sx={{ mb: 2, textAlign: 'center', color: '#333' }}
            >
                SignUp
            </Typography>

            <form onSubmit={handleRegister}>
                <TextField
                    type="text"
                    label="Name"
                    variant="outlined"
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    sx={{ mb: 2 }}
                />
                <TextField
                    type="email"
                    label="Email"
                    variant="outlined"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Password"
                    variant="outlined"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    sx={{ mb: 2 }}
                    type={showPassword ? 'text' : 'password'}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                <TextField
                    type="text"
                    label="Phone"
                    variant="outlined"
                    fullWidth
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    sx={{ mb: 3 }}
                />
                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{
                        background: 'linear-gradient(45deg, #2196F3, #21CBF3)',
                        color: 'white',
                        py: 1.5,
                        fontSize: '1rem',
                        textTransform: 'none',
                        '&:hover': { background: '#1976D2' },
                    }}
                >
                    SignUp
                </Button>
                <div style={{ textAlign: 'center', marginTop: '10px' }}>
                    <button onClick={googleLogin} style={{ marginRight: '10px', padding: '10px 20px', backgroundColor: '#DB4437', color: '#fff', border: 'none', borderRadius: '5px' }}>
                        Sign-up with Google
                    </button>
                    <button onClick={githubLogin} style={{ marginRight: '10px', padding: '10px 20px', backgroundColor: '#24292e', color: '#fff', border: 'none', borderRadius: '5px' }}>
                        Sign-up with GitHub
                    </button>
                    <button onClick={linkedinLogin} style={{ marginRight: '10px', padding: '10px 20px', backgroundColor: '#0077B5', color: '#fff', border: 'none', borderRadius: '5px' }}>
                        Sign-up with LinkedIn
                    </button>
                    <button onClick={facebookLogin} style={{ padding: '10px 20px', backgroundColor: '#1877F2', color: '#fff', border: 'none', borderRadius: '5px', marginTop: '10px' }}>
                        Sign-up with Facebook
                    </button>
                    <button onClick={twitterLogin} style={{ padding: '10px 20px', backgroundColor: '#1877F2', color: '#fff', border: 'none', borderRadius: '5px', marginTop: '10px' }}>
                        Sign-up with X
                    </button>
                </div>
            </form>

            {message && (
                <Typography
                    component={motion.p}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    sx={{ color: 'red', mt: 2, textAlign: 'center' }}
                >
                    {message}
                </Typography>
            )}
        </Box>
    );
};

export default Register;
