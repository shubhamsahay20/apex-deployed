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

const getStockByWarehouse = async (token, id,page,limit) => {
  try {
    const res = await API.get(`/stock/warehouse/${id}?page=${page}&limit=${limit}`, {
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

const getStockByPn = async (token,page,limit,searchQueary='') => {
  try {
    const res = await API.get(`/stock/get?page=${page}&limit=${limit}&search=${searchQueary}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    throw new Error('Error while geting qr scan');
  }
};

const getInternalStock = async (token, page, limit, searchQueary = '') => {
  try {
    const res = await API.get(
      `/qr-code/stock-Transfer?page=${page}&limit=${limit}&search=${searchQueary}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return res.data;
  } catch (error) {
    throw new Error('Error while geting qr scan');
  }
};

const MarkWarehouseScanned = async (token, warehouseid, data) => {
  try {
    const res = await API.put(`/stock/scanned/${warehouseid}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res;
  } catch (error) {
    throw error
  }
};

export default {
  addStockQrScan,
  getStockByWarehouse,
  dispatchStockQrScan,
  getAllStock,
  getInternalStock,
  MarkWarehouseScanned,
  getStockByPn
};
