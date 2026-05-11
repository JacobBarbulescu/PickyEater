import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { searchFoods } from '../api/index.js';
import FoodImage from '../components/FoodImage.jsx';

function FoodSearch() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    useEffect(() => {
        if (query.trim().length < 2) {
            setResults([]);
            return;
        }
        const timeout = setTimeout(async () => {
            try {
                const res = await searchFoods(query.trim());
                setResults(res.data);
            } catch (e) {
                console.error('Search failed');
            }
        }, 300);

        return () => clearTimeout(timeout);
    }, [query]);

    return (
        <div>
            <h1>Find Foods</h1>
            <div className="search-wrapper">
                <input
                    type="text"
                    placeholder="Search by Food Name"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                />
                <small>Type at Least 2 Characters to Search.</small>
            </div>

            {query.length >= 2 && results.length === 0 && <p>No Foods Found.</p>}

            <div>
                {results.map(food => (
                    <div key={food._id} className="admin-item">
                        <FoodImage src={food.imageUrl} alt={food.name} style={{ width: '60px', height: '60px' }} />
                        <span>{food.name}</span>
                        <Link to={`/food/${food._id}`}>View Food</Link>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default FoodSearch;
