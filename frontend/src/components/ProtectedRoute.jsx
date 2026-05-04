// Redirects to /login if AuthContext has no valid token; optionally enforces adminOnly prop

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function ProtectedRoute({ children, adminOnly = false }) {
    const { token, currentUser } = useAuth();
    if (!token) {
        return <Navigate to="/login" />;
    }
    if (adminOnly && currentUser?.role !== 'admin') {
        return <Navigate to="/" />;
    }
    return children;
}

export default ProtectedRoute;