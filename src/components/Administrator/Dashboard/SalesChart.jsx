import React from 'react';
import ReactApexChart from 'react-apexcharts';

export function SalesChart({ data, title, head }) {
  // Use API data directly
  const salesData = Array.isArray(data) ? data : [];

  const chartData = {
    series: [
      {
        name: 'Stock',
        data: salesData.map((d) => d.value), // ✅ values
      },
    ],
    options: {
      chart: {
        type: 'bar',
        height: 350,
        toolbar: { show: false },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '25%',
          borderRadius: 5,
          borderRadiusApplication: 'end',
          borderRadiusWhenStacked: 'last',
        },
      },
      dataLabels: { enabled: false },
      stroke: { show: true, width: 2, colors: ['transparent'] },
      xaxis: {
  categories: salesData.map((d) => String(d.month)),
  labels: {
    rotate: -45,
    trim: false,
    style: {
      fontSize: "12px",
      colors: "#333"
    }
  },
},

      yaxis: {
        title: { text: 'Total Stock' },
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          type: 'vertical',
          shadeIntensity: 0.5,
          gradientToColors: ['#69CFFF', '#59D3FF'],
          inverseColors: false,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 48, 100],
          colorStops: [
            { offset: 0, color: '#048FC6', opacity: 1 },
            { offset: 48, color: '#69CFFF', opacity: 1 },
            { offset: 100, color: '#59D3FF', opacity: 1 },
          ],
        },
      },
      tooltip: {
        y: {
          formatter: (val) => val.toLocaleString(),
        },
      },
    },
  };

  return (
    <div className="bg-white dark:bg-meta-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
      <div className="p-6 flex flex-row items-center justify-between">
        <h3 className="text-lg font-medium text-gray-700">{title}</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{
                background:
                  'linear-gradient(180deg, #048FC6 0%, #69CFFF 48%, #59D3FF 100%)',
              }}
            ></div>
            <span className="text-sm text-gray-600">{head}</span>
          </div>
        </div>
      </div>
      <div className="px-6 pb-6">
        <ReactApexChart
          options={chartData.options}
          series={chartData.series}
          type="bar"
          height={350}
        />
      </div>
    </div>
  );
}
