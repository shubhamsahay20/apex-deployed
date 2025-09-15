import API from './api';

const topSellingStock = async (token) => {
  try {
    if (!token) {
      throw new Error('Authorization Token Require');
    }
    const res = await API.get(`/report-and-dashbord/top-sales`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    throw new Error('Error while geting order');
  }
};

const lowStock = async (token) => {
  try {
    if (!token) {
      throw new Error('Authorization Token Require');
    }
    const res = await API.get(`/report-and-dashbord/low-stock `, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    throw new Error('Error while geting order');
  }
};


export default {
  topSellingStock,
  lowStock
};
