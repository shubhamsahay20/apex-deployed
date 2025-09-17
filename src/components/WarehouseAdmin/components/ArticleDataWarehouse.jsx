import React, { useEffect, useState } from 'react';
// import InventoryCards from '../../../SuperAdmin/components/inventory/InventoryCards'
import { exportProductionPDF } from '../../../utils/PdfModel';
import { useAuth } from '../../../Context/AuthContext';
import { toast } from 'react-toastify';
import salesService from '../../../api/sales.service';
import { useDebounce } from '../../../hooks/useDebounce';

// const cards = [
//   { label: 'Cartons Available', value: '1,114', color: 'text-blue-600' },
//   { label: "Today's Production", value: '124', color: 'text-indigo-600' },
//   { label: "Today's Orders", value: '2,868', color: 'text-orange-500' },
//   { label: "Today's Sale", value: '1,442', color: 'text-green-600' }
// ]

const ArticalData = () => {
  const { user } = useAuth();
  const [articledetails, setArticledetails] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const debounceValue = useDebounce(searchQuery, 500);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await salesService.getAllArtical(
          user.accessToken,
          currentPage,
          10,
          debounceValue,
        );
        console.log('get all articles', res?.data);
        setTotalPages(res?.pagination?.totalPages);
        setArticledetails(res?.data || []);
      } catch (error) {
        toast.error(error.response?.data?.message);
      }
    };
    if (debounceValue.length === 0 || debounceValue.length >= 2) {
      fetchData();
    }

    return () => console.log('clean');

    console.log('hii');
  }, [user, currentPage, debounceValue]);
  return (
    <div className="space-y-6 bg-gray-100 min-h-screen">
      {/* <h2 className='text-lg font-semibold text-gray-800'>Inventory</h2> */}

      {/* <InventoryCards cards={cards} /> */}

      <div className="bg-white p-4 rounded-md shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-700">Products List</h3>
          <div className="flex items-center gap-2">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              type="text"
              placeholder="Search Article, order"
              className="text-sm px-3 py-1.5 border rounded-md"
            />
            {/* <button className='text-sm border px-3 py-1.5 rounded-md'>
              Today
            </button> */}
            <button
              className="text-sm border px-3 py-1.5 rounded-md"
              onClick={() => exportProductionPDF(inventoryData)}
            >
              Export
            </button>
          </div>
        </div>

        <div className="overflow-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b text-gray-600">
                <th className="p-2">Article</th>
                <th>Category Code</th>
                <th>Size</th>
                <th>Color</th>
                <th>Soft/Hard</th>
                <th>Quality</th>
                {/* <th>Production Quantity</th> */}
                <th>Warehouse Quantity</th>
                <th>Total Quantity</th>
              </tr>
            </thead>
            <tbody>
              {articledetails.map((row, idx) => (
                <tr key={idx} className="border-t hover:bg-gray-50">
                  <td className="p-2 text-black font-medium">{row.article}</td>
                  <td className="text-black font-medium">{row.categoryCode}</td>
                  <td className="text-black font-medium">{row.size}</td>
                  <td className="font-semibold">{row.color}</td>
                  <td className="text-black font-medium">{row.type}</td>
                  <td className="text-black font-medium">{row.quality}</td>
                  {/* <td className="text-blue-600 font-medium">
                    {row.Production_Qty}
                  </td> */}
                  <td className="text-blue-600 font-medium">
                    {row.Warehouse_Qty}
                  </td>
                  <td className="text-blue-600 font-medium">
                    {row.Total_Available}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <button
            onClick={() => setCurrentPage((prev) => prev - 1)}
            disabled={currentPage === 1}
            className="text-sm border px-4 py-1.5 rounded"
          >
            Previous
          </button>
          <span className="text-xs text-gray-500">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage === totalPages}
            className="text-sm border px-4 py-1.5 rounded"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArticalData;
