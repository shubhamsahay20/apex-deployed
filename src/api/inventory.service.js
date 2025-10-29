import API from './api';

const addNotes = async (token, id, data) => {
  try {
    if (!token) {
      throw new Error('Authorization token is no valid');
    }

    const res = await API.put(`/inventory/${id}/approve`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};

const updateDeliveryStatus = async (token, id, data) => {
  try {
    if (!token) {
      throw new Error('Authorization token is no valid');
    }

    const res = await API.put(`/stock/delivery/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message);
  }
};

const getStockInInventory = async (token, page, limit) => {
  try {
    if (!token) {
      throw new Error('Authorization Token Require');
    }
    const res = await API.get(
      `/inventory/getallStock2?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return res.data;
  } catch (error) {
    throw error;
  }
};

const approval = async (token, id, data) => {
  try {
    console.log('idd to backend', id);
    if (!token) {
      throw new Error('Authorization token is no valid');
    }

    const res = await API.put(`/inventory/approve/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};

export default {
  addNotes,
  approval,
  getStockInInventory,
  updateDeliveryStatus,
};
