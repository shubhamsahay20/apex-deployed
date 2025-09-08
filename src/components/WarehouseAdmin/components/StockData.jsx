import React, { useEffect, useState } from 'react';
import { FiEye, FiTrash2 } from 'react-icons/fi';
import { PiPencilSimpleLineBold } from 'react-icons/pi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import stockService from '../../../api/stock.service';
import { useAuth } from '../../../Context/AuthContext';
import { useLocation } from 'react-router-dom';
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

  const warehouseData = user.user?.warehouses;
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('user details', user.user?.warehouses);
        console.log('warehouse id', selectWarehouseId);

        const response = await stockService.getStockByWarehouse(
          user.accessToken,
          selectWarehouseId,
        );
        console.log('stock data', response.data);

        setStockData(response?.data);
      } catch (error) {
        console.error('Error fetching stock data:', error);
        toast.error(error.response?.data?.message );
      }
    };

    fetchData();
  }, [selectWarehouseId]);

  // 🔹 Group stock data (merge duplicates and sum quantity)
  const groupedStock = [];
  stockData.forEach((entry) => {
    entry.stockdata.forEach((item) => {
      const key = [
        item.article,
        item.categoryCode,
        item.color,
        entry.dispatched,
        item.productionNo,
        entry.factory.name,
        item.quality,
        item.size,
        item.type,
      ].join('|');

      const existing = groupedStock.find((g) => g.key === key);

      if (existing) {
        existing.quantity += item.quantity;
      } else {
        groupedStock.push({
          key,
          article: item.article,
          categoryCode: item.categoryCode,
          color: item.color,
          dispatched: entry.dispatched,
          productionNo: item.productionNo,
          factoryName: entry.factory.name,
          quality: item.quality,
          size: item.size,
          type: item.type,
          quantity: item.quantity,
        });
      }
    });
  });

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
              <th className="p-3 font-medium">Dispatched</th>
              <th className="p-3 font-medium">Production No</th>
              <th className="p-3 font-medium">Factory Name</th>
              <th className="p-3 font-medium">Quality</th>
              <th className="p-3 font-medium">Quantity</th>
              <th className="p-3 font-medium">Size</th>
              <th className="p-3 font-medium">Type</th>
              <th className="p-3 font-medium text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {groupedStock.map((row, idx) => (
              <tr key={idx} className="border-t hover:bg-gray-50">
                <td className="p-3">{row.article}</td>
                <td className="p-3">{row.categoryCode}</td>
                <td className="p-3">{row.color}</td>
                <td className="p-3">
                  {row.dispatched ? (
                    <span className="text-green-600 font-medium">Yes</span>
                  ) : (
                    <span className="text-red-600 font-medium">No</span>
                  )}
                </td>
                <td className="p-3">{row.productionNo}</td>
                <td className="p-3">{row.factoryName}</td>
                <td className="p-3">{row.quality}</td>
                <td className="p-3">{row.quantity}</td>
                <td className="p-3">{row.size}</td>
                <td className="p-3">{row.type}</td>
                <td className="p-3 flex justify-center gap-3">
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => navigate(`/dispatch-details/${row.article}`)}
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
                </td>
              </tr>
            ))}
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
