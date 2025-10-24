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

// const addCategory = (token, data) =>
//   API.post('/product/category', data, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });

const addCategoryForMultipleArticle = async (token, data) => {
  if (!token) throw new Error('Token is Not Valid');

  try {
    const res = await API.post(`/product/addArticle`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.log('error while sending response', error);
    throw error;
  }
};

const getCategories = async (token, page = 1, limit = 10, searchQuery = '') => {
  try {
    const res = await API.get(
      `/product?page=${page}&limit=${limit}&search=${searchQuery}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return res;
  } catch (error) {
    console.log('error while geting article data', error);
    throw error;
  }
};

const editCategory = async (token, id, data) => {
  if (!token || !id) return;
  try {
    const res = await API.put(`/product/${id}/update`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res;
  } catch (error) {
    console.log('error while editing article', error);
    throw error;
  }
};

const editArticleCode = async (token, id, data) => {
  if (!token || !id) return;
  try {
    const res = await API.put(`/product/${id}/articlecode`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (error) {
    console.log('error  to edit article', error);
    throw error;
  }
};

const getCategoryById = async (token, id) => {
  if (!token || !id) return;
  try {
    const res = await API.get(`/product/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res;
  } catch (error) {
    console.log('error to get article details', error);
    throw error;
  }
};

const getCategoryByIdForSingle = async (token, id) => {
  if (!token || !id) return;
  try {
    const res = await API.get(`/product/getone/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (error) {
    console.log('error to get single id', error);
    throw error;
  }
};

const DeleteCategory = (id, token) => {
  return API.delete(`/product/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const DeleteArticleCode = (id, token) => {
  return API.delete(`/product/deletecode/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const UploadCsv = async (token, data) => {
  if (!token || !data) return;
  try {
    const res = await API.post('/product/upload-csv', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (error) {
    console.log('error to upload csv file', error);
    throw error;
  }
};

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
    throw error;
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

const getCustomersBySalesPerson = async (
  token,
  page,
  limit,
  searchQuery = '',
) => {
  try {
    const res = await API.get(
      `/customer/get/bysalesperson?page=${page}&limit=${limit}&search=${searchQuery}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return res;
  } catch (error) {
    console.log('error to get customer by sales person', error);

    throw error;
  }
};

const getAllCustomersWithoutPagination = (token) => {
  try {
    return API.get(`/customer/get`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    throw error;
  }
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
    throw error;
  }
};

const EditCustomer = async (token, id, data) => {
  if (!token || !id) return;
  try {
    const res = await API.put(`/customer/${id}/update`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (error) {
    console.log('error to edity customer ', error);
    throw error;
  }
};

const getCustomerById = async (token, id) => {
  try {
    const res = await API.get(`/sale-order/customerOrderHistory/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (error) {
    console.log('error while geting customer', error);
    throw error;
  }
};

const DeleteCustomer = async (token, id) => {
  if (!token || !id) return;
  try {
    const res = await API.delete(`/customer/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (error) {
    console.log('error deleting customer ', error);
    throw error;
  }
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
    console.log('error in opt validation', error);

    throw error;
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
    throw error;
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
    return res.data;
  } catch (error) {
    throw new Error('Error while geting profile');
  }
};

const editProfile = async (token, id, data) => {
  try {
    const res = await API.put(`/auth/${id}/update`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.log(error?.response?.data?.message);
  }
};

const logout = () => localStorage.removeItem('user');

export default {
  register,
  editProfile,
  login,
  verifyOtp,
  logout,
  getCategories,
  // addCategory,
  addCategoryForMultipleArticle,
  editCategory,
  editArticleCode,
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
  getProfile,
  getCustomersBySalesPerson,
  DeleteArticleCode,
  getCategoryByIdForSingle,
};
