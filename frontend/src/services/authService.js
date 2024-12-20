import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

const register = (name, email, password) => {
    return axios.post(`${API_URL}/register`, { name, email, password });
};

const login = (email, password) => {
    return axios.post(`${API_URL}/login`, { email, password });
};

const linkedinLogin = (code) => {
    return axios.post(`${API_URL}/auth/linkedin`, { code });
};


export { register, login , linkedinLogin };

