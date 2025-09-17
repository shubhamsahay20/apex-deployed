// auth.service.js
import API from './api';

const register = ({ name, email, password, role, phone }) =>
  API.post('/auth/register', { name, email, password, role, phone });

const login = async ({ email, password, isdoubleVerifiedchecked }) =>
  API.post('/auth/login', { email, password, isdoubleVerifiedchecked }).then(
    (res) => {
      if (res.data.accessToken) {
        localStorage.setItem('user', JSON.stringify(res.data));
      }
      return res.data;
    },
  );

const verifyOtp = ({ phone, otp }) =>
  API.post('/auth/login-with-otp', { phone, otp }).then((res) => {
    console.log('user', res.data.user);
    if (res.data.accessToken) {
      localStorage.setItem(
        'user',
        JSON.stringify({
          accessToken: res.data.accessToken,
          user: res.data.user,
        }),
      );
    }
    return res.data;
  });

const addCategory = (token, data) =>
  API.post('/product/category', data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

const getCategories = (token, page = 1, limit = 10) =>
  API.get(`/product?page=${page}&limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

const editCategory = (token, id, data) =>
  API.put(`/product/${id}/update`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

const getCategoryById = (token, id) => {
  return API.get(`/product/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const DeleteCategory = (id, token) => {
  return API.delete(`/product/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const UploadCsv = (token, data) =>
  API.post('/product/upload-csv', data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

const addArticleCode = async (token, data) => {
  try {
    const res = await API.post('/product/addcode', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.log('error', error.response.data.message);
  }
};

const getUsers = (token) => {
  return API.get('/customer/get-users?personRole=Sales%20Person', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const getAllCustomers = (token, page, limit, searchQuery = '') => {
  return API.get(
    `/customer/get?page=${page}&limit=${limit}&search=${searchQuery}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

const getAllCustomersWithoutPagination = (token) => {
  return API.get(`/customer/get`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
const addCustomer = async (token, data) => {
  try {
    if (!token) {
      throw new Error('authorization token is required');
    }
    const res = await API.post('/customer/addcustomer', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    throw new Error('Error while adding customer');
  }
};

const EditCustomer = (token, id, data) => {
  return API.put(`/customer/${id}/update`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const getCustomerById = (token, id) => {
  return API.get(`/customer/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const DeleteCustomer = (token, id) => {
  return API.delete(`/customer/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const otpvalidation = async (token, data) => {
  try {
    const res = await API.post(`/auth/send-otp`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res;
  } catch (error) {
    throw new Error('Error while validating otp');
  }
};

const forgetOtp = async (token, data) => {
  try {
    const res = await API.post(`/auth/VerifyOTP`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res;
  } catch (error) {
    throw new Error('Error while validating otp');
  }
};

const newPassword = async (token, data) => {
  try {
    const res = await API.post(`/auth/new-Password`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    throw new Error('Error while validating otp');
  }
};

const getProfile = async (token) => {
  try {
    const res = await API.get(`/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data
  } catch (error) {
    throw new Error("Error while geting profile");
    
  }

};

const logout = () => localStorage.removeItem('user');

export default {
  register,
  login,
  verifyOtp,
  logout,
  getCategories,
  addCategory,
  editCategory,
  getCategoryById,
  DeleteCategory,
  UploadCsv,
  addArticleCode,
  getUsers,
  addCustomer,
  getAllCustomers,
  EditCustomer,
  getCustomerById,
  DeleteCustomer,
  getAllCustomersWithoutPagination,
  otpvalidation,
  forgetOtp,
  newPassword,
  getProfile
};
