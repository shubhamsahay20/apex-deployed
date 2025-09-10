import API from './api';

const getToken = (token) => {
  try {
    if (!token) {
      throw new Error('Authorization token require');
    }

    return { Authorization: `Bearer ${token}` };
  } catch (error) {
    throw new Error(' Authorization Token is Required');
  }
};

const addSchemes = async (token,data) => {
  try {
    const res = await API.post(`/schemes/create`,data ,{
      headers: getToken(token),
    });

    return res.data;
  } catch (error) {
    throw new Error('Error while geting order');
  }
};

const getAllSchemes = async (token,page,limit) => {
  try {
    const res = await API.get(`/schemes/?page=${page}&limit=${limit}`, {
      headers: getToken(token),
    });

    return res.data;
  } catch (error) {
    throw new Error('Error while geting order');
  }
};

const getSchemeById = async (token, id) => {
  try {
    const res = await API.get(`/schemes/${id}`, {
      headers: getToken(token),
    });

    return res.data;
  } catch (error) {
    throw new Error('Error while geting order');
  }
};



const EditSchemeById = async (token,id,data) => {
  try {
    const res = await API.put(`/schemes/${id}`,data, {
      headers: getToken(token),
    });

    return res.data;
  } catch (error) {
    throw new Error('Error while geting order');
  }
};


const DeleteSchemeById = async (token,id) => {
  try {
    const res = await API.delete(`/schemes/delete/${id}`,{
      headers: getToken(token),
    });

    return res.data;
  } catch (error) {
    throw new Error('Error while geting order');
  }
};



export default {
  addSchemes,
  getAllSchemes,
  getSchemeById,
  EditSchemeById,
  DeleteSchemeById
};
