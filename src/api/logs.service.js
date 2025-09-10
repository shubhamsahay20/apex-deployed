import API from './api';

const getLogs = async (token,page,limit) => {
  try {
    const res = await API.get(`/log?page=${page}&limit=${limit}`, {
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
  getLogs,
};
