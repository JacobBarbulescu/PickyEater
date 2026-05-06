import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Admin from './pages/AdminDashboard';
import Game from './pages/Game';
import Vote from './pages/VoteGame';
import Leaderboard from './pages/Leaderboard';
import Search from './pages/FoodSearch';
import Upload from './pages/Upload';
import Profile from './pages/Profile';
import UserSearch from './pages/UserSearch';
import UserProfile from './pages/UserProfile';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <div>
            <Navbar />
            <div className="page-content">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/game" element={<ProtectedRoute><Game /></ProtectedRoute>} />
                    <Route path="/vote" element={<ProtectedRoute><Vote /></ProtectedRoute>} />
                    <Route path="/leaderboard" element={<Leaderboard />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                    <Route path="/users" element={<UserSearch />} />
                    <Route path="/users/:username" element={<UserProfile />} />
                    <Route path="/admin" element={<ProtectedRoute adminOnly={true}><Admin /></ProtectedRoute>} />
                </Routes>
            </div>
        </div>
    )
}

export default App;



