// Jason — public profile view for any user
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getUserProfile } from '../api/index.js';

const UserProfile = () => {
    const { username } = useParams();
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function load() {
            try {
                const res = await getUserProfile(username);
                setUser(res.data);
            } catch (e) {
                setError('User not found.');
            }
        }
        load();
    }, [username]);

    if (error) return <div>{error}</div>;
    if (!user) return <div>Loading...</div>;

    return (
        <div>
            <h1>{user.username}'s Profile</h1>

            {user.bio && (
                <div className="bio-section">
                    <p className="bio-text">{user.bio}</p>
                </div>
            )}

            <h2>Stats</h2>
            <p><strong>Best Score:</strong> {user.bestScore || 0}</p>
            <p><strong>Total Score:</strong> {user.score || 0}</p>
            <p><strong>Total Votes Cast:</strong> {user.numVotes || 0}</p>
            <p><strong>Member Since:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
        </div>
    );
};

export default UserProfile;
