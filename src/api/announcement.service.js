import { toast } from 'react-toastify';
import API from './api';

const getAuthHeaders = (token) => {
  if (!token) {
    throw new Error('Valid authorization token is reuired');
  }

  return { Authorization: `Bearer ${token}` };
};

const addAnnouncement = async (token, data) => {
  try {
    const res = await API.post(`/announcement/create`, data, {
      headers: getAuthHeaders(token),
    });
    return res;
  } catch (error) {
    throw error;
  }
};

const getAnnouncement = async (token, page, limit, searchQueary = '') => {
  try {
    const res = await API.get(
      `/announcement/get?page=${page}&limit=${limit}&search=${searchQueary}`,
      {
        headers: getAuthHeaders(token),
      },
    );

    return res.data;
  } catch (error) {
    toast.error(error.response?.data.message || 'Error');
    throw error;
  }
};

const getAnnouncementById = async (token, id) => {
  if (!token) {
    throw new Error('Authorization Token Required ');
  }

  try {
    const res = await API.get(`/announcement/${id}`, {
      headers: getAuthHeaders(token),
    });

    return res.data;
  } catch (error) {
    toast.error(error.response?.data.message || 'Error');
    throw error;
  }
};

const updateAnnouncementById = async (token, id, data) => {
  try {
    const res = await API.put(`/announcement/${id}/update`, data, {
      headers: getAuthHeaders(token),
    });

    return res.data;
  } catch (error) {
    toast.error(error.response?.data.message || 'Error');
    throw error;
  }
};

const deleteAnnouncement = async (token, id) => {
  try {
    const res = await API.delete(`/announcement/${id}`, {
      headers: getAuthHeaders(token),
    });

    return res.data;
  } catch (error) {
    toast.error(error.response?.data.message || 'Error');
    throw error;
  }
};

export default {
  addAnnouncement,
  getAnnouncement,
  getAnnouncementById,
  updateAnnouncementById,
  deleteAnnouncement,
};
