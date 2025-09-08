"use client"

export function PreOrdersChart({ data, onSeeAll }) {
  const defaultData = [
    { month: "Jan", value: 4000 },
    { month: "Feb", value: 2000 },
    { month: "Mar", value: 3000 },
    { month: "Apr", value: 2500 },
    { month: "May", value: 2200 },
  ]

  const preOrderData = data || defaultData

  // Generate SVG path points based on data
  const generatePath = () => {
    const width = 400
    const height = 200
    const maxValue = Math.max(...preOrderData.map((d) => d.value))
    const minValue = Math.min(...preOrderData.map((d) => d.value))
    const range = maxValue - minValue || 1

    return preOrderData
      .map((point, index) => {
        const x = (index / (preOrderData.length - 1)) * width
        const y = height - ((point.value - minValue) / range) * (height - 40) - 20
        return `${x},${y}`
      })
      .join(" ")
  }

  const pathPoints = generatePath()

  return (
    <div className="bg-white dark:bg-meta-4  h-full rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
      <div className="p-6 flex flex-row items-center justify-between">
        <h3 className="text-lg font-medium text-gray-700">Pre-Orders Data</h3>
        <button
          className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
          onClick={onSeeAll}
        >
          See All
        </button>
      </div>
      <div className="px-6 pt-10">
        <div className="h-64 relative">
          <svg className="w-full h-full" viewBox="0 0 400 200">
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#1d4ed8" stopOpacity="1" />
              </linearGradient>
            </defs>
            <polyline
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={pathPoints}
            />
            {preOrderData.map((point, index) => {
              const x = (index / (preOrderData.length - 1)) * 400
              const maxValue = Math.max(...preOrderData.map((d) => d.value))
              const minValue = Math.min(...preOrderData.map((d) => d.value))
              const range = maxValue - minValue || 1
              const y = 200 - ((point.value - minValue) / range) * 160 - 20

              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r="4"
                  fill="#3b82f6"
                  className="hover:r-6 transition-all duration-200 cursor-pointer"
                >
                  <title>{`${point.month}: ${point.value.toLocaleString()}`}</title>
                </circle>
              )
            })}
          </svg>
          <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 px-2">
            {preOrderData.map((point, index) => (
              <span key={index}>{point.month}</span>
            ))}
          </div>
          <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-gray-400">
            <span>4000</span>
            <span>3000</span>
            <span>2000</span>
            <span>1000</span>
            <span>0</span>
          </div>
        </div>
      </div>
    </div>
  )
}
