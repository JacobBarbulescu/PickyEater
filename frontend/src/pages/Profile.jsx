// Jason — logged-in user's stats and account info
import { useState, useEffect } from 'react';
import { getProfile } from '../api/index.js';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function load() {
            try {
                const res = await getProfile();
                setUser(res.data);
            } catch (e) {
                setError('Could not load profile.');
            }
        }
        load();
    }, []);

    if (error) return <div>{error}</div>;
    if (!user) return <div>Loading...</div>;

    return (
        <div>
            <h1>Profile</h1>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Total Score:</strong> {user.score}</p>
            <p><strong>Best Score:</strong> {user.bestScore}</p>
            <p><strong>Total Votes Cast:</strong> {user.numVotes}</p>
            <p><strong>Member Since:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
        </div>
    );
};

export default Profile;
