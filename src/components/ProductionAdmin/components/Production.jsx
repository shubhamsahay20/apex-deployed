import React, { useState, useEffect } from 'react';
import { FiRefreshCcw } from 'react-icons/fi';
import { useAuth } from '../../../Context/AuthContext';
import productionService from '../../../api/production.service';
import { toast } from 'react-toastify';
import Loader from '../../../common/Loader';

const QRDropdownPage = () => {
  const [selectPN, setSelectPN] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);
  const { user } = useAuth();
  const [productData, setProductData] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        let allNumber = [];
        let currentPage = 1;
        let totalPages = 1;

        while (currentPage <= totalPages) {
          const res = await productionService.getAllProduction(
            user.accessToken,
            currentPage,
          );

          console.log('res is', res.data?.pagination);

          allNumber = [...allNumber, ...res.data?.products];
          console.log('total pages', res.data?.pagination?.totalPages);

          totalPages = res.data?.pagination?.totalPages;
          currentPage++;
        }
        setProductData(allNumber);
      } catch (error) {
        toast.error(error.response?.data?.message);
      }
    })();
  }, [user.accessToken]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        productionNo: selectPN,
      };

      const res = await productionService.byPassWithoutQr(
        user.accessToken,
        payload,
      );
      console.log('after submit', res);

      toast.success(res?.message || 'New Stock Created');

      setSelectPN('');
    } catch (error) {
      console.error('Full error object:', error.response?.data);

      const errorMsg =
        error?.response?.data?.error || // show backend error details
        error?.response?.data?.message || // fallback to message
        error?.message || // network error
        'Something went wrong!';

      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (value) => {
    setSelectPN(value);

    try {
      const jsonData = JSON.parse(value);
      if (typeof jsonData === 'object') {
        setParsedData(jsonData);
      } else {
        setParsedData(null);
      }
    } catch {
      setParsedData(null);
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 text-center transition-all duration-300">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Manual Process
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Select Production No for Manual Process Without Qr Scan
        </p>

        <select
          onChange={(e) => handleSelect(e.target.value)}
          value={selectPN}
          className="w-full px-4 py-3 border rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
        >
          <option value="">-- Select Production No --</option>
          {productData.map((qr, idx) => (
            <option key={idx} value={qr.productionNo}>
              {qr.productionNo}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 rounded mt-2"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default QRDropdownPage;
