import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import factoryService from '../../../api/factory.service';
import { useAuth } from '../../../Context/AuthContext';
import authService from '../../../api/auth.service';
import { FiTrash2 } from 'react-icons/fi';
import productionService from '../../../api/production.service';
import DeleteModal from '../../../utils/DeleteModal';
import { toast } from 'react-toastify';
import { useDebounce } from '../../../hooks/useDebounce';

const Add_Production = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [activeTab, setActiveTab] = useState('Pending');
  const [showDeleteModel, setShowDeleteModel] = useState(false);
  const [selectId, setSelectId] = useState(null);

  const [deleteId, setDeleteId] = useState(null);
  const [products, setProducts] = useState([
    {
      id: 301,
      article: '301',
      warehouse: 'Factory 46',
      stock: '1,834',
      size: '6X10',
      color: 'Black',
      type: 'S/H',
    },

    {
      id: 302,
      article: '302',
      warehouse: 'Factory 46',
      stock: '1,834',
      size: '6X10',
      color: 'Black',
      type: 'S/H',
    },
  ]);

  const [factoryData, setFactoryData] = useState([]);
  const [articleData, setArticleData] = useState([]);
  const [formData, setFormData] = useState({
    date: '',
    factory: '',
    article: '',
    production: '',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const debounceValue = useDebounce(searchQuery, 500);
  const [productionData, setProductionData] = useState([]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  useEffect(() => {
    const fetchdata = async () => {
      const res = await productionService.getAllProduction(
        user.accessToken,
        currentPage,
        10,
        debounceValue,
      );
      console.log('heloooooooooo', res.data);
      setProductionData(res?.data?.products);
      setTotalPages(res?.data?.pagination?.totalPages);
    };

    if (debounceValue.length === 0 || debounceValue.length >= 2) {
      fetchdata();
    }
  }, [user.accessToken, currentPage, debounceValue, productionData]);

  useEffect(() => {
    (async () => {
      try {
        let factoryInfo = [];
        let Page = 1;
        let totalPages = 1;

        while (Page <= totalPages) {
          const res = await factoryService.getAllFactories(
            user.accessToken,
            Page,
          );
          console.log('res data', res.data?.data?.factories);
          factoryInfo = [...factoryInfo, ...res.data.data.factories];
          totalPages = res.data.pagination.totalPages;
          Page++;
        }
        setFactoryData(factoryInfo);
        let allData = [];
        let page2 = 1;
        let totalPages2 = 1;

        while (page2 <= totalPages2) {
          const response = await authService.getCategories(
            user.accessToken,
            page2,
          );
          console.log('this is second', response.data.data);
          allData = [...allData, ...response.data.data];
          totalPages2 = response.data.pagination.totalPages;
          page2++;
        }
        setArticleData(allData);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [user.accessToken, formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.article.trim()) {
      toast.error('Article code is required');
    }
    if (!formData.date.trim()) {
      toast.error('Date is required');
    }
     if (!formData.factory.trim()) {
      toast.error('Factory is required');
    }
     if (!formData.production.trim()) {
      toast.error('Production Number is required');
    }
    try {
      const payload = {
        factory: formData.factory,
        article: formData.article,
        productionDate: formData.date,
        productionQuantity: formData.production,
      };

      console.log(payload);

      const res = await productionService.addProduction(
        user.accessToken,
        payload,
      );

      console.log('res coming after submit', res.data);
      setFormData({
        date: '',
        factory: '',
        article: '',
        production: '',
      });

      toast.success(res.data?.message || 'Production Added Successfully');
      console.log('res backend', res);
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  const confirmDelete = async () => {
    await productionService.deleteProduction(user.accessToken, selectId);
    setProductionData((prev) => prev.filter((item) => item._id !== selectId));
    setSelectId(null);
    setShowDeleteModel(false);
  };

  const handleDelete = (id) => {
    setSelectId(id);
    setShowDeleteModel(true);
  };

  const handleCreateLabels = () => {
    navigate('/production-manager/management/create-label', { state });
  };
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Production Data', 14, 15);

    const tableColumn = [
      'Article',
      'Factory',
      'Category Code',
      'Size',
      'Color',
      'Type',
    ];
    const tableRows = [];

    productionData.forEach((prod) => {
      const row = [
        prod.article,
        prod.warehouse,
        prod.category.map((item) => item.categoryCode).join(', '),
        prod.category.map((item) => item.size).join(', '),
        prod.category.map((item) => item.color).join(', '),
        prod.category.map((item) => item.type).join(', '),
      ];
      tableRows.push(row);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 25,
    });

    doc.save('production_data.pdf');
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Add Production </h2>
        <form>
          <div className="flex gap-2">
            {['In-progress ', 'Done'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-md text-sm border ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium">Date</label>
          <input
            type="date"
            name="date"
            min={new Date().toISOString().split('T')[0]}
            value={formData.date || ''}
            onChange={handleChange}
            className="border px-4 py-2 rounded-md text-sm w-full"
          />
        </div>
        {/* <div>
                    <label className="text-sm font-medium"></label>
                    <input
                        type="text"
                        value={state?.article || ""}
                        className="border px-4 py-2 rounded-md text-sm w-full"
                    />
                </div> */}
        <div>
          <label className="text-sm font-medium">Factory </label>
          <select
            name="factory"
            value={formData.factory || ''}
            onChange={handleChange}
            className="border px-4 py-2 rounded-md text-sm  w-full"
          >
            <option value="Warehouse 01">Select Factory</option>
            {factoryData.map((details) => (
              <option value={details._id}>{details.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">Article </label>
          <select
            name="article"
            value={formData.article || ''}
            onChange={handleChange}
            className="border px-4 py-2 rounded-md text-sm  w-full"
          >
            <option value="Warehouse 01">Select Article</option>
            {articleData?.map((item) => (
              <option value={item.article}>{item.article}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium">Production Quantity</label>
          <input
            type="number"
            // placeholder="544"
            name="production"
            value={formData.production}
            onChange={handleChange}
            className="border px-4 py-2 rounded-md text-sm w-full"
          />
          <button
            type="submit"
            onClick={handleSubmit}
            className="bg-blue-600 mt-4 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
          >
            Submit
          </button>
        </div>
      </div>

      <div className="bg-white border rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Selected Products For Delivery
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="px-3 py-2 text-left">
                  <input type="checkbox" className="mr-2" />
                  Production No.
                </th>
                <th className="px-3 py-2 text-left">Article No</th>
                <th className="px-3 py-2 text-left">Factory</th>
                <th className="px-3 py-2 text-left">Category Code</th>
                <th className="px-3 py-2 text-left">Production Quantity</th>
                <th className="px-3 py-2 text-left">Size</th>
                <th className="px-3 py-2 text-left">Color</th>
                <th className="px-3 py-2 text-left">Soft/Hard</th>
                <th className="px-3 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {productionData
                ?.filter((item) => item.isActive)
                .map((prod) => (
                  <tr key={prod.id} className="border-t">
                    <td className="px-3 py-2">
                      <input type="checkbox" className="mr-2" />
                      {prod.productionNo}
                    </td>
                    <td className="px-3 py-2">{prod.article}</td>

                    <td className="px-3 py-2">{prod.factory?.name}</td>

                    <td className="px-3 py-2">
                      {prod.category.map((item) => item.categoryCode)}
                    </td>

                    <td className="px-3 py-2">{prod.productionQuantity}</td>
                    <td className="px-3 py-2">
                      {prod.category.map((item) => item.size)}
                    </td>
                    <td className="px-3 py-2">
                      {prod.category.map((item) => item.color)}
                    </td>
                    <td className="px-3 py-2">
                      {prod.category.map((item) => item.type)}
                    </td>
                    <td className="px-3 py-2">
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(prod._id)}
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            className="border px-4 py-2 rounded text-sm"
            onClick={handleCreateLabels}
          >
            Create Labels
          </button>
          <button
            className="border px-4 py-2 rounded text-sm"
            onClick={handleDownloadPDF}
          >
            PDF
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className="px-4 py-1 border rounded"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="px-4 py-1 border rounded"
        >
          Next
        </button>
      </div>

      {deleteId !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-96 text-center">
            <div className="bg-red-100 w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-4">
              <FiTrash2 className="text-red-500 text-2xl" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Partially Cancel Delivery Orders
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to partially cancel the Delivery Orders{' '}
              <strong>{deleteId}</strong>?
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-100"
                onClick={() => setDeleteId(null)}
              >
                No
              </button>
              <button
                className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                onClick={handleDelete}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
      <DeleteModal
        name="Product"
        isOpen={showDeleteModel}
        onClose={() => setShowDeleteModel(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default Add_Production;
