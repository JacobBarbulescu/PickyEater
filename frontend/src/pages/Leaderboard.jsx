// Jacob — top foods + top players pulled from Redis via /api/leaderboard
import { useState, useEffect } from 'react';
import LeaderboardTable from '../components/LeaderboardTable';
import api from '../api';

function Leaderboard() {
    const [typeOfLeaderboard, setTypeOfLeaderboard] = useState("users");
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [error, setError] = useState(null);

    async function loadLeaderboard() {
        try {
            const res = await api.get(`/leaderboard/${typeOfLeaderboard}`);
            setLeaderboardData(res.data);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                setError(error.response.data.error);
            } else {
                setError("An error occurred loading leaderboard");
            }
        }
    }

    useEffect(() => {
        loadLeaderboard();
    }, [typeOfLeaderboard]);

    return (
        <div>
            <h1>Leaderboard</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <label htmlFor="typeOfLeaderboard">Type of Leaderboard: </label>
            <select value={typeOfLeaderboard} onChange={(e) => setTypeOfLeaderboard(e.target.value)}>
                <option value="users">Users</option>
                <option value="foods">Foods</option>
            </select>

            <LeaderboardTable type={typeOfLeaderboard} items={leaderboardData} />
        </div>
    )
}

export default Leaderboard;
