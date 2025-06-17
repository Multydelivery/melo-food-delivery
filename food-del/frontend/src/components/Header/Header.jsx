import React, { useState, useEffect } from 'react';  
import './Header.css';
import { assets } from '../../assets/assets.js';

const Header = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const images = [assets.guatape, assets.represa, assets.bandera];
    const captions = [
        "Discover the colombian sweetness",
        "Explore our culture",
        "Taste authentic flavors"
    ];

    const viewMenu = () => {
        const menuSection = document.getElementById('explore-menu');
        if (menuSection) {
            menuSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Pause autoplay on hover
    useEffect(() => {
        let interval;
        if (!isHovered) {
            interval = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % images.length);
            }, 5000);
        }
        return () => clearInterval(interval);
    }, [images.length, isHovered]);

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    return (
        <div className='header'>
            <div 
                className="slideshow"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {images.map((image, index) => (
                    <div 
                        key={index}
                        className={`slide ${index === currentSlide ? 'active' : ''}`}
                        style={{ backgroundImage: `url(${image})` }}
                    >
                        <div className="slide-caption">
                            {captions[index]}
                        </div>
                    </div>
                ))}
                
                <div className="slide-indicators">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            className={`indicator ${index === currentSlide ? 'active' : ''}`}
                            onClick={() => goToSlide(index)}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
            
            <div className='header-contents'>
                {/* <h2>Order your favorite dishes here!</h2>
                <p>Fresh ingredients, authentic recipes</p> */}
                <button onClick={viewMenu}>
                    View Menu <span className="arrow">→</span>
                </button>
            </div>
        </div>
    );
}

export default Header;