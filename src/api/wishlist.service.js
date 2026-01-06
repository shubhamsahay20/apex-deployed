import API from './api';

/* =========================
   ADD WISHLIST
========================= */
const API_URL = import.meta.env.VITE_API_URL;

const addWishlist = (token, payload) => {
  return API.post(`/wishlist/add`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
};


const getAllWishlists = async (token, page, limit, searchQuery = '') => {
  try {
    const res = await API.get(`/wishlist/all?page=${page}&limit=${limit}&search=${searchQuery}`,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error(error, 'Error while calling Qr Service');
    throw error; 
  }
};

/* =========================
   GET WISHLIST BY ID
========================= */
const getWishlistById = (token, id) => {
  return API.get(`/wishlist/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

/* =========================
   UPDATE WISHLIST
========================= */
const UpdateWishlistById = (token, id, data) => {
  return API.put(`/wishlist/${id}/update-wishlist`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

/* =========================
   DELETE WISHLIST
========================= */
const DeleteWishlist = async (token, id) => {
  if (!token) {
    throw new Error('Authorization failed');
  }

  try {
    const res = await API.delete(`/wishlist/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    throw new Error('Error while deleting wishlist');
  }
};

export default {
  addWishlist,
  getAllWishlists,
  getWishlistById,
  UpdateWishlistById,
  DeleteWishlist,
};
