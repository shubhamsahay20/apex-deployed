import React from "react";
import ReactApexChart from "react-apexcharts";
import { FiFilter } from "react-icons/fi";
import { CiCalendarDate } from "react-icons/ci";

export function SalesAnalytics() {
  const chartData = {
    series: [
      {
        name: "Dead Stock",
        data: [1.2, 2.1, 2, 0.4, 1.1, 0.2],
      },
      {
        name: "Actual Sales",
        data: [1.1, 2.2, 1.3, 1.5, 1.7, 1],
      },
      {
        name: "Expected Sales",
        data: [1.5, 1, 1.4, 0.8, 1.3, 0.6],
      },
    ],
    options: {
      chart: {
        type: "bar",
        stacked: true,
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "40%",
          borderRadius: 5,
        },
      },
      legend: {
        position: "top",
        horizontalAlign: "left",
        fontSize: "13px",
        markers: {
          radius: 10,
        },
      },
      colors: ["#007BFF", "#4DB4FF", "#C7EAFF"],
      xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "June"],
        labels: {
          style: {
            fontSize: "13px",
            colors: "#1f2937",
          },
        },
      },
      yaxis: {
        labels: {
          formatter: (val) => `${val}cr`,
          style: {
            fontSize: "13px",
            colors: "#6b7280",
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      tooltip: {
        y: {
          formatter: (val) => `${val} cr`,
        },
      },
      grid: {
        strokeDashArray: 5,
        borderColor: "#e5e7eb",
      },
      fill: {
        opacity: 1,
      },
    },
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-blue-500 rounded-full"></span>
          <h3 className="text-base font-semibold text-gray-800">Sales Analytics</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-gray-100 border border-gray-200 rounded-md flex items-center justify-center">
            <CiCalendarDate className="text-gray-600 text-lg" />
          </div>
          <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 font-medium">
            <FiFilter className="text-sm" />
            Filter
          </button>
        </div>
      </div>
      <ReactApexChart
        options={chartData.options}
        series={chartData.series}
        type="bar"
        height={350}
      />
    </div>
  );
}
