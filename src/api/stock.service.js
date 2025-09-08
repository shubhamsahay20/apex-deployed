import API from './api';

const addStockQrScan = async (token, data) => {
  try {
    const res = await API.post(`/stock/add`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res;
  } catch (error) {
    throw new Error('Error while geting qr scan');
  }
};

const dispatchStockQrScan = async (token, data) => {
  try {
    const res = await API.post(`/stock/scan-qr`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res;
  } catch (error) {
    throw new Error('Error while geting qr scan');
  }
};

const getStockByWarehouse = async (token, id) => {
  try {
    const res = await API.get(`/stock/warehouse/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    throw new Error('Error while geting qr scan');
  }
};

const getAllStock = async (token) => {
  try {
    const res = await API.get(`/stock/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    throw new Error('Error while geting qr scan');
  }
};
export default {
  addStockQrScan,
  getStockByWarehouse,
  dispatchStockQrScan,
  getAllStock
};
