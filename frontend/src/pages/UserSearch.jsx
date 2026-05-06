// Jason — search for users by username
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { searchUsers } from '../api/index.js';

const UserSearch = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [searched, setSearched] = useState(false);

    async function handleSearch(e) {
        e.preventDefault();
        if (!query.trim()) return;
        try {
            const res = await searchUsers(query.trim());
            setResults(res.data);
            setSearched(true);
        } catch (e) {
            console.error('Search failed');
        }
    }

    return (
        <div>
            <h1>Find Users</h1>
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Search by username"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                />
                <button type="submit">Search</button>
            </form>

            {searched && results.length === 0 && <p>No users found.</p>}

            <div>
                {results.map(user => (
                    <div key={user._id} className="admin-item">
                        <span>{user.username}</span>
                        <Link to={`/users/${user.username}`}>View Profile</Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserSearch;
