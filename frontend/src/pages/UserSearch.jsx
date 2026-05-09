// Jason — search for users by username
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { searchUsers } from '../api/index.js';

const UserSearch = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    useEffect(() => {
        if (query.trim().length < 2) {
            setResults([]);
            return;
        }
        const timeout = setTimeout(async () => {
            try {
                const res = await searchUsers(query.trim());
                setResults(res.data);
            } catch (e) {
                console.error('Search failed');
            }
        }, 300); // wait 300ms after typing stops before searching

        return () => clearTimeout(timeout);
    }, [query]);

    return (
        <div>
            <h1>Find Users</h1>
            <div className="search-wrapper">
                <input
                    type="text"
                    placeholder="Search by Username"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                />
                <small>Type at Least 2 Characters to Search.</small>
            </div>

            {query.length >= 2 && results.length === 0 && <p>No Users Found.</p>}

            <div>
                {results.map(user => (
                    <div key={user._id} className="admin-item">
                        <span>{user.username}</span>
                        <Link to={`/users/${user._id}`}>View Profile</Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserSearch;
