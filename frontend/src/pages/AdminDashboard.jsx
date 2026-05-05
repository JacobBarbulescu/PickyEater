// Jason — lists pending food submissions; approve / reject via PATCH|DELETE /api/admin
import React, { useEffect, useState } from 'react';
import api from '../api/index';
import '../App.css';

function AdminDashboard() {
    const [pendingFoods, setPendingFoods] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        async function load() {
            try {
                const res = await api.get('/admin/pending');
                setPendingFoods(res.data);
            } catch (e) {
                setMessage('Error loading pending foods');
            }
        }
        load();
    }, []);

    async function approveFood(id) {
        try {
            await api.patch(`/admin/approve/${id}`);
            setMessage('Food approved');
            setPendingFoods(prev => prev.filter(f => f._id !== id));
        } catch (e) {
            setMessage('Error approving food');
        }
    }

    async function rejectFood(id) {
        try {
            await api.delete(`/admin/reject/${id}`);
            setMessage('Food rejected and deleted');
            setPendingFoods(prev => prev.filter(f => f._id !== id));
        } catch (e) {
            setMessage('Error rejecting food');
        }
    }
    return (
        <div>
            <h1>Admin Dashboard</h1>
            {message && <p>{message}</p>}
            <h2>Pending Food Submissions</h2>
            {pendingFoods.length === 0 ? (
                <p>No pending foods</p>
            ) : (
                <div className="admin-list">
                    {pendingFoods.map((food) => (
                        <div key={food._id} className="admin-item">
                            <span className="admin-food-name">{food.name}</span>
                            <div>
                                <button className="btn" onClick={() => approveFood(food._id)}>Approve</button>
                                <button className="btn" onClick={() => rejectFood(food._id)}>Reject</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )

}

export default AdminDashboard;
