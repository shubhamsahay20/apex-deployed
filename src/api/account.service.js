import API from './api';

const addNotes = async (token, id, data) => {
  try {
    if (!token) {
      throw new Error('Authorization token is no valid');
    }

    const res = await API.put(`/account/addNote/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message);
  }
};

export default {
  addNotes,
};
