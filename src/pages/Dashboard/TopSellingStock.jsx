"use client";

export function TopSellingStock({ heading = "Top Selling Stock", data, onSeeAll }) {
  const defaultData = [
    { article: "101", categoryCode: "C-101", color: "Red", quality: "Premium", type: "Sneaker", totalQuantity: 120 },
    { article: "301", categoryCode: "C-301", color: "Blue", quality: "Standard", type: "Loafer", totalQuantity: 85 },
    { article: "401", categoryCode: "C-401", color: "Black", quality: "Premium", type: "Boot", totalQuantity: 62 },
  ];

  const stockData = data && data.length > 0 ? data : defaultData;

  return (
    <div className="bg-white dark:bg-meta-4 rounded-2xl shadow-md border border-gray-200 dark:border-gray-800 overflow-hidden">
      {/* Header */}
      <div className="p-4 flex flex-row items-center justify-between border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{heading}</h3>
        <button
          className="px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-md transition-colors"
          onClick={onSeeAll}
        >
          See All
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {stockData.length > 0 ? (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">Article No.</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">Category Code</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">Color</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">Quality</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">Type</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">Total Quantity</th>
              </tr>
            </thead>
            <tbody>
              {stockData.map((item, index) => (
                <tr
                  key={index}
                  className={`border-b border-gray-100 dark:border-gray-700 ${
                    index % 2 === 0 ? "bg-white dark:bg-meta-4" : "bg-gray-50 dark:bg-gray-800"
                  } hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
                >
                  <td className="py-3 px-4 font-medium text-gray-900 dark:text-gray-100">{item.article}</td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{item.categoryCode}</td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{item.color}</td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{item.quality}</td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{item.type}</td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{item.totalQuantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400 text-sm">
            No stock data available
          </div>
        )}
      </div>
    </div>
  );
}
