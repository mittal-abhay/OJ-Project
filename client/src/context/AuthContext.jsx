import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuth, setIsAuth] = useState(false);
    const [role, setRole] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const token = Cookies.get('access_token');

    useEffect(() => {
        const isLogin = localStorage.getItem('isAuth'); 
        if (isLogin) {
            setIsAuth(true);
        }
        setIsLoading(false);  // Set loading to false after checking auth status
    }, []);

    const decodeToken = (token) => {
        const payload = token.split('.')[1];
        return JSON.parse(atob(payload));
    };

    const setAdminStatus = (token) => {
        const decodedToken = decodeToken(token);
        const user_role = decodedToken.role;
        setRole(user_role);
        localStorage.setItem('role', user_role);
    };

    const login = async (email, password) => {
        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                throw new Error('Invalid email or password');
            }

            const data = await response.json();
            setIsAuth(true);
            localStorage.setItem('isAuth', true);
            Cookies.set('access_token', data.token, { expires: 1 });
            setAdminStatus(data.token);
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const register = async (formData) => {
        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }

            const data = await response.json();
            setIsAuth(true);
            localStorage.setItem('isAuth', true);
            Cookies.set('access_token', data.token, { expires: 1 });
            setAdminStatus(data.token);
        } catch (error) {
            throw new Error('An unexpected error occurred');
        }
    };

    return (
        <AuthContext.Provider value={{ token, isAuth, isLoading, role, login, register }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
