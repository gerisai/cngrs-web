import api from '../util/api';

export default function useUser() {

  const createUser = async function (data) {
      try {
        await api.post('/users', data);
      } catch(err) {
        const error = err.response ? err.response.data.message : err.message;
        throw new Error(error);
      }
  };

  const readUser = async function (username) {
    try {
      const res = await api.get(`/users/${username}`);
      const readUser = res.data.user;
      return readUser;
    } catch(err) {
      const error = err.response ? err.response.data.message : err.message;
      throw new Error(error);
    }
  };

  const readUsers = async function () {
    try {
      const res = await api.get('/users');
      const users = res.data.users;
      return users;
    } catch(err) {
      const error = err.response ? err.response.data.message : err.message;
      throw new Error(error);
    }
  };

  const updateUser = async function (data) {
    try {
      if (!data.password) delete data.password; // Do not update empty password
      await api.put('/users', data);
    } catch(err) {
      const error = err.response ? err.response.data.message : err.message;
      throw new Error(error);
    }
  };

  const deleteUser = async function (username) {
    try {
      await api.delete(`/users/${username}`); // TODO: Not deleting token since there is no DB for that
    } catch(err) {
      const error = err.response ? err.response.data.message : err.message;
      throw new Error(error);
    }
  };

  return {
  createUser,
  readUser,
  readUsers,
  updateUser,
  deleteUser
  }
}