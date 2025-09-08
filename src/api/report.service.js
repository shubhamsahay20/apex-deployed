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

const salesReport = async (token) => {
  try {
    const res = await API.get(`/report-and-dashbord/sell-report`, {
      headers: getToken(token),
    });

    return res.data;
  } catch (error) {
    throw new Error('Error while geting order');
  }
};

const salesSummary = async (token) => {
  try {
    const res = await API.get(`/report-and-dashbord/sell-dashboard`, {
      headers: getToken(token),
    });

    return res.data;
  } catch (error) {
    throw new Error('Error while geting order');
  }
};

const productionSummary = async (token) => {
  try {
    const res = await API.get(`/report-and-dashbord/product-dashboard`, {
      headers: getToken(token),
    });

    return res.data;
  } catch (error) {
    throw new Error('Error while geting order');
  }
};

const inventorySummary = async (token) => {
  try {
    const res = await API.get(`/report-and-dashbord/inventory-dashboard`, {
      headers: getToken(token),
    });

    return res.data;
  } catch (error) {
    throw new Error('Error while geting order');
  }
};

const accountSectionSummary = async (token) => {
  try {
    const res = await API.get(`/report-and-dashbord/account-dashboard`, {
      headers: getToken(token),
    });

    return res.data;
  } catch (error) {
    throw new Error('Error while geting order');
  }
};

const customerReport = async (token) => {
  try {
    const res = await API.get(`/report-and-dashbord/customers-report`, {
      headers: getToken(token),
    });

    return res.data;
  } catch (error) {
    throw new Error('Error while geting order');
  }
};

const stockReport = async (token) => {
  try {
    const res = await API.get(`/inventory/getallStock`, {
      headers: getToken(token),
    });

    return res.data;
  } catch (error) {
    throw new Error('Error while geting order');
  }
};

const productionReport = async (token) => {
  try {
    const res = await API.get(`/production/`, {
      headers: getToken(token),
    });

    return res.data;
  } catch (error) {
    throw new Error('Error while geting order');
  }
};

const warehouseReport = async (token) => {
  try {
    const res = await API.get(`/report-and-dashbord/warehouse-report`, {
      headers: getToken(token),
    });

    return res.data;
  } catch (error) {
    throw new Error('Error while geting order');
  }
};

const Chart = async (token) => {
  try {
    const res = await API.get(`/report-and-dashbord/stock-graph`, {
      headers: getToken(token),
    });

    return res.data;
  } catch (error) {
    throw new Error('Error while geting order');
  }
};

const productionChart = async (token) => {
  try {
    const res = await API.get(`/report-and-dashbord/production-graph`, {
      headers: getToken(token),
    });

    return res.data;
  } catch (error) {
    throw new Error('Error while geting order');
  }
};

const adminSalesChart = async (token) => {
  try {
    const res = await API.get(`/report-and-dashbord/sales-graph`, {
      headers: getToken(token),
    });

    return res.data;
  } catch (error) {
    throw new Error('Error while geting order');
  }
};


const warehouseSummary = async (token) => {
  try {
    const res = await API.get(`/report-and-dashbord/warehouse-dashboard`, {
      headers: getToken(token),
    });

    return res.data;
  } catch (error) {
    throw new Error('Error while geting order');
  }
};

export default {
  salesReport,
  stockReport,
  customerReport,
  productionReport,
  warehouseReport,
  inventorySummary,
  salesSummary,
  productionSummary,
  accountSectionSummary,
  Chart,
  productionChart,
  warehouseSummary,
  adminSalesChart
};
