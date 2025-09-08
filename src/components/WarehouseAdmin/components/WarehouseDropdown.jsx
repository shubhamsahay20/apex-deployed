import React, { useState, useEffect } from 'react';
import { FiRefreshCcw } from 'react-icons/fi';
import { useAuth } from '../../../Context/AuthContext';
import productionService from '../../../api/production.service';
import { toast } from 'react-toastify';
import Loader from '../../../common/Loader';

const WarehouseDropdown = () => {
  const [selectPN, setSelectPN] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);
  const { user } = useAuth();
  const [productData, setProductData] = useState([]);
  const [articleNo, setArticleNo] = useState(
    'Please Select Production Number First',
  );
  const [quantity, setQuantity] = useState('');

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
        article: articleNo,
        quantity: quantity,
      };

      const res = await productionService.outOfDeliveryWithoutQr(
        user.accessToken,
        payload,
      );
      console.log('after submit', res);

      toast.success(res?.data.message || 'New Stock Created');

      setSelectPN('');
      setArticleNo('');
      setQuantity('');
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (value) => {
    console.log('value', value);

    const { article } = productData.find((num) => num.productionNo === value);
    console.log('article', article);
    setArticleNo(article);

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

  return loading ? (<Loader/>):( 
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 text-center transition-all duration-300">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {' '}
          Manual Dispatch
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Select Production No from the manual dispatch
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

        <input
          className="w-full border rounded px-3 py-2"
          value={`Article : ${articleNo}`}
          readOnly
        />

        <br />
        <br />

        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="Enter Quantity"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 rounded mt-2"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
        )
};

export default WarehouseDropdown;
