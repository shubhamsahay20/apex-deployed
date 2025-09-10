import React, { useEffect, useState } from 'react';
import { FaFilter, FaFileExport } from 'react-icons/fa';
import { FiEye, FiTrash2 } from 'react-icons/fi';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { toast } from 'react-toastify';
import reportService from '../../../../api/report.service';
import { useAuth } from '../../../../Context/AuthContext';

const Reports = () => {
  const [activeReport, setActiveReport] = useState('stock');
  const { user } = useAuth();
  const [salesReport, setSalesReport] = useState([]);
  const [customerReport, setCustomerReport] = useState([]);
  const [stockReport, setStockReport] = useState([]);
  const [productionReport, setProductionReport] = useState([]);
  const [warehouseReport, setWarehouseReport] = useState([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchsalesReport = async () => {
      try {
        const salesreport = await reportService.salesReport(user.accessToken);
        console.log('response of sales report', salesreport.data);
        setSalesReport(salesreport?.data);

        const customerreport = await reportService.customerReport(
          user.accessToken,
        );
        console.log('response of customer report', customerreport.data);
        setCustomerReport(customerreport.data);

        const stockreport = await reportService.stockReport(user.accessToken);
        console.log('response of stock report', stockreport.data);
        setStockReport(stockreport.data);

        const productionreport = await reportService.productionReport(
          user.accessToken,
        );
        console.log('response of production report', productionreport.products);
        setProductionReport(productionreport.products);

        const warehousereport = await reportService.warehouseReport(
          user.accessToken,
        );
        console.log('response of warehouse report', warehousereport.data.data);
        setWarehouseReport(warehousereport.data?.data);
      } catch (error) {
        toast.error(error.response?.message);
      }
    };

    fetchsalesReport();
  }, []);

  const rowMappers = {
    stock: (row) => [
      row.article,
      row.factory,
      row.warehouse,
      row.totalQuantity,
    ],
    sales: (row) => [
      row.salesOrderNo,
      row.orderDate,
      row.customer,
      row.article,
      row.quantity,
    ],
    products: (row) => [
      row.productionNo,
      row.article,
      row.category?.[0]?.categoryCode,
      row.productionQuantity,
      row.dispatchedQuantity,
    ],
    warehouse: (row) => [
      row.warehouseName,
      row.warehouseLocation,
      row.totalQuantity,
    ],
    customer: (row) => [row.customer, row.article, row.city, row.totalQuantity],
  };

  const reportData = {
    stock: stockReport,
    sales: salesReport,
    products: productionReport,
    warehouse: warehouseReport,
    customer: customerReport,
  };

  const tabs = [
    { key: 'stock', label: '📦 Stock Report' },
    { key: 'sales', label: '📊 Sales Report' },
    { key: 'products', label: '🛍️ Products Report' },
    { key: 'warehouse', label: '🏭 Warehouse Report' },
    { key: 'customer', label: '👤 Customer Report' },
  ];

  const columns = {
    stock: ['Article', 'Factory', 'Warehouse', 'Total Quantity'],
    sales: [
      'Sales Order No',
      'Order Date',
      'Customer',
      'Article',
      'Quantity',
    ],
    products: [
      'Production No.',
      'Article',
      'Category Code',
      'Production Quantity',
      'Dispatched Quantity',
    ],
    warehouse: ['Warehouse ID', 'Location', 'Total Quantity'],
    customer: ['Customer', 'Article', 'City', 'Total Quantity'],
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const data = reportData[activeReport];
    const headers = [columns[activeReport]];
    const rows = data.map((row) => Object.values(row));

    doc.setFontSize(14);
    doc.text(`${tabs.find((t) => t.key === activeReport)?.label}`, 14, 10);

    autoTable(doc, {
      head: headers,
      body: rows,
      startY: 20,
    });

    doc.save(`${activeReport}_report.pdf`);
  };

  const renderTable = () => {
    const data = reportData[activeReport] || [];

    if (!data.length) {
      return (
        <div className="bg-white text-center p-10 rounded shadow text-gray-500">
          No data available for this report.
        </div>
      );
    }

    // Pagination logic
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const startIdx = (currentPage - 1) * itemsPerPage;
    const paginatedData = data.slice(startIdx, startIdx + itemsPerPage);

    return (
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800 capitalize">
            {tabs.find((t) => t.key === activeReport)?.label}
          </h3>
          <div className="flex gap-2">
            <button className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-300 text-sm rounded text-gray-700 hover:bg-gray-50">
              <FaFilter /> Filter
            </button>
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-300 text-sm rounded text-gray-700 hover:bg-gray-50"
            >
              <FaFileExport /> Export
            </button>
          </div>
        </div>

        <div className="min-w-full overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                {columns[activeReport].map((col, i) => (
                  <th key={i} className="p-4 whitespace-nowrap">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {paginatedData.map((row, idx) => (
                <tr key={idx} className="border-t hover:bg-gray-50">
                  {rowMappers[activeReport](row).map((val, i) => (
                    <td key={i} className="p-4 whitespace-nowrap">
                      {val}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        <div className="flex justify-between items-center p-4 border-t text-sm text-gray-600">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="px-3 py-1 border rounded bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-3 py-1 border rounded bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Sidebar */}
      <div className="w-full sm:w-64 bg-white shadow-lg p-6 border-r border-gray-200 self-start h-fit mt-4">
        <ul className="space-y-2">
          {tabs.map((report) => (
            <li key={report.key}>
              <button
                onClick={() => {
                  setActiveReport(report.key);
                  setCurrentPage(1); // reset to first page on tab change
                }}
                className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeReport === report.key
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {report.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Report Content */}
      <div className="flex-1 p-8 sm:p-4">{renderTable()}</div>
    </div>
  );
};

export default Reports;
