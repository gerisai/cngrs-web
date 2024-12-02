import api from '../util/api';

export default function usePeople() {

  const createPerson = async function (data) {
      try {
        await api.post('/people', data);
      } catch(err) {
        const error = err.response ? err.response.data.message : err.message;
        throw new Error(error);
      }
  };

  const bulkCreatePeople = async function (data,sendMail) {
    try {
      const res = await api.post(`/people/bulkcreate?sendMail=${sendMail}`, data);
      return res.data.message;
    } catch(err) {
      const error = err.response ? err.response.data.message : err.message;
      throw new Error(error);
    }
  };

  const readPerson = async function (personId) {
    try {
      const res = await api.get(`/people/${personId}`);
      const readPerson = res.data.person;
      return readPerson;
    } catch(err) {
      const error = err.response ? err.response.data.message : err.message;
      throw new Error(error);
    }
  };

  const readPeople = async function (query) {
    try {
      const res = await api.get('/people', { 
        params: query
      });
      const people = res.data.people;
      return people;
    } catch(err) {
      const error = err.response ? err.response.data.message : err.message;
      throw new Error(error);
    }
  };

  const readPeopleNames = async function () {
    try {
      const res = await api.get('/people/allnames');
      const peopleNames = res.data.peopleNames;
      return peopleNames;
    } catch(err) {
      const error = err.response ? err.response.data.message : err.message;
      throw new Error(error);
    }
  };

  const updatePerson = async function (data) {
    try {
      await api.put('/people', data);
    } catch(err) {
      const error = err.response ? err.response.data.message : err.message;
      throw new Error(error);
    }
  };

  const deletePerson = async function (personId) {
    try {
      await api.delete(`/people/${personId}`);
    } catch(err) {
      const error = err.response ? err.response.data.message : err.message;
      throw new Error(error);
    }
  };

  const getPeopleCategory = async function (name) {
    try {
      const res = await api.get("/people/category", { 
        params: {
          name
        }
      });
      const { category } = res.data;
      return category;
    } catch(err) {
      const error = err.response ? err.response.data.message : err.message;
      throw new Error(error);
    }
  };

  return {
  createPerson,
  bulkCreatePeople,
  readPerson,
  readPeople,
  readPeopleNames,
  updatePerson,
  deletePerson,
  getPeopleCategory
  }
}
