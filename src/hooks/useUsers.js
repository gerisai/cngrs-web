import api from '../util/api';

export default function useUsers() {

  const createUser = async function (data) {
      try {
        await api.post('/users', data);
      } catch(err) {
        const error = err.response ? err.response.data.message : err.message;
        throw new Error(error);
      }
  };

  const bulkCreateUsers = async function (data,sendMail) {
    try {
      const res = await api.post(`/users/bulkcreate?sendMail=${sendMail}`, data);
      return res.data.message;
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
      await api.put('/users', data);
    } catch(err) {
      const error = err.response ? err.response.data.message : err.message;
      throw new Error(error);
    }
  };

  const deleteUser = async function (username) {
    try {
      await api.delete(`/users/${username}`);
    } catch(err) {
      const error = err.response ? err.response.data.message : err.message;
      throw new Error(error);
    }
  };

  const uploadAvatar = async function (username,data) {
    try {
      await api.post(`/users/${username}`, data);
    } catch(err) {
      const error = err.response ? err.response.data.message : err.message;
      throw new Error(error);
    }
  };

  return {
  createUser,
  bulkCreateUsers,
  readUser,
  readUsers,
  updateUser,
  deleteUser,
  uploadAvatar
  }
}