import React, { useContext, useState } from 'react';
import './LoginPopup.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../Context/StoreContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash, FaTimes } from 'react-icons/fa';

const LoginPopup = ({ setShowLogin }) => {
    const { setToken, url, loadCartData } = useContext(StoreContext);
    const [currState, setCurrState] = useState("Login");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});

    const [data, setData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const validateForm = () => {
        const newErrors = {};
        
        if (!data.email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(data.email)) {
            newErrors.email = "Email is invalid";
        }
        
        if (!data.password) {
            newErrors.password = "Password is required";
        } else if (data.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }
        
        if (currState === "Sign Up" && !data.name.trim()) {
            newErrors.name = "Name is required";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setData(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const onLogin = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        
        try {
            const endpoint = currState === "Login" ? "/api/user/login" : "/api/user/register";
            const response = await axios.post(`${url}${endpoint}`, data);
            
            if (response.data.success) {
                setToken(response.data.token);
                localStorage.setItem("token", response.data.token);
                await loadCartData({ token: response.data.token });
                setShowLogin(false);
                toast.success(`Welcome ${data.name || "back"}!`);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleStateChange = (newState) => {
        setCurrState(newState);
        setErrors({});
    };

    return (
        <div className='login-popup-overlay'>
            <div className='login-popup'>
                <form onSubmit={onLogin} className="login-popup-container">
                    <div className="login-popup-title">
                        <h2>{currState}</h2>
                        <button 
                            type="button" 
                            className="close-button" 
                            onClick={() => setShowLogin(false)}
                            aria-label="Close login popup"
                        >
                            <FaTimes />
                        </button>
                    </div>
                    
                    <div className="login-popup-inputs">
                        {currState === "Sign Up" && (
                            <div className="input-group">
                                <input
                                    name='name'
                                    onChange={onChangeHandler}
                                    value={data.name}
                                    type="text"
                                    placeholder='Your name'
                                    className={errors.name ? 'error' : ''}
                                />
                                {errors.name && <span className="error-message">{errors.name}</span>}
                            </div>
                        )}
                        
                        <div className="input-group">
                            <input
                                name='email'
                                onChange={onChangeHandler}
                                value={data.email}
                                type="email"
                                placeholder='Your email'
                                className={errors.email ? 'error' : ''}
                            />
                            {errors.email && <span className="error-message">{errors.email}</span>}
                        </div>
                        
                        <div className="input-group">
                            <div className="password-input-wrapper">
                                <input
                                    name='password'
                                    onChange={onChangeHandler}
                                    value={data.password}
                                    type={showPassword ? "text" : "password"}
                                    placeholder='Password'
                                    className={errors.password ? 'error' : ''}
                                />
                                <button
                                    type="button"
                                    className="toggle-password"
                                    onClick={togglePasswordVisibility}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            {errors.password && <span className="error-message">{errors.password}</span>}
                        </div>
                    </div>
                    
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? (
                            <span className="loading-spinner"></span>
                        ) : (
                            currState === "Login" ? "Login" : "Create account"
                        )}
                    </button>
                    
                    <div className="login-popup-condition">
                        <input type="checkbox" id="terms" required />
                        <label htmlFor="terms">
                            By continuing, I agree to the <a href="/terms">terms of use</a> & <a href="/privacy">privacy policy</a>.
                        </label>
                    </div>
                    
                    <div className="login-popup-toggle">
                        {currState === "Login" ? (
                            <p>Don't have an account? <span onClick={() => handleStateChange('Sign Up')}>Sign up</span></p>
                        ) : (
                            <p>Already have an account? <span onClick={() => handleStateChange('Login')}>Login</span></p>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPopup;
