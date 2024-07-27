import { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import api from '../util/api';
import { UserContext } from './UserContext';

export default function useUser() {
  let history = useHistory();
  const { user, setUser } = useContext(UserContext);

  const createUser = async function (data) {
      try {
        await api.post('/user', data);
      } catch(err) {
        const error = err.response ? err.response.data.message : err.message;
        if (error.includes())
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
  updateUser
  }
}