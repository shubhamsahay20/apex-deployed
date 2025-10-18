import React, { useEffect, useState } from 'react';
import { FiFilter, FiTrash2 } from 'react-icons/fi';
import { IoMdArrowRoundUp, IoMdArrowRoundDown } from 'react-icons/io';
import cartService from '../../api/cart.service';
import { useAuth } from '../../Context/AuthContext';
import { toast } from 'react-toastify';
import Loader from '../../common/Loader';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Orders = () => {
  const { user } = useAuth();
  const [myOrder, setMyOrder] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [expandedRows, setExpandedRows] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await cartService.salesPersonOrderList(user.accessToken);
        setMyOrder(res.data || []);
        setTotalPages(res.pagination?.totalPages);
      } catch (error) {
        toast.error(error.response?.data?.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user.accessToken]);

  const toggleExpand = (idx) => {
    setExpandedRows((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  // -------------------- Export PDF --------------------
  const exportOrdersPDF = (orders) => {
    if (!orders || orders.length === 0) return alert('No data to export');

    const doc = new jsPDF();
    const headers = [
      [
        'Sale Order No',
        'Article',
        'Category Code',
        'Color',
        'Size',
        'Type',
        'Quality',
        'Quantity',
        'Customer',
      ],
    ];

    const rows = orders.flatMap((order) =>
      order.items.map((item, idx) => [
        idx === 0 ? order.salesOrderNo : '', // show order number only for first item
        item.article,
        item.categoryCode,
        item.color,
        item.size,
        item.type,
        item.quality,
        item.quantity,
        order.customer?.name || '',
      ])
    );

    doc.setFontSize(14);
    doc.text('Sales Orders Report', 14, 10);

    autoTable(doc, {
      head: headers,
      body: rows,
      startY: 20,
    });

    doc.save('sales_orders_report.pdf');
  };

  if (loading) return <Loader />;

  return (
    <div className="p-4 bg-white rounded shadow">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Order Management
        </h2>
        <div className="flex gap-2">
          <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-700">
            <FiFilter /> Filters
          </button>
          <button
            onClick={() => exportOrdersPDF(myOrder)}
            className="px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-700"
          >
            Export
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border">
          <thead className="bg-gray-50 text-gray-600 font-medium">
            <tr>
              <th className="px-6 py-4">Sale Order No.</th>
              <th className="px-6 py-4">Article</th>
              <th className="px-6 py-4">Category Code</th>
              <th className="px-6 py-4">Color</th>
              <th className="px-6 py-4">Size</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Quality</th>
              <th className="px-6 py-4">Quantity</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {myOrder.map((order, idx) => {
              const firstItem = order.items[0];
              const hasMore = order.items.length > 1;
              const isExpanded = expandedRows[idx];

              return (
                <React.Fragment key={idx}>
                  <tr className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4 flex items-center gap-2">
                      {order.salesOrderNo}
                      {hasMore && (
                        <button onClick={() => toggleExpand(idx)}>
                          {isExpanded ? (
                            <IoMdArrowRoundUp />
                          ) : (
                            <IoMdArrowRoundDown />
                          )}
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4">{firstItem.article}</td>
                    <td className="px-6 py-4">{firstItem.categoryCode}</td>
                    <td className="px-6 py-4">{firstItem.color}</td>
                    <td className="px-6 py-4">{firstItem.size}</td>
                    <td className="px-6 py-4">{firstItem.type}</td>
                    <td className="px-6 py-4">{firstItem.quality}</td>
                    <td className="px-6 py-4">{firstItem.quantity}</td>
                    <td className="px-6 py-4">{order.customer?.name}</td>
                    <td className="px-6 py-4 flex justify-center">
                      <FiTrash2 className="text-red-500 cursor-pointer" />
                    </td>
                  </tr>

                  {isExpanded &&
                    order.items.slice(1).map((item, i) => (
                      <tr
                        key={`${idx}-${i}`}
                        className="border-t bg-gray-50 text-gray-700"
                      >
                        <td className="px-6 py-4"></td>
                        <td className="px-6 py-4">{item.article}</td>
                        <td className="px-6 py-4">{item.categoryCode}</td>
                        <td className="px-6 py-4">{item.color}</td>
                        <td className="px-6 py-4">{item.size}</td>
                        <td className="px-6 py-4">{item.type}</td>
                        <td className="px-6 py-4">{item.quality}</td>
                        <td className="px-6 py-4">{item.quantity}</td>
                        <td className="px-6 py-4">{order.customer?.name}</td>
                        <td className="px-6 py-4"></td>
                      </tr>
                    ))}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4 text-sm">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className="border px-4 py-1.5 rounded"
        >
          Previous
        </button>
        <span className="text-gray-500">
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="border px-4 py-1.5 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Orders;
