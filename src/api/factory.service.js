import API from './api';

const AddFactory = (token, data) => {
  return API.post(`/factory/add`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const getAllFactories = (token, page, limit ,searchQuery ='') => {
  return API.get(`/factory/get-all-factories?page=${page}&limit=${limit}&search=${searchQuery}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const getFactoryById = (token, id) => {
  return API.get(`/factory/${id}/get-factory`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const EditFactoryById = (token, id, data) => {
  return API.put(`/factory/${id}/update-factory`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const DeleteFactory = async (token, id) => {
  if (!token) {
    throw new Error('Authorization failed');
  }

  try {
    const res = API.delete(`/factory/${id}/delete-factory`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    throw new Error('Error while deleting factory');
  }
};

export default {
  AddFactory,
  EditFactoryById,
  getAllFactories,
  getFactoryById,
  DeleteFactory,
};
