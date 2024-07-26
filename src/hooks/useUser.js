import { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import api from '../util/api';
import { UserContext } from './UserContext';

export default function useAuth() {
  let history = useHistory();
  const { user, setUser } = useContext(UserContext);
  const [error, setError] = useState(null);

  const createUser = async function (data) {
      try {
        await api.post('/user', data);
      } catch(err) {
        setError(err.response.data);
      }
  };

  const readUser = async function (data) {
    try {
      await api.get('/user', data);
    } catch(err) {
      setError(err.response.data);
    }
  };

  const updateUser = async function (data) {
    try {
      await api.put('/user', data);
      history.push('/login');
    } catch(err) {
      setError(err.response.data);
    }
  };

  return {
  createUser,
  readUser,
  updateUser,
  deleteUser,
  error,
  setError
  }
}