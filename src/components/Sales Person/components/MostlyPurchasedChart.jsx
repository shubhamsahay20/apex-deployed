import React from "react";
import ReactApexChart from "react-apexcharts";
import { FaFilter } from "react-icons/fa";
import { BsCalendar } from "react-icons/bs";
import { CiCalendarDate } from "react-icons/ci";

export function MostlyPurchasedChart() {
  const chartOptions = {
    chart: {
      type: "bar",
      stacked: false,
      toolbar: { show: false },
    },
    colors: ["#D9D9D9", "#0CAF60"],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "35%",
        borderRadius: 4,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: [
        "Jan", "Feb", "Mar", "Apr", "May", "June",
        "July", "Aug", "Sept", "Oct", "Nov", "Dec"
      ],
      labels: {
        style: {
          colors: "#1E1B49",
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      labels: {
        formatter: function (val) {
          return Math.round(val);
        },
        style: {
          colors: "#1E1B49",
        },
      },
    },
    legend: {
      show: false,
    },
    grid: {
      show: true,
      strokeDashArray: 4,
    },
    tooltip: {
      y: {
        formatter: (val) => `${val.toLocaleString()}`,
      },
    },
  };

  const series = [
    {
      name: "Total Sales",
      data: [47345, 56435, 44783, 30671, 28563, 54783, 52354, 32656, 52656, 58600, 23454, 48454],
    },
    {
      name: "Most Selling Product",
      data: [39000, 56435, 38000, 20000, 18000, 32000, 30000, 22000, 32000, 52000, 16000, 36000],
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-4 w-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>
          <span className="text-md font-semibold text-[#1E1B49]">Mostly Purchased</span>
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
        <h2 className="text-2xl font-bold text-[#1E1B49]">12,56,686
          <span className="text-green-600 text-sm font-semibold ml-2">↑ 24%</span>
        </h2>
        <p className="text-sm text-gray-500">Growth In 2024</p>
      </div>

      <div className="flex gap-4 items-center text-sm mb-2">
        <div className="flex items-center gap-1">
          <div className="w-4 h-3 bg-gray-300 rounded-sm" />
          <span>Total Sales</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-3 bg-[#0CAF60] rounded-sm" />
          <span>Most Selling Product</span>
        </div>
        <span className="ml-auto text-blue-500 font-medium text-xs">LIVE</span>
      </div>

      <ReactApexChart options={chartOptions} series={series} type="bar" height={250} />
    </div>
  );
}
