// Jacob — top foods + top players pulled from Redis via /api/leaderboard
import { useState, useEffect } from 'react';
import LeaderboardTable from '../components/LeaderboardTable';
import api from '../api';

const LIMIT = 10;

function Leaderboard() {
    const [typeOfLeaderboard, setTypeOfLeaderboard] = useState("users");
    const [sortParam, setSortParam] = useState("bestScore");
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [sortDirection, setSortDirection] = useState(-1);

    // Reload whenever page, type, or sort param changes
    useEffect(() => {
        async function loadLeaderboard() {
            setError(null);
            try {
                const res = await api.get(`/leaderboard/${typeOfLeaderboard}?page=${page}&limit=${LIMIT}&sortBy=${sortParam}&sortDirection=${sortDirection}`);
                setLeaderboardData(res.data);
            } catch (error) {
                if (error.response && error.response.data && error.response.data.error) {
                    setError(error.response.data.error);
                } else {
                    setError("An error occurred loading leaderboard");
                }
            }
        }
        loadLeaderboard();
    }, [page, typeOfLeaderboard, sortParam, sortDirection]);

    const isLastPage = leaderboardData.length < LIMIT;

    function handleTypeChange(e) {
        const newType = e.target.value;
        setTypeOfLeaderboard(newType);
        setPage(1);
        setSortDirection(-1);
        if (newType === "users") {
            setSortParam("bestScore");
        } else {
            setSortParam("wins");
        }
    }

    return (
        <div>
            <h1>Leaderboard</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <label htmlFor="typeOfLeaderboard">Type of Leaderboard: </label>
            <select id="typeOfLeaderboard" value={typeOfLeaderboard} onChange={handleTypeChange}>
                <option value="users">Users</option>
                <option value="foods">Foods</option>
            </select>

            <br />

            <label htmlFor="sortParam">Sort By: </label>
            <select id="sortParam" value={sortParam} onChange={(e) => setSortParam(e.target.value)}>
                {typeOfLeaderboard === "users" ? (
                    <>
                        <option value="bestScore">Best Score</option>
                        <option value="numVotes">Total Votes</option>
                        <option value="createdAt">Date Joined</option>
                        <option value="username">Username</option>
                    </>
                ) : (
                    <>
                        <option value="wins">Wins</option>
                        <option value="totalVotes">Total Votes</option>
                        <option value="createdAt">Date Uploaded</option>
                        <option value="name">Name</option>
                    </>
                )}
            </select>

            <br />

            <label htmlFor="sortDirection">Sort Direction: </label>
            <select id="sortDirection" value={sortDirection} onChange={(e) => setSortDirection(parseInt(e.target.value))}>
                <option value="-1">Descending</option>
                <option value="1">Ascending</option>
            </select>

            <LeaderboardTable type={typeOfLeaderboard} items={leaderboardData} />

            <div className="pageButtons">
                <button onClick={() => setPage(p => p - 1)} style={{ display: page === 1 ? "none" : "block" }}>Prev</button>
                <span>Page {page}</span>
                <button onClick={() => setPage(p => p + 1)} style={{ display: isLastPage ? "none" : "block" }}>Next</button>
            </div>
        </div>
    )
}

export default Leaderboard;
