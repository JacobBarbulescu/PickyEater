// Detailed stats page for a single food: win rate, total votes, rank — GET /api/foods/:id/stats
// Jason — public profile view for any user
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/index.js';
import FoodImage from '../components/FoodImage.jsx';

const FoodStats = () => {
    const { id } = useParams();
    const [food, setFood] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function load() {
            try {
                const res = await api.get(`/foods/${id}`);
                setFood(res.data);
            } catch (e) {
                setError('Food not found.');
            }
        }
        load();
    }, [id]);

    if (error) return <div>{error}</div>;
    if (!food) return <div>Loading...</div>;

    return (
        <div>
            <h1>{food.name}</h1>

            <FoodImage src={food.imageUrl} alt={food.name} style={{ width: '100px', height: '100px' }} />

            <p><strong>Uploaded by:</strong> <Link to={`/users/${food.uploadedBy}`}> {food.uploadedByName}</Link></p>

            <h2>Stats</h2>
            <p><strong>Win Rate:</strong> {(food.wins / (food.totalVotes + 1)) * 100}%</p>
            <p><strong>Wins:</strong> {food.wins || 0}</p>
            <p><strong>Total Votes Cast:</strong> {food.totalVotes || 0}</p>
            <p><strong>Date Uploaded:</strong> {new Date(food.createdAt).toLocaleDateString()}</p>
            <p><strong>Uploaded by:</strong> </p>
        </div>
    );
};

export default FoodStats;
