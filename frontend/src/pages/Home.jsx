// Landing page — hero section with links to Game, VoteGame, and Leaderboard
import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function Home() {
    return (
        <div>
            <h1>Welcome to PickyEater</h1>
            <p>This is a food popularity guessing game.</p>
            <div className="home-links">
                <Link to="/game">Play PickyEater</Link>
                <Link to="/vote">Vote on different foods</Link>
                <Link to="/leaderboard">Leaderboard</Link>
            </div>
        </div>
    )
}

export default Home;