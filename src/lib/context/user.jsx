import { createContext, useContext, useEffect, useState } from 'react';
import api from '../../util/api';

const UserContext = createContext(null);

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider({ children }) {
    const [user,setUser] = useState(null);

    async function login({ username, password }) {
    
        try {
          const res = await api.post('/auth/login', { username, password });
          const { user } = res.data;
          setUser(user);
        } catch(err) {
          const error = err.response ? err.response.data.message : err.message; // Use client error if no response
          throw new Error(error); 
        }
    }

    async function logout() {

        try {
          await api.get('/auth/logout');
          setUser(null);
        } catch(err) {
          const error = err.response ? err.response.data.message : err.message;
          throw new Error(error);
        }
    }

    async function init() {
        try {
          const res = await api.get('/auth');
          const { user } = res.data;
          setUser(user);
        } catch(err) {
          setUser(null);
          const error = err.response ? err.response.data.message : err.message;
          throw new Error(error);
        }
    }

    useEffect(() => {
      init();
    },[]);

    return (
      <UserContext.Provider value={{ user, login, logout }}>
        {children}
      </UserContext.Provider>
    )

}