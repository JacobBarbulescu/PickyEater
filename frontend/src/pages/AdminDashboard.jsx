// Jason — lists pending food submissions; approve / reject via PATCH|DELETE /api/admin
import React, { useEffect, useState } from 'react';
import api from '../api/index';


function AdminDashboard() {
    const [pendingFoods, setPendingFoods] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        async function load() {
            try {
                const res = await api.get('/admin/pending');
                setPendingFoods(res.data);
            } catch (e) {
                console.error('Error loading pending foods:', e);
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
            console.error('Error approving food:', e);
            setMessage('Error approving food');
        }
    }

    async function rejectFood(id) {
        try {
            await api.delete(`/admin/reject/${id}`);
            setMessage('Food rejected and deleted');
            setPendingFoods(prev => prev.filter(f => f._id !== id));
        } catch (e) {
            console.error('Error rejecting food:', e);
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
                            <img
                                src={food.image ? `http://localhost:5000/api/admin/image/${food._id}` : food.imageUrl}
                                alt={food.name}
                                className="admin-food-image"
                            />
                            <h2 className="admin-food-name">{food.name}</h2>
                            <div>
                                <button onClick={() => approveFood(food._id)}>Approve</button>
                                <button onClick={() => rejectFood(food._id)}>Reject</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )

}

export default AdminDashboard;
