import { useContext } from 'react';
import api from '../util/api';
import { UserContext } from './UserContext';

export default function useAuth() {
  const { _, setUser } = useContext(UserContext);

  const loginUser = async function (data) {
    const { username, password } = data;

    try {
      const res = await api.post('/auth/login', { username, password});
      const { user } = res.data;
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
    } catch(err) {
      const error = err.response ? err.response.data.message : err.message; // Use client error if no response
      throw new Error(error); 
    }
  };

  const logoutUser = async function () {
    try {
      await api.get('/auth/logout');
      localStorage.removeItem('user');
      setUser(null);
    } catch(err) {
      const error = err.response ? err.response.data.message : err.message;
      throw new Error(error);
    }
  }

  return {
    loginUser,
    logoutUser
  }
}