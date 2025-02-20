import React, { useState, useEffect } from 'react';
import './Search.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { assets } from '../../assets/assets';

const Search = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [showSearchBar, setShowSearchBar] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchResults = async () => {
            if (query.trim() === '') {
                setResults([]);
                return;
            }
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/food/search`, {
                    params: { query }
                });
                setResults(response.data.data);
            } catch (error) {
                console.error('Error searching for food items:', error);
            }
        };

        fetchResults();
    }, [query]);

    const handleResultClick = (id) => {
        navigate(`/product/${id}`);
        setShowSearchBar(false); // Hide search bar after clicking a result
    };

    return (
        <div className="search">
            {!showSearchBar ? (
                <img
                    src={assets.search_icon}
                    alt="Search"
                    className="search-icon"
                    onClick={() => setShowSearchBar(true)}
                />
            ) : (
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search for food items..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button onClick={() => setShowSearchBar(false)}>Close</button>
                </div>
            )}
            {showSearchBar && results.length > 0 && (
                <div className="search-results">
                    {results.map((item) => (
                        <div key={item._id} className="search-result-item" onClick={() => handleResultClick(item._id)}>
                            <p>{item.name}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Search;