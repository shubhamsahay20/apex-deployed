import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const DeliveryDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const selectedProducts = [
    {
      id: 1,
      article: "301",
      saleRef: "SO/301652",
      warehouse: "Warehouse 01",
      size: "6X10",
      color: "BK",
      stock: 83,
      quantity: 1,
    },
    {
      id: 2,
      article: "348",
      saleRef: "SO/301596",
      warehouse: "Warehouse 01",
      size: "9X10",
      color: "BK",
      stock: 56,
      quantity: 2,
    },
    {
      id: 3,
      article: "348",
      saleRef: "SO/301596",
      warehouse: "Warehouse 01",
      size: "9X8",
      color: "BK",
      stock: 32,
      quantity: 1,
    },
    {
      id: 4,
      article: "348",
      saleRef: "SO/301596",
      warehouse: "Warehouse 01",
      size: "11X10",
      color: "BK",
      stock: 67,
      quantity: 1,
    },
  ];

  const updateQuantity = (id, change) => {
    // handle quantity update logic
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Delivery Orders</h2>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          value={state?.date || ""}
          disabled
          className="border px-4 py-2 rounded-md text-sm bg-gray-100"
        />
        <input
          type="text"
          value={state?.article || ""}
          disabled
          className="border px-4 py-2 rounded-md text-sm bg-gray-100"
        />
        <input
          type="text"
          value={state?.warehouse || ""}
          disabled
          className="border px-4 py-2 rounded-md text-sm bg-gray-100"
        />
        <input
          type="number"
          placeholder="Deliverable Quantity"
          className="border px-4 py-2 rounded-md text-sm"
        />
        <input
          type="text"
          placeholder="Delivery Address"
          className="border px-4 py-2 rounded-md text-sm"
        />
        <input
          type="text"
          value={state?.customer || ""}
          disabled
          className="border px-4 py-2 rounded-md text-sm bg-gray-100"
        />
      </div>

      {/* Sale Order Ref */}
      <p className="text-sm text-blue-600 font-medium mt-2">
        Sale Order Reference Number: <span className="underline cursor-pointer">{state?.saleRef}</span>
      </p>

      {/* Product Table */}
      <div className="bg-white border rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Selected Products For Delivery</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="px-3 py-2 text-left">Articles</th>
                <th>Sales Reference No.</th>
                <th>Warehouse</th>
                <th>Size</th>
                <th>Color</th>
                <th>Stock</th>
                <th>Quantity</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {selectedProducts.map((prod) => (
                <tr key={prod.id} className="border-t">
                  <td className="px-3 py-2">{prod.article}</td>
                  <td>{prod.saleRef}</td>
                  <td>{prod.warehouse}</td>
                  <td>{prod.size}</td>
                  <td>{prod.color}</td>
                  <td>{prod.stock}</td>
                  <td>
                    <div className="flex items-center border rounded overflow-hidden w-fit">
                      <button
                        className="px-2 py-1 bg-gray-200 hover:bg-gray-300"
                        onClick={() => updateQuantity(prod.id, -1)}
                      >–</button>
                      <span className="px-3">{prod.quantity}</span>
                      <button
                        className="px-2 py-1 bg-gray-200 hover:bg-gray-300"
                        onClick={() => updateQuantity(prod.id, 1)}
                      >+</button>
                    </div>
                  </td>
                  <td>
                    <button className="text-red-500 hover:text-red-700">🗑</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Buttons */}
        <div className="flex gap-3 mt-6">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm">
            Submit
          </button>
          <button className="border px-4 py-2 rounded text-sm">Create Labels</button>
          <button className="border px-4 py-2 rounded text-sm">PDF</button>
        </div>
      </div>
    </div>
  );
};

export default DeliveryDetails;
