import { toast } from 'react-toastify';
import API from './api';

const AddRole = async (token, data) => {
  if (!token || !data) return;
  try {
    const res = await API.post(`/auth/create-new-account`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (error) {
    console.log('error while adding role', error);
    throw error;
  }
};

const getSalesPerson = (token) => {
  return API.get(`/auth/Sales Person`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const getInventoryManager = (token) => {
  return API.get(`/auth/Inventory Manager`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const getWarehouseManager = (token) => {
  return API.get(`/auth/Warehouse Manager`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const getAccountSection = (token) => {
  return API.get(`/auth/Account Section`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const getProductionManager = (token) => {
  return API.get(`/auth/Packing Reporter`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const getAdministrator = (token) => {
  return API.get(`/auth/Administrator`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const getRoleByID = async (token, id) => {
  try {
    if (!token && !id) {
      return new Error('Error not valid token or id ');
    }
    const res = await API.get(`auth/${id}/get-user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    toast.error(error?.response?.data?.message || 'Error Updating role');
  }
};

const updateRoleByID = async (token, id, data) => {
  try {
    if (!token && !id && !data) {
      return new Error('Error not valid token or id or data');
    }
    const res = await API.put(`auth/${id}/update`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    console.log("errr of back",error);
    
    throw error;
  }
};

const deleteRoleByID = async (token, id) => {
  try {
    if (!token && !id) {
      return new Error('Error not valid token or id');
    }
    const res = await API.delete(`auth/${id}/action`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    toast.error(error?.response?.data?.message || 'Error deleting role');
  }
};

export default {
  AddRole,
  getSalesPerson,
  getInventoryManager,
  getWarehouseManager,
  getProductionManager,
  getAccountSection,
  getAdministrator,
  updateRoleByID,
  getRoleByID,
  deleteRoleByID,
};
