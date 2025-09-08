import API from './api';

const AddQrCode = async (token, data) => {
  try {
    const res = await API.post(`/qr-code/generate`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error(error, 'Error while calling Qr Service');
    throw error; // so caller knows it failed
  }
};

const internalStockTransfer = async (token, data) => {
  try {
    const res = await API.post(`/qr-code/stockTransfer`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error(error, 'Error while calling Qr Service');
    throw error; // so caller knows it failed
  }
};

export default {
  AddQrCode,
  internalStockTransfer
};
