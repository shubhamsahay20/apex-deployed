import API from './api';

const addWarehouse = (token, data) => {
  return API.post(`/warehouses/add`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const EditWarehouse = (token, id, data) => {
  return API.put(`/warehouses/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const getAllWarehouse = (token, page, limit, searchQuery='') => {
  return API.get(`warehouses/?page=${page}&limit=${limit}&search=${searchQuery}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const getWarehouseById = async (token, id) => {
  try {
    if (!token) {
      throw new Error('Authorization token is not valid');
    }
    const res = await API.get(`warehouses/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    throw new Error('Error while geting Details');
  }
};

const DeleteWarehouse = (token, id) => {
  return API.delete(`/warehouses/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export default {
  addWarehouse,
  EditWarehouse,
  getAllWarehouse,
  getWarehouseById,
  DeleteWarehouse,
};
