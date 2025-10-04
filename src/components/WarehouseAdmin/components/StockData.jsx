import React, { useEffect, useState } from 'react';
import { FiEye, FiTrash2 } from 'react-icons/fi';
import { PiPencilSimpleLineBold } from 'react-icons/pi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import stockService from '../../../api/stock.service';
import { useAuth } from '../../../Context/AuthContext';
import { useLocation } from 'react-router-dom';
import Loader from '../../../common/Loader';
// import dispatchService from '../../../../api/dispatch.service'; // <-- (when API ready)

const Stock = () => {
  const [dispatchData, setDispatchData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const navigate = useNavigate();
  const { user } = useAuth();
  const location = useLocation();
  const warehouseId = location.state?.warehouseId;
  const [stockData, setStockData] = useState([]);
  const [selectWarehouseId, setSelectWarehouseId] = useState(null);
  const [loading, setLoading] = useState(false);

  const warehouseData = user.user?.warehouses;
  useEffect(() => {
    setLoading(true)
    const fetchData = async () => {
      try {
        if (!selectWarehouseId) {
          setStockData([]); // clear when no warehouse is selected
          return;
        }

        const response = await stockService.getStockByWarehouse(
          user.accessToken,
          selectWarehouseId,
          currentPage,
          10,
        );

        console.log('response', response);

        // Ensure we always replace old data, even if empty
        setStockData(response?.data || []);
        setTotalPage(response?.pagination.totalPages);
      } catch (error) {
        console.error('Error fetching stock data:', error);
        setStockData([]); // clear data on error too
        toast.error(error.response?.data?.message);
      } finally{
        setLoading(false)
      }
    };

    fetchData();
  }, [selectWarehouseId, currentPage, user.accessToken]);

  // 🔹 Group stock data (merge duplicates and sum quantity)
  // 🔹 Directly map API response instead of recalculating
  const groupedStock = stockData.map((entry) => ({
    article: entry.stockdata?.[0]?.article || '-', // take from first stock item if exists
    categoryCode: entry.stockdata?.[0]?.categoryCode || '-',
    color: entry.stockdata?.[0]?.color || '-',
    productionNo: entry.stockdata?.[0]?.productionNo || '-',
    factoryName: entry.factory?.name || '-',
    quality: entry.stockdata?.[0]?.quality || '-',
    size: entry.stockdata?.[0]?.size || '-',
    type: entry.stockdata?.[0]?.type || '-',
    totalQuantity: entry.totalQuantity,
    availableQuantity: entry.availableQuantity,
    dispatchStock: entry.dispatchStock,
  }));

  if(loading) return <Loader/>

  return (
    <div className="p-6 bg-white rounded-md shadow">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
        <h2 className="text-lg font-semibold">Stock Data</h2>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 w-full sm:w-auto mt-4 sm:mt-0">
          <select
            type="text"
            onChange={(e) => setSelectWarehouseId(e.target.value)}
            value={selectWarehouseId}
            placeholder="Search by Article or Category"
            className="px-3 py-1.5 border rounded-md text-sm focus:outline-none focus:ring w-full sm:w-60"
          >
            <option value="">Select warehouse</option>
            {warehouseData.map((value) => (
              <option key={value._id} value={value._id}>
                {value.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-gray-700 border border-gray-200 rounded-md">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3 font-medium">Article</th>
              <th className="p-3 font-medium">Category Code</th>
              <th className="p-3 font-medium">Color</th>
              <th className="p-3 font-medium">Production No</th>
              <th className="p-3 font-medium">Factory Name</th>
              <th className="p-3 font-medium">Quality</th>
              {/* <th className="p-3 font-medium">Quantity</th> */}
              <th className="p-3 font-medium">Size</th>
              <th className="p-3 font-medium">Type</th>
              <th className="p-3 font-medium">Total Qty</th>
              <th className="p-3 font-medium">Available Qty</th>
              <th className="p-3 font-medium">Dispatched Qty</th>
              {/* <th className="p-3 font-medium text-center">Action</th> */}
            </tr>
          </thead>
          <tbody>
            {groupedStock.length === 0 ? (
              <tr>
                <td colSpan="11" className="text-center p-4 text-gray-500">
                  <p className=" text-red-500 font-bold">
                    No stock available for this warehouse , Please select
                    Warehouse
                  </p>
                </td>
              </tr>
            ) : (
              groupedStock.map((row, idx) => (
                <tr key={idx} className="border-t hover:bg-gray-50">
                  <td className="p-3">{row.article}</td>
                  <td className="p-3">{row.categoryCode}</td>
                  <td className="p-3">{row.color}</td>

                  <td className="p-3">{row.productionNo}</td>
                  <td className="p-3">{row.factoryName}</td>
                  <td className="p-3">{row.quality}</td>
                  {/* <td className="p-3">{row.quantity}</td> */}
                  <td className="p-3">{row.size}</td>
                  <td className="p-3">{row.type}</td>
                  <td className="p-3">{row.totalQuantity}</td>
                  <td className="p-3">{row.availableQuantity}</td>
                  <td className="p-3">{row.dispatchStock}</td>

                  {/* <td className="p-3 flex justify-center gap-3">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() =>
                        navigate(`/dispatch-details/${row.article}`)
                      }
                    >
                      <FiEye size={16} />
                    </button>
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => navigate(`/dispatch-edit/${row.article}`)}
                    >
                      <PiPencilSimpleLineBold size={16} />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => toast.info('Delete action here')}
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </td> */}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
        <button
          onClick={() => setCurrentPage((prev) => prev - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded bg-gray-50"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPage}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={currentPage === totalPage}
          className="px-3 py-1 border rounded bg-gray-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Stock;
