import API from './api';

const topSellingStock = async (token, page, limit) => {
  try {
    if (!token) {
      throw new Error('Authorization Token Require');
    }
    const res = await API.get(
      `/report-and-dashbord/top-sales?page=${page}&limit=${limit}`,
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

const lowStock = async (token, page, limit) => {
  try {
    if (!token) {
      throw new Error('Authorization Token Require');
    }
    const res = await API.get(
      `/report-and-dashbord/low-stock?page=${page}&limit=${limit} `,
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

export default {
  topSellingStock,
  lowStock,
};
