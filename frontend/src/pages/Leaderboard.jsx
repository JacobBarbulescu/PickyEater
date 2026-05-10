// Jacob — top foods + top players pulled from Redis via /api/leaderboard
import { useState, useEffect } from 'react';
import LeaderboardTable from '../components/LeaderboardTable';
import api from '../api';

const LIMIT = 10;

function Leaderboard() {
    const [typeOfLeaderboard, setTypeOfLeaderboard] = useState("users");
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);

    async function loadLeaderboard(currentPage) {
        setError(null);
        try {
            const res = await api.get(`/leaderboard/${typeOfLeaderboard}?page=${currentPage}&limit=${LIMIT}`);
            setLeaderboardData(res.data);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                setError(error.response.data.error);
            } else {
                setError("An error occurred loading leaderboard");
            }
        }
    }

    // Reset to page 1 when switching leaderboard type
    useEffect(() => {
        setPage(1);
    }, [typeOfLeaderboard]);

    // Reload whenever page or type changes
    useEffect(() => {
        loadLeaderboard(page);
    }, [page, typeOfLeaderboard]);

    const isLastPage = leaderboardData.length < LIMIT;

    return (
        <div>
            <h1>Leaderboard</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <label htmlFor="typeOfLeaderboard">Type of Leaderboard: </label>
            <select id="typeOfLeaderboard" value={typeOfLeaderboard} onChange={(e) => setTypeOfLeaderboard(e.target.value)}>
                <option value="users">Users</option>
                <option value="foods">Foods</option>
            </select>

            <LeaderboardTable type={typeOfLeaderboard} items={leaderboardData} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
                <button onClick={() => setPage(p => p - 1)} style={{ display: page === 1 ? "none" : "block" }}>Prev</button>
                <span>Page {page}</span>
                <button onClick={() => setPage(p => p + 1)} style={{ display: isLastPage ? "none" : "block" }}>Next</button>
            </div>
        </div>
    )
}

export default Leaderboard;
