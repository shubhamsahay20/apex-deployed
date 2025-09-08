import { useEffect, useState } from 'react';
import { useAuth } from '../../../../Context/AuthContext';
import { SalesChart } from '../../../../pages/Dashboard/SalesChart';
import { StockAlert } from '../../../../pages/Dashboard/StockAlert';
import { TopSellingStock } from '../../../../pages/Dashboard/TopSellingStock';
import reportService from '../../../../api/report.service';
import { toast } from 'react-toastify';

function InventoryDashboard() {
  const { user } = useAuth();
  const [inventoryData, setInventoryData] = useState({});
  const [inventoryChartData, setInventoryChartData] = useState([]);

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

  const topSellingStock = [
    {
      articleNo: '101',
      soldQty: 30,
      remainingQty: 12,
      opportunityLoss: 6,
      stockAvailability: 23,
    },
    {
      articleNo: '301',
      soldQty: 21,
      remainingQty: 15,
      opportunityLoss: 23,
      stockAvailability: 54,
    },
    {
      articleNo: '401',
      soldQty: 19,
      remainingQty: 17,
      opportunityLoss: 9,
      stockAvailability: 62,
    },
  ];

  const stockAlerts = [
    { id: '033', name: 'Blue Sneakers', quantity: '60 Cartons', status: 'Low' },
    { id: '304', name: 'Red Sneakers', quantity: '36 Cartons', status: 'Low' },
    { id: '304', name: 'Red Sneakers', quantity: '36 Cartons', status: 'Low' },
    { id: '304', name: 'Red Sneakers', quantity: '36 Cartons', status: 'Low' },
    { id: '304', name: 'Red Sneakers', quantity: '36 Cartons', status: 'Low' },
    { id: '304', name: 'Red Sneakers', quantity: '36 Cartons', status: 'Low' },
    {
      id: '322',
      name: 'Green Sneakers',
      quantity: '12 Cartons',
      status: 'Low',
    },
  ];

  const InventorySummaryItem = ({ title, value, color }) => (
    <div className=" px-1">
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

  useEffect(() => {
    (async () => {
      try {
        const inventoryres = await reportService.Chart(user.accessToken);
        console.log('Warehouse Data:', inventoryres.data?.warehouseData);

        // Map API data into chart format (adjust fields based on API response)
        const formattedWarehouseData =
          inventoryres.data?.warehouseData.map((item) => ({
            month: item.warehouseName,
            value: item.totalWarehouseStock,
          })) || [];

        setInventoryChartData(formattedWarehouseData);
      } catch (error) {
        toast.error(error.response?.data?.message);
      }
    })();
  }, [user]);

  useEffect(() => {
    try {
      const fetchData = async () => {
        const res = await reportService.inventorySummary(user.accessToken);
        console.log('inventory', res.data);
        setInventoryData(res?.data);

        const inventoryres = await reportService.Chart(user.accessToken);
        console.log('Warehouse Data:', inventoryres.data?.warehouseData);

        const formattedWarehouseData =
          inventoryres.data?.warehouseData.map((item) => ({
            month: item.warehouseName,
            value: item.totalWarehouseStock,
          })) || [];

        setInventoryChartData(formattedWarehouseData);
      };

      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  }, [user]);

  return (
    <div className="  min-h-screen bg-meta-2 dark:bg-boxdark-2">
      <div className="max-w-7xl mx-auto space-y-6">
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
              title="Total Number of Approved Qunatity"
              value={inventoryData?.totalQuantity}
              color="text-indigo-700"
            />
            <InventorySummaryItem
              title=" Total Order Till date"
              value={inventoryData?.totalOrder}
              color="text-orange-500"
            />
            <InventorySummaryItem
              title="Total Stock Delivered Till Dat "
              value={inventoryData?.deliverables}
              color="text-green-600"
            />
          </div>
        </div>

        {/* Charts Section */}
        <div className="flex flex-row  gap-6">
          <div className="flex flex-col  gap-6">
            {/* Sales Chart - 70% Width */}
            <div className="w-full lg:w-[100%] ">
              <SalesChart data={inventoryChartData} title={'Inventory Management'} />
            </div>

            <div className="flex lg:flex-row gap-6">
              <div className="w-full lg:w-[100%] ">
                <TopSellingStock
                  data={topSellingStock}
                  onSeeAll={handleTopStockSeeAll}
                />
              </div>
            </div>
          </div>
          {/* PreOrders Chart - 30% Width */}
          <div className="w-full lg:w-[40%] ">
            <StockAlert data={stockAlerts} onSeeAll={handleStockAlertSeeAll} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default InventoryDashboard;
