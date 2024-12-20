import React, { useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../components/AuthContext';
import { linkedinLogin } from '../services/authService';
import './LinkedInCallback.css';

const LinkedInCallback = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useContext(AuthContext);

    useEffect(() => {
        const code = new URLSearchParams(location.search).get('code');
        if (code) {
            handleLinkedInCode(code);
        } else {
            navigate('/login');
        }
    }, [location]);

    const handleLinkedInCode = async (code) => {
        try {
            const response = await linkedinLogin(code);
            if (response.data && response.data.token) {
                login(response.data.token);
                navigate('/dashboard');
            } else {
                throw new Error('Invalid response from LinkedIn auth');
            }
        } catch (error) {
            console.error('LinkedIn authentication failed:', error);
            navigate('/login', { 
                state: { 
                    error: 'LinkedIn login failed. Please try again.' 
                }
            });
        }
    };

    return (
        <div className="linkedin-callback-container">
            <div className="loading-spinner"></div>
            <h2>Processing LinkedIn Login...</h2>
        </div>
    );
};

export default LinkedInCallback;
