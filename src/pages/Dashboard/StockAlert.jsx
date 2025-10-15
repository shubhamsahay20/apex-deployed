'use client';

import React from 'react';

export function StockAlert({ heading = 'Stock Alert', data, onSeeAll }) {
  const defaultData = [
    { id: '033', name: 'Blue Sneakers', quantity: '60 Cartons', status: 'Low' },
    { id: '304', name: 'Red Sneakers', quantity: '36 Cartons', status: 'Low' },
    {
      id: '322',
      name: 'Green Sneakers',
      quantity: '12 Cartons',
      status: 'Low',
    },
  ];

  const alertData = data && data.length > 0 ? data : defaultData;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Critical':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'Out of Stock':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
      default:
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
    }
  };

  return (
    <div className="bg-white dark:bg-meta-4 rounded-2xl shadow-md border border-gray-200 dark:border-gray-800 overflow-hidden">
      {/* Header */}
      <div className="p-4 flex flex-row items-center justify-between border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          {heading}
        </h3>
        {/* <button
          className="px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-md transition-colors"
          onClick={onSeeAll}
        >
          See All
        </button> */}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {alertData.length > 0 ? (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">
                  Article
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">
                  CategoryCode
                </th>{' '}
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">
                  Color
                </th>{' '}
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">
                  Size
                </th>{' '}
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">
                  Quality
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">
                  Type
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">
                  Ordered Quantity
                </th>{' '}
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">
                  Available Quantity
                </th>

                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">
                  Wishlist Quantity
                </th>

                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">
                  Require Quantity
                </th>
              </tr>
            </thead>
            <tbody>
              {alertData.map((item, index) => (
                <tr
                  key={index}
                  className={`border-b border-gray-100 dark:border-gray-700 ${
                    index % 2 === 0
                      ? 'bg-white dark:bg-meta-4'
                      : 'bg-gray-50 dark:bg-gray-800'
                  } hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
                >
                  <td className="py-3 px-4 font-medium text-gray-900 dark:text-gray-100">
                    {item.article}
                  </td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                    {item.categoryCode}
                  </td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                    {item.color}
                  </td>{' '}
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                    {item.size}
                  </td>{' '}
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                    {item.quality}
                  </td>{' '}
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                    {item.type}
                  </td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                    {item.OrderedQuantity}
                  </td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                    {item.availableQty}
                  </td>
                   <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                    {item.WishListQuantity}
                  </td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                    {item.requiredQuantity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400 text-sm">
            No stock alerts available
          </div>
        )}
      </div>
    </div>
  );
}
