import API from './api';

/* ===================== ADD PRODUCTION ===================== */
const addProduction = async (token, data) => {
  if (!token) return;
  try {
    const res = await API.post(`/production/addProduct`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (error) {
    throw error;
  }
};

/* ===================== GET ALL PRODUCTION ===================== */
const getAllProduction = (token, page, limit, searchQuery = '') => {
  return API.get(
    `/production/?page=${page}&limit=${limit}&search=${searchQuery}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

/* ===================== 🔹 PRODUCTION MANAGER API (NEW) ===================== */
const getProductionManager = (token, page, limit, searchQuery = '') => {
  return API.get(
    `/production/productionmanager?page=${page}&limit=${limit}&search=${searchQuery}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

/* ===================== GET PRODUCTION WITHOUT QR ===================== */
const getProductionWithNoQr = (token, page, limit, searchQuery = '') => {
  return API.get(
    `/production/noqr?page=${page}&limit=${limit}&search=${searchQuery}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

/* ===================== GET PRODUCTION BY ID ===================== */
const getProductionById = (token, id) => {
  return API.get(`/production/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

/* ===================== DELETE PRODUCTION ===================== */
const deleteProduction = (token, id) => {
  return API.delete(`/production/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

/* ===================== QR SCAN ===================== */
const qrScan = async (token, data) => {
  try {
    const res = await API.post(`/production/qrscan`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (error) {
    throw error;
  }
};

/* ===================== BYPASS WITHOUT QR ===================== */
const byPassWithoutQr = async (token, data) => {
  try {
    const res = await API.post(`/stock/bypasstowarehouse`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.log('error is', error.response?.data.error);
    throw error;
  }
};

/* ===================== OUT FOR DELIVERY WITHOUT QR ===================== */
const outOfDeliveryWithoutQr = async (token, data) => {
  try {
    const res = await API.post(`/stock/bypasstodelivery`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    throw new Error('Error while getting qr scan');
  }
};

export default {
  addProduction,
  getAllProduction,
  getProductionManager, // ✅ NEW
  deleteProduction,
  qrScan,
  byPassWithoutQr,
  outOfDeliveryWithoutQr,
  getProductionById,
  getProductionWithNoQr,
};
