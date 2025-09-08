"use client"

export function TopSellingStock({ heading, data, onSeeAll }) {
  const defaultData = [
    { articleNo: "101", soldQty: 30, remainingQty: 12, opportunityLoss: 6, stockAvailability: 23 },
    { articleNo: "301", soldQty: 21, remainingQty: 15, opportunityLoss: 23, stockAvailability: 54 },
    { articleNo: "401", soldQty: 19, remainingQty: 17, opportunityLoss: 9, stockAvailability: 62 },
  ]

  const stockData = data || defaultData

  return (
    <div className="bg-white dark:bg-meta-4  h-full rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
      <div className="p-6 flex flex-row items-center justify-between">
        <h3 className="text-lg font-medium text-gray-700">Top Selling Stock</h3>
        <button
          className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
          onClick={onSeeAll}
        >
          See All
        </button>
      </div>
      <div className="px-6 pb-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 text-sm font-medium text-gray-600">Article No.</th>
                <th className="text-left py-3 text-sm font-medium text-gray-600">Sold Quantity</th>
                <th className="text-left py-3 text-sm font-medium text-gray-600">Remaining Quantity</th>
                <th className="text-left py-3 text-sm font-medium text-gray-600">Opportunity Loss</th>
                <th className="text-left py-3 text-sm font-medium text-gray-600">Stock Availability</th>
              </tr>
            </thead>
            <tbody>
              {stockData.map((item, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 text-sm font-medium text-gray-900">{item.articleNo}</td>
                  <td className="py-3 text-sm text-gray-900">{item.soldQty}</td>
                  <td className="py-3 text-sm text-gray-900">{item.remainingQty}</td>
                  <td className="py-3 text-sm text-gray-900">{item.opportunityLoss}</td>
                  <td className="py-3 text-sm text-gray-900">{item.stockAvailability}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
