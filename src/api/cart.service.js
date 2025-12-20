import axios from 'axios';
import API from './api';

const getAllOrder = async (token) => {
  try {
    if (!token) {
      throw new Error('Authorization Token Require');
    }
    const res = await API.get(`/sale-order/totalCart`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    throw new Error('Error while geting order');
  }
};

const getOrderBySalesPerson = async (token) => {
  try {
    if (!token) {
      throw new Error('Authorization Token Require');
    }
    const res = await API.get(`/sale-order/cart/by-salesperson`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    throw error
  }
};

const salesPersonOrderList = async (token) => {
  try {
    if (!token) {
      throw new Error('Authorization Token Require');
    }
    const res = await API.get(`/sale-order/order/by-salesperson`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    throw error
  }
};

const getAllWishListOrder = async (token, page, limit, searchQuery = '') => {
  try {
    if (!token) {
      throw new Error('Authorization Token Require');
    }
    const res = await API.get(
      `/sale-order/wishlistdata?page=${page}&limit=${limit}&search=${searchQuery}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return res.data;
  } catch (error) {
    throw error
  }
};

const getWishListOrderBySalesPerson = async (
  token,
  page,
  limit,
  searchQuery = '',
) => {
  try {
    if (!token) {
      throw new Error('Authorization Token Require');
    }
    const res = await API.get(
      `/sale-order/wishlist/by-salesperson?page=${page}&limit=${limit}&search=${searchQuery}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return res.data;
  } catch (error) {
    throw error
  }
};
const getAllSalesOrder = async (token, page, limit, searchQuery = '') => {
  try {
    if (!token) {
      throw new Error('Authorization Token Require');
    }
    const res = await API.get(
      `/sale-order/getallOrders?page=${page}&limit=${limit}&search=${searchQuery}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return res.data;
  } catch (error) {
    throw error
  }
};

const createOrder = async (token, data) => {
  try {
    if (!token) {
      throw new Error('Authorization Token Require');
    }
    const res = await API.post(`/sale-order/addtocart`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    throw new Error(
      error.response.data.message || 'Error while creating order',
    );
  }
};

const proceedToOrder = async (token, id) => {
  try {
    if (!token) {
      throw new Error('Authorization Token Required');
    }

    const res = await API.post(
      `/sale-order/checkout/${id}`,
      {}, // body is empty
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return res.data;
  } catch (error) {
    console.error('Checkout API error:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || 'Error while creating order',
    );
  }
};

const DeleteOrder = async (token, id) => {
  try {
    if (!token) {
      throw new Error('Authorization Token Require');
    }
    const res = await API.delete(`/sale-order/cart/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    throw new Error('Error while geting order');
  }
};

const getSalesOrderById = async (token, id) => {
  try {
    if (!token) {
      throw new Error('Authorization Token Require');
    }
    const res = await API.get(`/sale-order/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    throw new Error('Error while geting order');
  }
};
const getTotalCart = async (token) => {
  try {
    if (!token) {
      throw new Error('Authorization Token Required');
    }

    const res = await API.get('/sale-order/totalCart', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    throw new Error('Error while getting total cart');
  }
};


export default {
  createOrder,
  getAllOrder,
  proceedToOrder,
  DeleteOrder,
  getAllSalesOrder,
  getSalesOrderById,
  getAllWishListOrder,
  getOrderBySalesPerson,
  getWishListOrderBySalesPerson,
  salesPersonOrderList,
  getTotalCart,
};
