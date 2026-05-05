// Top nav: logo, links to Game/VoteGame/Leaderboard/Search, Login|Profile depending on auth state
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';
import { useAuth } from '../hooks/useAuth';

function Navbar() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    function handleLogout() {
        logout();
        navigate('/login');
    }
    return (
        <nav className="navbar">
            <Link to="/">PickyEater</Link>
            <Link to="/game">Game</Link>
            <Link to="/vote">Vote</Link>
            <Link to="/leaderboard">Leaderboard</Link>
            <Link to="/upload">Upload</Link>
            <Link to="/search">Search</Link>
            {currentUser ? (
                <span className="navbar-right">
                    <Link to="/profile">{currentUser.username}</Link>
                    {currentUser.role === 'admin' && <Link to="/admin">Admin</Link>}
                    <button onClick={handleLogout}>Logout</button>
                </span>
            ) : (
                <Link to="/login">Login</Link>
            )}
        </nav>
    )
}

export default Navbar;
