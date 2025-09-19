import { useEffect, useState } from 'react';
import { useAuth } from '../../../../Context/AuthContext';
import { SalesChart } from '../../../../pages/Dashboard/SalesChart';
import { StockAlert } from '../../../../pages/Dashboard/StockAlert';
import { TopSellingStock } from '../../../../pages/Dashboard/TopSellingStock';
import reportService from '../../../../api/report.service';
import topsellingstockService from '../../../../api/topsellingstock.service';
import { toast } from 'react-toastify';

function InventoryDashboard() {
  const { user } = useAuth();
  const [inventoryData, setInventoryData] = useState({});
  const [inventoryChartData, setInventoryChartData] = useState([]);
  const [topStock, setTopStock] = useState([]);
  const [lowStock, setLowStock] = useState([]);

  const InventorySummaryItem = ({ title, value, color }) => (
    <div className="px-1">
      <p className={`text-sm font-medium ${color}`}>{title}</p>
      <p className="text-lg text-gray-700 font-semibold">{value}</p>
    </div>
  );

  const handleTopStockSeeAll = () => {
    console.log('Navigate to detailed stock view');
  };

  const handleStockAlertSeeAll = () => {
    console.log('Navigate to detailed alerts view');
  };

  // Fetch Inventory Chart & Summary
  useEffect(() => {
    const fetchInventoryData = async () => {
      try {
        const res = await reportService.inventorySummary(user.accessToken);
        setInventoryData(res?.data);

        const chartRes = await reportService.Chart(user.accessToken);
        const formattedWarehouseData =
          chartRes.data?.warehouseData.map((item) => ({
            month: item.warehouseName,
            value: item.totalWarehouseStock,
          })) || [];

        setInventoryChartData(formattedWarehouseData);
      } catch (error) {
        toast.error(error.response?.data?.message);
      }
    };

    fetchInventoryData();
  }, [user]);

  // Fetch Top Selling & Low Stock
  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const topRes = await topsellingstockService.topSellingStock(user.accessToken);
        setTopStock(
          (topRes.data || []).map((item) => ({
            article: item.article,
            categoryCode: item.categoryCode,
            color: item.color,
            quality: item.quality,
            type: item.type,
            totalQuantity: item.totalQuantity,
          }))
        );

        const lowRes = await topsellingstockService.lowStock(user.accessToken);
        setLowStock(
          (lowRes.data || []).map((item) => ({
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
        console.error("Error fetching stock data:", error);
        toast.error(error.response?.data?.message);
      }
    };

    fetchStockData();
  }, [user]);

  return (
    <div className="min-h-screen bg-meta-2 dark:bg-boxdark-2">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Summary */}
        <div className="bg-white rounded-lg p-4 text shadow-sm">
          <h2 className="text-gray-800 text-base font-semibold mb-4">
            Inventory
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x">
            <InventorySummaryItem
              title="Available Stock"
              value={inventoryData?.totalStock}
              color="text-blue-600"
            />
            <InventorySummaryItem
              title="Total Number of Approved Quantity"
              value={inventoryData?.totalQuantity}
              color="text-indigo-700"
            />
            <InventorySummaryItem
              title="Total Order Till Date"
              value={inventoryData?.totalOrder}
              color="text-orange-500"
            />
            <InventorySummaryItem
              title="Total Stock Delivered Till Date"
              value={inventoryData?.deliverables}
              color="text-green-600"
            />
          </div>
        </div>

        {/* Charts */}
        <div className="w-full">
          <SalesChart
            data={inventoryChartData}
            title={'Inventory Management'}
          />
        </div>

        {/* Top Selling Stock */}
        <div className="w-full">
          <TopSellingStock data={topStock} onSeeAll={handleTopStockSeeAll} />
        </div>

        {/* Stock Alerts (Full Width, Below Top Selling) */}
        <div className="w-full">
          <StockAlert data={lowStock} onSeeAll={handleStockAlertSeeAll} />
        </div>
      </div>
    </div>
  );
}

export default InventoryDashboard;
