import { useContext } from 'react';
import api from '../util/api';
import { UserContext } from './UserContext';

export default function useAuth() {
  const { setUser, setAuthLoading } = useContext(UserContext);

  const loginUser = async function (data) {
    const { username, password } = data;
    setAuthLoading(true);

    try {
      const res = await api.post('/auth/login', { username, password});
      const { user } = res.data;
      setUser(user);
      setAuthLoading(false);
    } catch(err) {
      const error = err.response ? err.response.data.message : err.message; // Use client error if no response
      setAuthLoading(false);
      throw new Error(error); 
    }
  };

  const getAuthUser = async function () {
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
  };

  const logoutUser = async function () {
    setAuthLoading(true);
    try {
      await api.get('/auth/logout');
      setUser(null);
      setAuthLoading(false);
    } catch(err) {
      const error = err.response ? err.response.data.message : err.message;
      setAuthLoading(false);
      throw new Error(error);
    }
  }

  return {
    loginUser,
    logoutUser,
    getAuthUser
  }
}