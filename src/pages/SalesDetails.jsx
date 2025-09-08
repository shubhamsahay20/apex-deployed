import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import salesService from '../api/sales.service';
import { useAuth } from '../Context/AuthContext';

const initialProducts = [
  {
    id: 1,
    article: '301',
    size: '6X10',
    color: 'BK',
    softHard: 'S/H',
    ab: 'A',
    warehouse: 'Warehouse 01',
    ordered: 96,
    stock: 83,
    quantity: 1,
  },
  {
    id: 2,
    article: '348',
    size: '9X10',
    color: 'BK',
    softHard: 'S/H',
    ab: 'B',
    warehouse: 'Warehouse 01',
    ordered: 64,
    stock: 56,
    quantity: 2,
  },
  {
    id: 3,
    article: '369',
    size: '6X9',
    color: 'BK',
    softHard: 'S/H',
    ab: 'A',
    warehouse: 'Warehouse 02',
    ordered: 76,
    stock: 30,
    quantity: 1,
  },
  {
    id: 4,
    article: '442',
    size: '6X9',
    color: 'BK',
    softHard: 'S/H',
    ab: 'A',
    warehouse: 'Warehouse 03',
    ordered: 58,
    stock: 45,
    quantity: 4,
  },
];

const SalesDetails = () => {
  const [products, setProducts] = useState(initialProducts);
  const { id } = useParams();
  const { user } = useAuth();
  const [salesDetails,setSalesDetails] = useState({})
 
  useEffect(() => {
    (async () => {
      try {
        console.log(id);

        const res = await salesService.getSalesOrderByID(user.accessToken, id);
        console.log('row res', res);
        setSalesDetails(res)
      } catch (error) {
        toast.error(error.response?.data?.message);
      }
    })();
  }, [id, user.accessToken]);



  const updateQuantity = (id, amount) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id
          ? { ...product, quantity: Math.max(0, product.quantity + amount) }
          : product,
      ),
    );
  };

  return (
    <div className="p-4 space-y-6 bg-gray-100 min-h-screen">
      {/* Sales Details Card with Title & Logs Link */}
      <div className="bg-white rounded-md shadow-sm border">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-base font-semibold text-gray-800">
            Sales Details
          </h2>
          <button className="text-sm text-blue-600 hover:underline">
            View Sales Logs
          </button>
        </div>

        {/* Invoice, Article & Customer Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 text-sm">
          {/* Invoice */}
          <div>
            <h4 className="font-medium text-gray-700 mb-1">Invoice Details:</h4>
            <p>Date: {salesDetails.
createdAt
}</p>
            <p>Time: 20:31</p>
            <p>Reference: 5389607</p>
            <p>Warehouse: Warehouse 01</p>
          </div>

          {/* Article */}
          <div>
            <h4 className="font-medium text-gray-700 mb-1">Article Details:</h4>
            <p>Article: 301</p>
            <p>Size: 6X10</p>
            <p>Color: BK</p>
            <p>Soft/Hard: S/H</p>
          </div>

          {/* Customer */}
          <div>
            <h4 className="font-medium text-gray-700 mb-1">Customer Info:</h4>
            <p>Name : {salesDetails.customer?.name}</p>
            <p>Mail: Smith123@gmail.com</p>
            <p>Phone: +00 983 234 396</p>
            {/* <p>Address:{salesDetails?.Location[0]?.address}</p> */}
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white p-4 rounded-md shadow-sm border">
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          Selected Products For Sales
        </h3>
        <div className="overflow-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b text-gray-600">
                <th className="p-2">Article</th>
                <th>Size</th>
                <th>Color</th>
                <th>Soft/Hard</th>
                <th>A/B</th>
                <th>Warehouse</th>
                <th>Ordered Quantity</th>
                <th>Stock</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {products.map((prod) => (
                <tr key={prod.id} className="border-t hover:bg-gray-50">
                  <td className="p-2">{prod.article}</td>
                  <td>{prod.size}</td>
                  <td className="font-semibold">{prod.color}</td>
                  <td>{prod.softHard}</td>
                  <td>{prod.ab}</td>
                  <td className="text-blue-600 font-medium">
                    {prod.warehouse}
                  </td>
                  <td>{prod.ordered}</td>
                  <td>{prod.stock}</td>
                  <td>
                    <div className="flex items-center border border-gray-300 rounded">
                      <button
                        className="px-2 py-0.5 bg-gray-100 hover:bg-gray-200 border-r border-gray-300 text-sm"
                        onClick={() => updateQuantity(prod.id, -1)}
                      >
                        –
                      </button>
                      <span className="px-3 py-0.5 text-center text-sm text-gray-800">
                        {prod.quantity}
                      </span>
                      <button
                        className="px-2 py-0.5 bg-gray-100 hover:bg-gray-200 border-l border-gray-300 text-sm"
                        onClick={() => updateQuantity(prod.id, 1)}
                      >
                        +
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Buttons */}
      <div className="p-4 w-fit">
        <div className="flex gap-2 bg-white ">
          <button className="px-5 py-1.5 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition">
            Print
          </button>
          <button className="px-5 py-1.5 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition">
            PDF
          </button>
        </div>
      </div>

      {/* Sales Logs */}
      <div className="bg-white p-4 rounded-md shadow-sm border">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Sales Logs</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-3">
              <img
                src="https://randomuser.me/api/portraits/men/32.jpg"
                className="w-10 h-10 rounded-full"
                alt="User"
              />
              <div className="text-sm">
                <div className="font-semibold text-gray-800">John Mathew</div>
                <div className="text-xs text-gray-500 mb-1">03:12 PM</div>
                <p>
                  Dorem ipsum{' '}
                  <a href="#" className="text-blue-600 underline">
                    dolor sit amet
                  </a>
                  , consectetur elit.
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SalesDetails;
