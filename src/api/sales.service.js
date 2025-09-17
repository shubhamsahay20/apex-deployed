import API from './api';

const AuthToken = (token) => {
  return { Authorization: `Bearer ${token}` };
};

const getSalesOrder = async (token) => {
  try {
    if (!token) {
      throw new Error('Authorization token is not valid');
    }
    const res = await API.get(`/sale-order/`, {
      headers: AuthToken(token),
    });
    return res.data;
  } catch (error) {
    throw new Error('Error while getSalesOrder');
  }
};

const getAllSalesOrder = async (token, page, limit, searchQuery = '') => {
  try {
    if (!token) {
      throw new Error('Authorization token is not valid');
    }
    const res = await API.get(
      `/sale-order/getallOrders?page=${page}&limit=${limit}&search=${searchQuery}`,
      {
        headers: AuthToken(token),
      },
    );
    return res.data;
  } catch (error) {
    throw new Error('Error while getSalesOrder');
  }
};

const getSalesOrderByID = async (token, id) => {
  try {
    if (!token) {
      throw new Error('Authorization token is not valid');
    }
    const res = await API.get(`/sale-order/${id}`, {
      headers: AuthToken(token),
    });
    return res.data;
  } catch (error) {
    throw new Error('Error while getSalesOrder');
  }
};

const getAllArtical = async (token, page, limit, searchQuery) => {
  try {
    if (!token) {
      throw new Error('Authorization token is not valid');
    }
    const res = await API.get(
      `/sale-order/totalStock?page=${page}&limit=${limit}&search=${searchQuery}`,
      {
        headers: AuthToken(token),
      },
    );
    return res.data;
  } catch (error) {
    throw new Error('Error while getSalesOrder');
  }
};

const deleteWishlist = async (token, id) => {
  try {
    if (!token) {
      throw new Error('Authorization token is not valid');
    }
    const res = await API.delete(`/sale-order/wishlist/${id}`, {
      headers: AuthToken(token),
    });
    return res.data;
  } catch (error) {
    throw new Error('Error while getSalesOrder');
  }
};

export default {
  getSalesOrder,
  getSalesOrderByID,
  getAllSalesOrder,
  getAllArtical,
  deleteWishlist,
};
