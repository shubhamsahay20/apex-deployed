import React from "react";          

const StockAvailability = () => {
  const data = [
    { date: "30/03/25", name: "101", pendingOrders: 12, stock: 23 },
    { date: "21/04/25", name: "301", pendingOrders: 15, stock: 54 },
    { date: "19/05/25", name: "401", pendingOrders: 17, stock: 62 },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Stock Availability</h2>
        <a href="#" className="text-sm text-blue-600 font-medium hover:underline">
          See All
        </a>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead>
            <tr className="text-gray-500">
              <th className="py-2 px-4">Date</th>
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Pending Orders</th>
              <th className="py-2 px-4">Stock Availability</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="border-t">
                <td className="py-2 px-4">{item.date}</td>
                <td className="py-2 px-4">{item.name}</td>
                <td className="py-2 px-4">{item.pendingOrders}</td>
                <td className="py-2 px-4">{item.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockAvailability;
