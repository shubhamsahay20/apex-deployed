import { useEffect, useState } from 'react';
import { SalesChart } from '../../pages/Dashboard/SalesChart';
import { StockAlert } from '../../pages/Dashboard/StockAlert';
import { TopSellingStock } from '../../pages/Dashboard/TopSellingStock';
import { useAuth } from '../../Context/AuthContext';
import reportService from '../../api/report.service';
import { toast } from 'react-toastify';
import topsellingstockService from '../../api/topsellingstock.service';

function WarehouseDashboard() {
  const [warehouseData, setWarehouseData] = useState([]);
  const [dashboardData, setDashboardData] = useState({});
  const [topStock, setTopStock] = useState([]);

  const { user } = useAuth();
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

  const InventorySummaryItem = ({ title, value, color }) => (
    <div className=" px-1">
      <p className={`text-sm font-medium ${color}`}>{title}</p>
      <p className="text-lg text-gray-700 font-semibold">{value}</p>
    </div>
  );

  // Event handlers for "See All" buttons
  const handlePreOrdersSeeAll = () => {
    console.log('Navigate to detailed pre-orders view');
  };

  const handleTopStockSeeAll = () => {
    console.log('Navigate to detailed stock view');
  };

  const handleStockAlertSeeAll = () => {
    console.log('Navigate to detailed alerts view');
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await reportService.warehouseSummary(user.accessToken);
        console.log('dash ', res.data);

        setDashboardData(res?.data);

        const warehouseres = await reportService.Chart(user.accessToken);
        console.log('Warehouse Data:', warehouseres.data?.warehouseData);

        // Map API data into chart format (adjust fields based on API response)
        const formattedWarehouseData =
          warehouseres.data?.warehouseData.map((item) => ({
            month: item.warehouseName,
            value: item.totalWarehouseStock,
          })) || [];

        setWarehouseData(formattedWarehouseData);

         const topstockResponse = await topsellingstockService.topSellingStock(
                  user.accessToken,
                );
                setTopStock(
                  (topstockResponse.data || []).map((item) => ({
                    article: item.article,
                    categoryCode: item.categoryCode,
                    color: item.color,
                    quality: item.quality,
                    type: item.type,
                    totalQuantity: item.totalQuantity,
                  })),
                );
      } catch (error) {
        toast.error(error.response?.data?.message);
      }
    })();
  }, [user]);

  return (
    <div className="  min-h-screen bg-meta-2 dark:bg-boxdark-2">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white rounded-lg p-4 text shadow-sm">
          <h2 className="text-gray-800 text-base font-semibold mb-4">
            Warehouse Management
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x">
            <InventorySummaryItem
              title="Total Stock"
              value={dashboardData.totalStock}
              color="text-blue-600"
            />
            <InventorySummaryItem
              title="Total Deliverd"
              value={dashboardData.totalDeliverables}
              color="text-indigo-700"
            />
            <InventorySummaryItem
              title="Total Warehouses"
              value={dashboardData.totalWarehouses}
              color="text-orange-500"
            />
            <InventorySummaryItem
              title="Total Manager"
              value={dashboardData.NumberofWarehousesManager}
              color="text-green-600"
            />
          </div>
        </div>

        {/* Charts Section */}
        <div className="flex flex-row  gap-6">
          <div className="flex flex-col  gap-6">
            {/* Sales Chart - 70% Width */}
            <div className="w-full lg:w-full ">
              <SalesChart data={warehouseData} title={'Warehouse Management'} />
            </div>

            <div className="flex lg:flex-row gap-6">
              <div className="w-full lg-full ">
                <TopSellingStock
                  data={topStock}
                  onSeeAll={handleTopStockSeeAll}
                  heading={'Inventory Management'}
                />
              </div>
            </div>
          </div>
          {/* PreOrders Chart - 30% Width */}
         <div className="w-full lg:w-1/2">
            <StockAlert data={stockAlerts} onSeeAll={handleStockAlertSeeAll} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default WarehouseDashboard;
