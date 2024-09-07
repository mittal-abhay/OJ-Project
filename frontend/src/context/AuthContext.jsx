import React, { createContext, useState, useContext, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const BASE_URL = import.meta.env.VITE_APP_BASE_URL;


    const [isAuth, setIsAuth] = useState(false);
    const [role, setRole] = useState('');
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const token = Cookies.get('access_token');
    
    const getUserInfo = async (token) => {
        try {
            const response = await fetch(`${BASE_URL}/api/auth/me`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`
                }
            });

            if(response.ok) {
                const data = await response.json();
                setIsAuth(true);
                setRole(data.userData.role);
                setUser(data.userData);
                setIsLoading(false); 
            }else{
                setIsAuth(false);
                setRole('');
                setUser(null);
                setIsLoading(false);
            }
        } catch (error) {
            setIsAuth(false);
            setRole('');
            setUser(null);
            setIsLoading(false);
        }
    }


    useEffect(()  => {
        getUserInfo(token);
    }, []);


    const login = async (email, password) => {
        try {
            const response = await fetch(`${BASE_URL}/api/auth/login`, {
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
            Cookies.set('access_token', data.token, { expires: 1 });
            getUserInfo(data.token);
            
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const register = async (formData) => {
        try {
            const response = await fetch(`${BASE_URL}/api/auth/register`, {
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
            const response = await fetch(`${BASE_URL}/api/auth/logout`, {
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
            Cookies.remove('access_token');
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const customFetch = async (path, method, body, query) => {
        try {
            let url = `${BASE_URL}${path}`;
            
            // If it's a GET request and there are query parameters, add them to the URL
            if (method === 'GET' && query) {
                const params = new URLSearchParams(query);
                url += `?${params.toString()}`;
            }
    
            const options = {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`
                }
            };
    
            // Only add body for non-GET requests
            if (method !== 'GET' && body) {
                options.body = JSON.stringify(body);
            }
    
            const response = await fetch(url, options);
    
            if (response.ok) {
                return await response.json();
            }
            if (response.status === 401) {
                logout();
            } else {
                throw await response.json();
            }
        } catch (error) {
            console.error('Fetch error:', error);
            throw error;
        }
    }
    return (
        <AuthContext.Provider value={{  token, isLoading, login, register, logout, getUserInfo, role, isAuth, user, customFetch }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
