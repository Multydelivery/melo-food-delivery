import React from 'react';
import './Footer.css';
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Footer = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  // Function to handle logo click and redirect to home
  const handleLogoClick = () => {
    navigate('/'); // Redirect to the home page
    window.scrollTo(0, 0); // Scroll to the top of the page
  };

  return (
    <div className='footer' id='footer'>
      <div className="footer-content">
        <div className="footer-content-left">
          {/* Add onClick handler to the logo */}
          <img
            className='footer-logo'
            src={assets.meloantojos}
            alt=""
            onClick={handleLogoClick} // Redirect on click
            style={{ cursor: 'pointer' }} // Add pointer cursor for better UX
          />
          <p>
            At MeloMarket, we are proud to have been committed to delivering fast and efficient service for over five years, ensuring that your orders arrive on the same day. With our 20-minute delivery guarantee, we promise to bring your purchases right to your doorstep swiftly and reliably. Experience the ultimate convenience of speedy delivery when you shop with us—because we do everything with passion and no doubt!
          </p>
          <div className="footer-social-icons">
            <img src={assets.facebook_icon} alt="" />
            <img src={assets.twitter_icon} alt="" />
            <img src={assets.linkedin_icon} alt="" />
            <img src={assets.instagram_icon} alt="" />
          </div>
        </div>
        <div className="footer-content-center">
          <h2>COMPANY</h2>
          <ul>
            <li onClick={() => { navigate('/'); window.scrollTo(0, 0); }}>Home</li>
            <li onClick={() => { navigate('/about'); window.scrollTo(0, 0); }}>About us</li>
            <li onClick={() => { navigate('/delivery'); window.scrollTo(0, 0); }}>Delivery</li>
            <li onClick={() => { navigate('/privacy-policy'); window.scrollTo(0, 0); }}>Privacy policy</li>
          </ul>
        </div>
        <div className="footer-content-right">
          <h2>GET IN TOUCH</h2>
          <ul>
            {/* <li>+1-813-532-9032</li> */}
            <li>delivery@melomarket.com.co</li>
            <li>Copyright 2024 © Melomarket.com.co - All Right Reserved.</li>
          </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">Copyright 2024 © Tomato.com - All Right Reserved.</p>
    </div>
  );
};

export default Footer;
