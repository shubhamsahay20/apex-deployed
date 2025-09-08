import React from 'react';
import ReactApexChart from 'react-apexcharts';

export function SalesChart({ data, title, head, unit = '' }) {
  const defaultData = [
    { month: 'Feb', value: 55000 },
    { month: 'Mar', value: 58000 },
    { month: 'Apr', value: 45000 },
    { month: 'May', value: 38000 },
    { month: 'Jun', value: 42000 },
    { month: 'Jul', value: 28000 },
    { month: 'Aug', value: 55000 },
    { month: 'Sep', value: 45000 },
    { month: 'Oct', value: 35000 },
  ];

  const salesData = data && data.length > 0 ? data : defaultData;

  // Dynamic Y-axis range
  const values = salesData.map((d) => d.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);

  const yMin = minValue > 0 ? 0 : minValue;
  const yMax = maxValue > 0 ? maxValue + Math.round(maxValue * 0.2) : 100;

  const chartData = {
    series: [
      {
        name: head || 'Data',
        data: salesData.map((d) => d.value),
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
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent'],
      },
      xaxis: {
        categories: salesData.map((d) => d.month),
      },
      yaxis: {
        min: yMin,
        max: yMax,
        tickAmount: 5,
        title: { text: unit },
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
          formatter: (val) =>
            unit ? `${val.toLocaleString()} ${unit}` : val.toLocaleString(),
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
          <div className="px-2 py-1 text-xs border border-gray-300 rounded-md text-gray-600">
            Monthly
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
