// Jason — logged-in user's stats, bio, and account info
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProfile, updateBio } from '../api/index.js';
import FoodImage from '../components/FoodImage.jsx';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [editingBio, setEditingBio] = useState(false);
    const [bioInput, setBioInput] = useState('');

    useEffect(() => {
        async function load() {
            try {
                const res = await getProfile();
                setUser(res.data);
                setBioInput(res.data.bio || '');
            } catch (e) {
                setError('Could not load profile.');
            }
        }
        load();
    }, []);

    async function handleSaveBio() {
        try {
            await updateBio(bioInput);
            setUser(prev => ({ ...prev, bio: bioInput }));
            setEditingBio(false);
        } catch (e) {
            setError('Could not update bio.');
        }
    }

    if (error) return <div>{error}</div>;
    if (!user) return <div>Loading...</div>;

    return (
        <div>
            <h1>{user.username}'s Profile</h1>

            <div className="bio-section">
                {editingBio ? (
                    <div>
                        <textarea
                            value={bioInput}
                            onChange={e => setBioInput(e.target.value)}
                            maxLength={100}
                            rows={5}
                            className="bio-textarea"
                        />
                        <p>{bioInput.length}/100</p>
                        <div>
                            <button onClick={handleSaveBio}>Save</button>
                            <button onClick={() => setEditingBio(false)}>Cancel</button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <p className="bio-text">{user.bio || 'No bio yet.'}</p>
                        <button onClick={() => setEditingBio(true)}>Edit Bio</button>
                    </div>
                )}
            </div>

            <details>
                <summary>Foods Uploaded</summary>
                <div className="admin-list">
                    {(user.foods || []).map((food, index) => (
                        <div key={index} className="admin-item">
                            <p>{food.name}</p>
                            <FoodImage src={food.imageUrl} alt={food.name} style={{ width: '100px', height: '100px' }} />
                            <Link to={`/food/${food._id}`}>View Food</Link>
                        </div>
                    ))}
                </div>
            </details>

            <details>
                <summary>Favorite Foods</summary>
                <div className="admin-list">
                    {(user.favoriteFoods || []).map((food, index) => (
                        <div key={index} className="admin-item">
                            <p>{food.name}</p>
                            <FoodImage src={food.imageUrl} alt={food.name} style={{ width: '100px', height: '100px' }} />
                            <p>Times Chosen: {food.timesChosen}</p>
                            <Link to={`/food/${food._id}`}>View Food</Link>
                        </div>
                    ))}
                </div>
            </details>

            <h2>Stats</h2>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Total Score:</strong> {user.score}</p>
            <p><strong>Best Score:</strong> {user.bestScore}</p>
            <p><strong>Total Votes Cast:</strong> {user.numVotes}</p>
            <p><strong>Member Since:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
        </div>
    );
};

export default Profile;
