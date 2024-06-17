import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuth, setIsAuth] = useState(false);
    const [role, setRole] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const token = Cookies.get('access_token');
    const [user, setUser] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const REACT_APP_BASE_URL = import.meta.env.VITE_APP_BASE_URL;
    useEffect(() => {
        const isLogin = localStorage.getItem('isAuth'); 
        const user_role = localStorage.getItem('role');
        const storedUser = localStorage.getItem('user');
        const storedUserInfo = localStorage.getItem('userInfo');

        if (isLogin) {
            setIsAuth(true);
        }
        if (user_role) {
            setRole(user_role);
        }
        if (storedUser) {
            setUser(storedUser);
        }
        if (storedUserInfo) {
            setUserInfo(JSON.parse(storedUserInfo));
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
        console.log('Role:', user_role);
    };

    const login = async (email, password) => {
        try {
            const response = await fetch(`${REACT_APP_BASE_URL}/api/auth/login`, {
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
            
            localStorage.setItem('user', data.user._id);
            localStorage.setItem('userInfo', JSON.stringify(data.user));
            setUser(data.user._id);
            setUserInfo(data.user);

            Cookies.set('access_token', data.token, { expires: 1 });
            setAdminStatus(data.token);
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const register = async (formData) => {
        try {
            const response = await fetch(`${REACT_APP_BASE_URL}/api/auth/register`, {
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

        } catch (error) {
            throw new Error('An unexpected error occurred');
        }
    };

    const logout = async() => {
        try {
            const response = await fetch(`${REACT_APP_BASE_URL}/api/auth/logout`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Logout failed');
            }
            
            setIsAuth(false);
            setRole('');
            setUser(null);
            setUserInfo(null);

            localStorage.removeItem('isAuth');
            localStorage.removeItem('role');
            localStorage.removeItem('user');
            localStorage.removeItem('userInfo');

            Cookies.remove('access_token');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ token, isAuth, isLoading, role, login, register, logout, user, userInfo }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
