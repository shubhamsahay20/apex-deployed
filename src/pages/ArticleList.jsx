import React, { useState } from "react";
import InventoryCards from "./InventoryCards.jsx";

const inventoryData = [
  { date: "11/12/22", article: "301", size: "6X10", color: "BK", softHard: "S/H", ab: "A/B", quantity: 20, warehouse: "Warehouse 01", availability: "In-stock" },
  { date: "21/12/22", article: "302", size: "6X10", color: "BK", softHard: "S/H", ab: "A", quantity: 45, warehouse: "Warehouse 01", availability: "Out of stock" },
  { date: "5/12/22", article: "301", size: "8X10", color: "BK", softHard: "S/H", ab: "B", quantity: 84, warehouse: "Warehouse 02", availability: "In-stock" },
  { date: "8/12/22", article: "333", size: "6X10", color: "BK", softHard: "H", ab: "B", quantity: 226, warehouse: "Warehouse 03", availability: "Out of stock" },
  { date: "9/1/23", article: "301", size: "6X9", color: "BK", softHard: "S/H", ab: "B", quantity: 28, warehouse: "Warehouse 01", availability: "In-stock" },
  { date: "9/1/23", article: "436", size: "6X10", color: "BK", softHard: "S", ab: "B", quantity: 76, warehouse: "Warehouse 04", availability: "In-stock" },
  { date: "15/12/23", article: "301", size: "7X9", color: "BK", softHard: "S/H", ab: "A", quantity: 34, warehouse: "Warehouse 05", availability: "Out of stock" },
  { date: "6/6/23", article: "542", size: "5X12", color: "BK", softHard: "H", ab: "A", quantity: 89, warehouse: "Warehouse 04", availability: "In-stock" },
  { date: "11/11/22", article: "698", size: "6X10", color: "BK", softHard: "S/H", ab: "A", quantity: 10, warehouse: "Warehouse 06", availability: "Low stock" },
];
const cards = [
    { label: "Cartons Available", value: "1,114", color: "text-blue-600" },
    { label: "Today's Production", value: "124", color: "text-indigo-600" },
    { label: "Today's Orders", value: "2,868", color: "text-orange-500" },
    { label: "Today's Sale", value: "1,442", color: "text-green-600" },
];

const ArticleList = () => {
  return (
    <div className="p-4 space-y-6 bg-gray-100 min-h-screen">
      {/* Inventory Heading */}
      <h2 className="text-lg font-semibold text-gray-800">Inventory</h2>

      {/* Inventory Cards */}
      {/* <InventoryCards /> */}
       <InventoryCards cards={cards} />

      {/* Articles List Table */}
      <div className="bg-white p-4 rounded-md shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-700">Articles List</h3>
          <div className="flex items-center gap-2">
            <input type="text" placeholder="Search Article, order" className="text-sm px-3 py-1.5 border rounded-md" />
            <button className="text-sm border px-3 py-1.5 rounded-md">Today</button>
            <button className="text-sm border px-3 py-1.5 rounded-md">Export</button>
          </div>
        </div>

        <div className="overflow-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b text-gray-600">
                <th className="p-2">Date</th>
                <th>Article</th>
                <th>Size</th>
                <th>Color</th>
                <th>Soft/Hard</th>
                <th>A/B</th>
                <th>Quantity</th>
                <th>Warehouse</th>
                <th>Availability</th>
              </tr>
            </thead>
            <tbody>
              {inventoryData.map((row, idx) => (
                <tr key={idx} className="border-t hover:bg-gray-50">
                  <td className="p-2">{row.date}</td>
                  <td>{row.article}</td>
                  <td>{row.size}</td>
                  <td className="font-semibold">{row.color}</td>
                  <td>{row.softHard}</td>
                  <td>{row.ab}</td>
                  <td>{row.quantity}</td>
                  <td className="text-blue-600 font-medium">{row.warehouse}</td>
                  <td className={
                    row.availability === "In-stock" ? "text-green-600" :
                    row.availability === "Out of stock" ? "text-red-500" :
                    "text-yellow-500"
                  }>
                    {row.availability}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <button className="text-sm border px-4 py-1.5 rounded">Previous</button>
          <span className="text-xs text-gray-500">Page 1 of 10</span>
          <button className="text-sm border px-4 py-1.5 rounded">Next</button>
        </div>
      </div>
    </div>
  );
};

export default ArticleList;
