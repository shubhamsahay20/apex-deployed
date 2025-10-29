import API from './api';

const getLogs = async (token,page,limit,searchQuery='') => {
  try {
    const res = await API.get(`/log?page=${page}&limit=${limit}&search=${searchQuery}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    throw error
  }
};

export default {
  getLogs,
};
