import React, { useEffect, useState } from 'react';
import { InventorySummary } from '../../../pages/Dashboard/InventorySummary';
import { SalesSummary } from '../../../pages/Dashboard/SalesSummary';
import { ProductSummary } from '../../../pages/Dashboard/ProductSummary';
import { PreOrdersChart } from '../../../pages/Dashboard/PreOrdersChart';
import { TopSellingStock } from '../../../pages/Dashboard/TopSellingStock';
import { StockAlert } from '../../../pages/Dashboard/StockAlert';
import { SalesChart } from '../../../pages/Dashboard/SalesChart';
import { toast } from 'react-toastify';
import reportService from '../../../api/report.service';
import { useAuth } from '../../../Context/AuthContext';
// import { ProductionSalesChart } from '../ProductionSalesChart';

const data = [
  {
    date: '30/03/25',
    article: '101',
    pendingOrders: 12,
    stockAvailability: 23,
    warehouse: 'Warehouse 01',
  },
  {
    date: '21/04/25',
    article: '301',
    pendingOrders: 15,
    stockAvailability: 54,
    warehouse: 'Warehouse 02',
  },
  {
    date: '19/05/25',
    article: '401',
    pendingOrders: 17,
    stockAvailability: 62,
    warehouse: 'Warehouse 01',
  },
];

const salesData = [
  { month: 'Jan', value: 55000 },
  { month: 'Feb', value: 58000 },
  { month: 'Mar', value: 45000 },
  { month: 'Apr', value: 38000 },
  { month: 'May', value: 42000 },
  { month: 'Jun', value: 28000 },
  { month: 'Jul', value: 55000 },
  { month: 'Aug', value: 45000 },
  { month: 'Sep', value: 45000 },
  { month: 'Oct', value: 35000 },
];

const stockAlerts = [
  { id: '033', name: 'Blue Sneakers', quantity: '60 Cartons', status: 'Low' },
  { id: '304', name: 'Red Sneakers', quantity: '36 Cartons', status: 'Low' },
  {
    id: '322',
    name: 'Green Sneakers',
    quantity: '12 Cartons',
    status: 'Low',
  },
];

const InventorySummaryItem = ({ title, value, color }) => (
  <div className="px-1">
    <p className={`text-sm font-medium ${color}`}>{title}</p>
    <p className="text-base text-gray-700 font-semibold">{value}</p>
  </div>
);

const handlePreOrdersSeeAll = () => {
  console.log('Navigate to detailed pre-orders view');
};

const handleTopStockSeeAll = () => {
  console.log('Navigate to detailed stock view');
};

const handleStockAlertSeeAll = () => {
  console.log('Navigate to detailed alerts view');
};

const ProductionManager_Dashboard = () => {
  const { user } = useAuth();
  const [productionChartData, setProductionChartData] = useState([]);
  useEffect(() => {
    console.log('hii');

    const fetchData = async () => {
      try {
        const res = await reportService.productionChart(user.accessToken);
        console.log('production response', res?.data);
        const formattedProductionData =
          res.data?.map((item) => ({
            month: item.month,
            value: item.totalProduction,
          })) || [];
        setProductionChartData(formattedProductionData);
      } catch (error) {
        toast.error(error.response?.data?.message);
      }
    };
    fetchData();
  }, []);
  return (
    <div className="  min-h-screen bg-meta-2 dark:bg-boxdark-2">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white rounded-lg p-4 text shadow-sm">
          <h2 className="text-gray-800 text-base font-semibold mb-4">
            Inventory
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x">
            <InventorySummaryItem
              title="Cartons Available"
              value="1,114"
              color="text-blue-600"
            />
            <InventorySummaryItem
              title="Today's Production"
              value="124"
              color="text-indigo-700"
            />
            <InventorySummaryItem
              title="Today's Orders"
              value="2,868"
              color="text-orange-500"
            />
            <InventorySummaryItem
              title="Today’s Sale"
              value="1,442"
              color="text-green-600"
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sales Chart - 70% Width */}
          <div className="w-full lg:w-[69%] ">
            <SalesChart
              title="Production Status"
              head="Article Producted"
              data={productionChartData}
            />
          </div>

          {/* PreOrders Chart - 30% Width */}
          <div className="w-full lg:w-[33%] ">
            <StockAlert data={stockAlerts} onSeeAll={handleStockAlertSeeAll} />
          </div>
        </div>

        {/* Tables Section */}
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-[66%] ">
            <div className="p-4 rounded-xl shadow-md bg-white">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Stock Availability</h2>
                <a href="#" className="text-blue-600 text-sm hover:underline">
                  See All
                </a>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full text-sm border-separate border-spacing-y-2">
                  <thead>
                    <tr className="text-left text-gray-500">
                      <th className="px-4 py- rounded-l-lg">Date</th>
                      <th className="px-4 py-2 ">Article</th>
                      <th className="px-4 py-2 ">Pending Orders</th>
                      <th className="px-4 py-2 ">Stock Availability</th>
                      <th className="px-4 py-2  rounded-r-lg">Warehouse</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((row, idx) => (
                      <tr key={idx} className="bg-white shadow-sm rounded-xl">
                        <td className="px-4 py-2">{row.date}</td>
                        <td className="px-4 py-2">{row.article}</td>
                        <td className="px-4 py-2">{row.pendingOrders}</td>
                        <td className="px-4 py-2">{row.stockAvailability}</td>
                        <td className="px-4 py-2">{row.warehouse}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductionManager_Dashboard;
