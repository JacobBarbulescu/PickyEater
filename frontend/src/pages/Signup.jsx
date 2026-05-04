// Jason — signup form, calls POST /api/auth/signup
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

function Signup() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            await api.post('/auth/signup', { email, username, password });
            navigate('/login');
        } catch (e) {
            if (e.response && e.response.data && e.response.data.error) {
                setError(e.response.data.error);
            } else {
                setError('There is an error with the registration. Try again.');
            }
        }
    }
    return (
        <div>
            <h1>Sign Up</h1>
            {error && <p style={{color: 'red'}}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input type="text" value={username} onChange={e => setUsername(e.target.value)} required />
                </div>
                <div>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
                <button type="submit">Sign Up</button>
            </form>
            <p>Already have an account? Click here<Link to="/login">Login</Link></p>
        </div>
    )
}

export default Signup;