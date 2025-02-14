import React from 'react'
import './Header.css'

const Header = () => {
    const viewMenu = () => {
        window.scrollTo(0,document.getElementById('explore-menu').offsetTop);
    };

    return (
        <div className='header'>
            <div className='header-contents'>
                <h2>Order your favourite food here</h2>
                {/* Uncomment the below line for additional text */}
                {/* <p>Choose from a diverse menu featuring a delectable array of dishes crafted with the finest ingredients and culinary expertise. Our mission is to satisfy your cravings and elevate your dining experience, one delicious meal at a time.</p> */}
                <button onClick={viewMenu}>View Menu</button>
                <div className='header-image'>
                    <iframe className="soundcloud-player" src="https://w.soundcloud.com/player/?url=https%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F1859836161&color=%23b3b8b5&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"></iframe>
                    <div className="soundcloud-info">
                        <a href="https://soundcloud.com/flaneur23" title="Flâneur" target="_blank">Flâneur</a> · 
                        <a href="https://soundcloud.com/flaneur23/sound-design-signature-mix-001" title="Sound Design Signature Mix - 001" target="_blank">Sound Design Signature Mix - 001</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Header;

