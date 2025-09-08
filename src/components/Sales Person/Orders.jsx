import React from "react";
// import { FaEye, FaTrash } from "react-icons/fa";
import { FiFilter } from "react-icons/fi";
import { FiEye, FiTrash2} from 'react-icons/fi';
const orders = [
  {
    saleOrderNo: "SO/538960",
    article: "301",
    requirements: "6X10 / 16",
    size: "6X10",
    color: "BK",
    softHard: "S/H",
    quantity: "20",
    customer: "Soilt IT Sol",
    availability: "In-stock",
  },
  {
    saleOrderNo: "SO/538968",
    article: "401",
    requirements: "6X10 / 16",
    size: "6X10",
    color: "BK",
    softHard: "S",
    quantity: "20",
    customer: "Angela Carter",
    availability: "In-stock",
  },
  {
    saleOrderNo: "SO/538961",
    article: "422",
    requirements: "6X9 / 24",
    size: "6X9",
    color: "BK",
    softHard: "H",
    quantity: "20",
    customer: "Victor james",
    availability: "Out of stock",
  },
  {
    saleOrderNo: "SO/538963",
    article: "356",
    requirements: "8X10 / 24",
    size: "8X10",
    color: "BK",
    softHard: "S/H",
    quantity: "20",
    customer: "Sharp Camela",
    availability: "Out of stock",
  },
  {
    saleOrderNo: "SO/138967",
    article: "786",
    requirements: "6X9 / 14",
    size: "6X9",
    color: "BK",
    softHard: "H",
    quantity: "20",
    customer: "Jhon Ronan",
    availability: "In-stock",
  },
  {
    saleOrderNo: "SO/128960",
    article: "706",
    requirements: "6X10 / 19",
    size: "6X10",
    color: "BK",
    softHard: "H",
    quantity: "20",
    customer: "Victor james",
    availability: "Low stock",
  },
];

const Orders = () => {
  return (
    <div className="p-4 bg-white rounded shadow">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Order Management</h2>
        <div className="flex gap-2">
          <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-700">
            <FiFilter /> Filters
          </button>
          <button className="px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-700">
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
    <th className="px-6 py-4">Requirements</th>
    <th className="px-6 py-4">Size</th>
    <th className="px-6 py-4">Color</th>
    <th className="px-6 py-4">Soft/Hard</th>
    <th className="px-6 py-4">Quantity</th>
    <th className="px-6 py-4">Customer</th>
    <th className="px-6 py-4">Availability</th>
    <th className="px-6 py-4">Action</th>
  </tr>
</thead>
<tbody>
  {orders.map((order, index) => (
    <tr key={index} className="border-t hover:bg-gray-50">
      <td className="px-6 py-4">{order.saleOrderNo}</td>
      <td className="px-6 py-4">{order.article}</td>
      <td className="px-6 py-4">{order.requirements}</td>
      <td className="px-6 py-4">{order.size}</td>
      <td className="px-6 py-4">{order.color}</td>
      <td className="px-6 py-4">{order.softHard}</td>
      <td className="px-6 py-4">{order.quantity}</td>
      <td className="px-6 py-4">{order.customer}</td>
      <td className="px-6 py-4">
        <span
          className={`font-medium ${
            order.availability === "In-stock"
              ? "text-green-600"
              : order.availability === "Low stock"
              ? "text-yellow-600"
              : "text-red-600"
          }`}
        >
          {order.availability}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex gap-3 justify-center items-center">
          <FiEye className="text-green-600 cursor-pointer" />
          <FiTrash2 className="text-red-500 cursor-pointer" />
        </div>
      </td>
    </tr>
  ))}
</tbody>

        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
        <button className="px-4 py-1 border rounded">Previous</button>
        <span>Page 1 of 10</span>
        <button className="px-4 py-1 border rounded">Next</button>
      </div>
    </div>
  );
};

export default Orders;
