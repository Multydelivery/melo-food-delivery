import React, { useState, useEffect } from 'react';  
import './Header.css';
import { assets } from '../../assets/assets.js';

const Header = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const images = [assets.guatape, assets.represa, assets.bandera];

    const viewMenu = () => {
        window.scrollTo(0, document.getElementById('explore-menu').offsetTop);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % images.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <div className='header'>
            <div className="slideshow">
                {images.map((image, index) => (
                    <div 
                        key={index}
                        className={`slide ${index === currentSlide ? 'active' : ''}`}
                        style={{ backgroundImage: `url(${image})` }}
                    />
                ))}
            </div>
            
            <div className='header-contents'>
                <h2>Order your favourites here!</h2>
                <button onClick={viewMenu}>View Menu</button>
            </div>
        </div>
    );
}

export default Header;