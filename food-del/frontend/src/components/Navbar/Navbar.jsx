import React, { useContext, useEffect, useState } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../Context/StoreContext';
import { FaShoppingCart, FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("home");
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { getTotalCartAmount, token, setToken } = useContext(StoreContext);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate('/');
    setMobileMenuOpen(false);
  };

  const handleLogoClick = () => {
    navigate('/');
    window.scrollTo(0, 0);
    setMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to='/' onClick={handleLogoClick}>
          <img className='logo' src={assets.meloantojos} alt="Melo Antojos Logo" />
        </Link>

        <div className="hamburger" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </div>

        <ul className={`navbar-menu ${mobileMenuOpen ? 'active' : ''}`}>
          <li>
            <Link 
              to="/" 
              onClick={() => { setMenu("home"); closeMobileMenu(); }} 
              className={`${menu === "home" ? "active" : ""}`}
            >
              HOME
            </Link>
          </li>
          <li>
            <a 
              href='#explore-menu' 
              onClick={() => { setMenu("menu"); closeMobileMenu(); }} 
              className={`${menu === "menu" ? "active" : ""}`}
            >
              MENU
            </a>
          </li>
          <li>
            <a 
              href='#app-download' 
              onClick={() => { setMenu("mob-app"); closeMobileMenu(); }} 
              className={`${menu === "mob-app" ? "active" : ""}`}
            >
              MOBILE APP
            </a>
          </li>
          <li>
            <a 
              href='#footer' 
              onClick={() => { setMenu("contact"); closeMobileMenu(); }} 
              className={`${menu === "contact" ? "active" : ""}`}
            >
              CONTACT US
            </a>
          </li>
        </ul>

        <div className="navbar-right">
          <Link to='/cart' className='navbar-search-icon' onClick={closeMobileMenu}>
            <FaShoppingCart size={20} />
            {getTotalCartAmount() > 0 && <div className="dot"></div>}
            <span className="cart-text">Cart</span>
          </Link>
          
          {!token ? (
            <button 
              onClick={() => { 
                setShowLogin(true); 
                closeMobileMenu(); 
              }} 
              className="sign-in-btn"
            >
              Sign In
            </button>
          ) : (
            <div className='navbar-profile'>
              <FaUserCircle size={30} />
              <ul className='navbar-profile-dropdown'>
                <li onClick={() => { navigate('/myorders'); closeMobileMenu(); }}>
                  <img src={assets.bag_icon} alt="" />
                  <p>My Orders</p>
                </li>
                <hr />
                <li onClick={logout}>
                  <img src={assets.logout_icon} alt="" />
                  <p>Logout</p>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
