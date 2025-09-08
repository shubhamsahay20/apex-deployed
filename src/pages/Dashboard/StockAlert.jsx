import React from "react";
import SampleImage from "../../images/icon/shoes.png";

// You can replace these with actual images or icons
const PackageIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
    />
  </svg>
);

export function StockAlert({ data, onSeeAll }) {
  const defaultData = [
    {
      id: "033",
      name: "Blue Sneakers",
      quantity: "60 Cartons",
      status: "Low",
    },
    {
      id: "304",
      name: "Red Sneakers",
      quantity: "36 Cartons",
      status: "Low",
    },
    {
      id: "322",
      name: "Green Sneakers",
      quantity: "12 Cartons",
      status: "Low",
    },
  ];

  const alertData = data || defaultData;

  const getStatusColor = (status) => {
    switch (status) {
      case "Critical":
        return "bg-red-100 text-red-700";
      case "Out of Stock":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-red-100 text-red-700";
    }
  };

  const getIconColor = (index) => {
    const colors = ["from-blue-400 to-blue-600", "from-red-400 to-red-600", "from-green-400 to-green-600"];
    return colors[index % colors.length];
  };

  return (
    <div className="bg-white dark:bg-meta-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
      <div className="p-6 flex flex-row items-center justify-between">
        <h3 className="text-lg font-medium text-gray-700">Stock Alert</h3>
        <button
          className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
          onClick={onSeeAll}
        >
          See All
        </button>
      </div>
      <div className="px-6 pb-6">
        <div className="space-y-4">
          {alertData.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <img
                  src={SampleImage}
                  alt={item.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex flex-col">
                  <div className="font-medium text-gray-900">{item.id}</div>
                  <div className="text-sm text-gray-500">Remaining Quantity : {item.quantity}</div>
                </div>
              </div>

              <div className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(item.status)}`}>
                {item.status}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
