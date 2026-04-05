import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OAuth2Callback = () => {
    const navigate = useNavigate();
    const { setToken } = useAuth();

    useEffect(() => {
        // Extract token from URL search params
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');

        if (token) {
            // Save token to localStorage
            localStorage.setItem('token', token);
            
            // Update AuthContext state
            setToken(token);

            // Redirect to dashboard
            navigate('/dashboard');
        } else {
            console.error('No token found in OAuth2 callback URL');
            navigate('/login');
        }
    }, [navigate, setToken]);

    return (
        <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center font-sans">
             <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
                <h2 className="text-xl font-bold text-white tracking-tight">Authenticating with Google...</h2>
                <p className="text-zinc-500 text-sm">Please wait while we set up your session.</p>
             </div>
        </div>
    );
};

export default OAuth2Callback;
