import axios from 'axios';
import React, { useState } from 'react';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';
import './Login.css';

const Login = ({ setToken }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await axios.post(
                backendUrl + '/api/user/admin',
                { email, password },
                { headers: { token: localStorage.getItem('token') } }
            );
            console.log(response.data);
            if (response.data.success) {
                setToken(response.data.token);
                toast.success('Logged in successfully');
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response ? error.response.data.message : error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='min-h-screen flex items-center justify-center w-full'>
            <div className='bg-white shadow-md rounded-lg px-8 py-6 max-w-md'>
                <h1 className='text-2xl font-bold mb-4'>Admin Panel</h1>
                <form onSubmit={onSubmitHandler}>
                    <div className='mb-3 min-w-72'>
                        <label htmlFor='email' className='text-sm font-medium text-gray-700 mb-2'>Email Address</label>
                        <input
                            id='email'
                            type="email"
                            className='rounded-md w-full px-3 py-2 border border-gray-300 outline-none'
                            placeholder='your@email.com'
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className='mb-3 min-w-72'>
                        <label htmlFor='password' className='text-sm font-medium text-gray-700 mb-2'>Password</label>
                        <input
                            id='password'
                            type="password"
                            className='rounded-md w-full px-3 py-2 border border-gray-300 outline-none'
                            placeholder='Enter your password'
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className='mt-2 w-full py-2 px-4 rounded-md text-white bg-black'
                        disabled={isLoading}
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;