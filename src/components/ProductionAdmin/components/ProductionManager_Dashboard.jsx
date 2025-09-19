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
import topsellingstockService from '../../../api/topsellingstock.service'; 

// const data = [
//   {
//     date: '30/03/25',
//     article: '101',
//     pendingOrders: 12,
//     stockAvailability: 23,
//     warehouse: 'Warehouse 01',
//   },
//   {
//     date: '21/04/25',
//     article: '301',
//     pendingOrders: 15,
//     stockAvailability: 54,
//     warehouse: 'Warehouse 02',
//   },
//   {
//     date: '19/05/25',
//     article: '401',
//     pendingOrders: 17,
//     stockAvailability: 62,
//     warehouse: 'Warehouse 01',
//   },
// ];

const InventorySummaryItem = ({ title, value, color }) => (
  <div className="px-1">
    <p className={`text-sm font-medium ${color}`}>{title}</p>
    <p className="text-base text-gray-700 font-semibold">{value}</p>
  </div>
);

const handleStockAlertSeeAll = () => {
  console.log('Navigate to detailed alerts view');
};

const ProductionManager_Dashboard = () => {
  const { user } = useAuth();
  const [productionChartData, setProductionChartData] = useState([]);
  const [lowStock, setLowStock] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ✅ Production Chart Data
        const res = await reportService.productionChart(user.accessToken);
        const formattedProductionData =
          res.data?.map((item) => ({
            month: item.month,
            value: item.totalProduction,
          })) || [];
        setProductionChartData(formattedProductionData);

        // ✅ Low Stock Data
        const lowStockRes = await topsellingstockService.lowStock(user.accessToken);
        setLowStock(
          (lowStockRes.data || []).map((item) => ({
            article: item.article,
            categoryCode: item.categoryCode,
            color: item.color,
            quality: item.quality,
            type: item.type,
            size: item.size,
            availableQty: item.availableQty,
            orderedQty: item.orderedQty,
          }))
        );
      } catch (error) {
        toast.error(error.response?.data?.message || 'Error fetching data');
      }
    };
    fetchData();
  }, [user.accessToken]);

  return (
    <div className="min-h-screen bg-meta-2 dark:bg-boxdark-2">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Inventory Summary */}
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

        {/* Production Chart */}
        <div className="w-full">
          <SalesChart
            title="Production Status"
            head="Article Producted"
            data={productionChartData}
          />
        </div>

        {/* Stock Availability */}
        {/* <div className="w-full">
          <div className="p-4 rounded-xl shadow-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Stock Availability</h2>
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
        </div> */}

        {/* Stock Alerts */}
        <div className="w-full">
          <StockAlert data={lowStock} onSeeAll={handleStockAlertSeeAll} />
        </div>
      </div>
    </div>
  );
};

export default ProductionManager_Dashboard;
