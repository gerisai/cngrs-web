import { useState, useEffect } from 'react';
import api from '../util/api';

export default function useGetAuthUser() {
    const [user,setUser] = useState(null);
    const [authLoading,setAuthLoading] = useState(null);

    useEffect(() => {
      async function getAuthUser () {
        setAuthLoading(true);
        try {
          const res = await api.get('/auth');
          const { user } = res.data;
          setUser(user);
          setAuthLoading(false);
        } catch(err) {
          const error = err.response ? err.response.data.message : err.message; // Use client error if no response
          setAuthLoading(false);
          throw new Error(error); 
        }
      }
      getAuthUser();
    }, []);
    return {
    user,
    setUser,
    authLoading,
    setAuthLoading
    }
}