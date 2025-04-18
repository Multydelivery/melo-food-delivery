import React, { useState, useEffect } from 'react';
import './Header.css';

const Header = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const images = [
        '/src/assets/stencil.guatape.jpg',
        '/src/assets/stencil.represaguatape.jpg', // Add your image paths here
        '/src/assets/stencil.banderacolombiacartagena.jpg',
        '/src/assets/image4.jpg'
    ];

    const viewMenu = () => {
        window.scrollTo(0, document.getElementById('explore-menu').offsetTop);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % images.length);
        }, 5000); // Change slide every 5 seconds
        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <div className='header'>
            {/* Slideshow container */}
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
