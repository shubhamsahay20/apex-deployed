import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../Context/AuthContext';
import productionService from '../../../api/production.service';
import { toast } from 'react-toastify';
import Loader from '../../../common/Loader';
import { useDebounce } from '../../../hooks/useDebounce';

const WarehouseDropdown = () => {
  const [selectPN, setSelectPN] = useState('');
  const [parsedData, setParsedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const [productData, setProductData] = useState([]);
  const [articleNo, setArticleNo] = useState(
    'Please Select Production Number First',
  );
  const [quantity, setQuantity] = useState('');

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState('');
  const debounceValue = useDebounce(search, 500);

  const [fetching, setFetching] = useState(false);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  // 🔹 Fetch productions (with pagination + search)
  const fetchProducts = async (pageNo = 1, searchTerm = '') => {
    if (fetching) return;
    setFetching(true);
    try {
      const res = await productionService.getAllProduction(
        user.accessToken,
        pageNo,
        20,
        searchTerm,
      );

      const products = res.data?.products || [];
      const pagination = res.data?.pagination;

      if (pageNo === 1) {
        setProductData(products);
      } else {
        setProductData((prev) => [...prev, ...products]);
      }

      setHasMore(pageNo < (pagination?.totalPages || 1));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch');
    } finally {
      setFetching(false);
    }
  };

  // 🔹 Initial + search change
  useEffect(() => {
    if (!open) return; // Only fetch if dropdown is open

    // Call API only if debounced value length is 0 or >= 2
    if (debounceValue.length === 0 || debounceValue.length >= 2) {
      setPage(1);
      fetchProducts(1, debounceValue);
    }
  }, [debounceValue, open]);

  // 🔹 On page change
  useEffect(() => {
    if (page > 1) fetchProducts(page, search);
  }, [page]);

  // 🔹 Infinite scroll inside dropdown
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 5 && hasMore && !fetching) {
      setPage((prev) => prev + 1);
    }
  };

  // 🔹 Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    const selected = productData.find((num) => num.productionNo === value);
    if (selected) {
      setArticleNo(selected.article || '');
    }

    setSelectPN(value);
    setOpen(false);

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
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 text-center"
        ref={wrapperRef}
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Manual Dispatch
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Select Production No from the manual dispatch
        </p>

        {/* 🔹 Custom select box */}
        <div className="relative text-left mb-4">
          <div
            onClick={() => setOpen((prev) => !prev)}
            className="w-full px-4 py-2 border rounded-lg bg-white text-gray-700 cursor-pointer focus:ring-2 focus:ring-blue-500"
          >
            {selectPN || '-- Select Production No --'}
          </div>

          {open && (
            <div className="absolute mt-1 w-full bg-white border rounded-lg shadow-lg z-10">
              {/* search box */}
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2 border-b outline-none"
              />

              {/* list with scroll */}
              <div onScroll={handleScroll} className="max-h-48 overflow-y-auto">
                {productData.map((qr, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSelect(qr.productionNo)}
                    className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                  >
                    {qr.productionNo}
                  </div>
                ))}

                {fetching && (
                  <p className="px-4 py-2 text-sm text-gray-500">Loading...</p>
                )}
                {!fetching && productData.length === 0 && (
                  <p className="px-4 py-2 text-sm text-gray-500">
                    No results found
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <input
          className="w-full border rounded px-3 py-2 mb-3"
          value={`Article : ${articleNo}`}
          readOnly
        />

        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="Enter Quantity"
        />

       <button
  type="submit"
  className={`w-full px-5 py-2 rounded mt-4 text-white transition ${
    selectPN && quantity
      ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
      : 'bg-gray-400 cursor-not-allowed'
  }`}
  onClick={handleSubmit}
  disabled={!selectPN || !quantity}
>
  Submit
</button>

      </div>
    </div>
  );
};

export default WarehouseDropdown;
