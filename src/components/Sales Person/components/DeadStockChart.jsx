import React from "react";
import ReactApexChart from "react-apexcharts";
import { FaFilter } from "react-icons/fa";
import { CiCalendarDate } from "react-icons/ci";

function DeadStockChart() {
  const options = {
    chart: { type: "bar", stacked: false, toolbar: { show: false } },
    colors: ["#D9D9D9", "#FF2D2D"],
    plotOptions: {
      bar: { horizontal: false, columnWidth: "40%", borderRadius: 4 },
    },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 2, colors: ["transparent"] },
    xaxis: {
      categories: [
        "Jan", "Feb", "Mar", "Apr", "May", "June",
        "July", "Aug", "Sept", "Oct", "Nov", "Dec",
      ],
      labels: { style: { colors: "#1E1B49", fontSize: "12px" } },
    },
    yaxis: {
      labels: {
        formatter: (val) => Math.round(val),
        style: { colors: "#1E1B49" },
      },
    },
    grid: { strokeDashArray: 4 },
    tooltip: {
      y: { formatter: (val) => `${val.toLocaleString()}` },
    },
    legend: { show: false },
  };

  const series = [
    {
      name: "Total Sales",
      data: [17345, 26435, 14783, 10671, 8563, 24783, 22354, 12656, 22656, 28600, 5454, 18454],
    },
    {
      name: "Dead Stock",
      data: [11000, 19000, 10000, 8000, 5000, 14000, 11000, 9000, 12000, 24000, 3000, 9000],
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-4 w-full mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>
          <span className="text-md font-semibold text-[#1E1B49]">Dead Stock</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <CiCalendarDate className="text-lg" />
          <button className="flex items-center gap-1 border border-gray-300 rounded-md px-2 py-1">
            <FaFilter className="text-xs" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      <div className="mb-2">
        <h2 className="text-2xl font-bold text-[#1E1B49]">4,45,646</h2>
        <p className="text-sm text-gray-500">Total Dead Stock</p>
      </div>

      <div className="flex gap-4 items-center text-sm mb-2">
        <div className="flex items-center gap-1">
          <div className="w-4 h-3 bg-gray-300 rounded-sm" />
          <span>Total Sales</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-3 bg-[#FF2D2D] rounded-sm" />
          <span>Dead Stock</span>
        </div>
      </div>

      <ReactApexChart options={options} series={series} type="bar" height={250} />
    </div>
  );
}

export default DeadStockChart;


