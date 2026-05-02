// Jason — login form, calls POST /api/auth/login, stores JWT in AuthContext
import React, { useState } from 'react';
import {useNavigate, Link} from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../api';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const { login } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', { email, password });
            login(response.data.token, response.data.user);
            navigate('/');
        } catch (e) {
            if (e.response && e.response.data && e.response.data.error) {
                setError(e.response.data.error);
            } else {
                setError('An error occurred during login');
            }  
        }
    }
    return (
        <div>
            <h1>Login</h1>
            {error && <p style={{color: 'red'}}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
                <button type="submit">Login</button>
            </form>
            <p>Need to create an account?  <Link to="/signup">Sign up</Link></p>
        </div>
    )
}

export default Login;