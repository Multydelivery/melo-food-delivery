import React, { useState, useEffect, useRef } from 'react';
import './Search.css'; // Import the CSS for the search bar
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { assets } from '../../assets/assets';

const Search = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [showSearchBar, setShowSearchBar] = useState(false);
    const inputRef = useRef(null);
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

    useEffect(() => {
        if (showSearchBar && inputRef.current) {
            inputRef.current.focus();
        }
    }, [showSearchBar]);

    const handleResultClick = (id) => {
        navigate(`/product/${id}`);
        setShowSearchBar(false); // Hide search bar after clicking a result
        window.scrollTo(0, 0); // Scroll to the top of the page
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
                        ref={inputRef}
                        type="text"
                        placeholder="Search for food items..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        autoFocus
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