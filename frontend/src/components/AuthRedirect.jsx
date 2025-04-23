import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AuthRedirect() {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading) {
            if (user) {
                // Redirect based on user role
                if (user.role === 'teacher') {
                    navigate('/teacher-dashboard');
                } else {
                    navigate('/dashboard');
                }
            } else {
                navigate('/landing');
            }
        }
    }, [user, loading, navigate]);

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
    );
}

export default AuthRedirect; 