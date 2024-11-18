import { createContext, useContext, useEffect, useState } from 'react';
import api from '../../util/api';

const UserContext = createContext(null);

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider({ children }) {
    const [user,setUser] = useState(null);
    const [authLoading,setAuthLoading] = useState(true);
    const [authError,setAuthError] = useState('');

    async function login({ username, password }) {
    
        try {
          const res = await api.post('/auth/login', { username, password });
          const { user, token } = res.data;
          localStorage.setItem('token',token);
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          setUser(user);
        } catch(err) {
          const error = err.response ? err.response.data.message : err.message; // Use client error if no response
          throw new Error(error); 
        }
    }

    async function logout() {
        try {
          await api.get('/auth/logout');
          localStorage.removeItem('token');
          api.defaults.headers.common['Authorization'] = '';
          setUser(null);
        } catch(err) {
          const error = err.response ? err.response.data.message : err.message;
          throw new Error(error);
        }
    }

    async function init() {
      const token = localStorage.getItem('token');
      try {
        if (!token) throw new Error('Unauthorized: No user session token')
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const res = await api.get('/auth');
        const { user } = res.data;
        setUser(user);
      } catch(err) {
        setUser(null);
        const error = err.response ? err.response.data.message : err.message;
        setAuthError(error);
      } finally {
        setAuthLoading(false);
      }
    }

    useEffect(() => {
      init();
    },[]);

    return (
      <UserContext.Provider value={{ user, login, logout, authLoading, authError }}>
        {children}
      </UserContext.Provider>
    )

}