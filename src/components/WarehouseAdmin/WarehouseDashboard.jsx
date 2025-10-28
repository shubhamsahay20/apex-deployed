import { useEffect, useState } from 'react';
import { SalesChart } from '../../pages/Dashboard/SalesChart';
import { StockAlert } from '../../pages/Dashboard/StockAlert';
import { TopSellingStock } from '../../pages/Dashboard/TopSellingStock';
import { useAuth } from '../../Context/AuthContext';
import reportService from '../../api/report.service';
import { toast } from 'react-toastify';
import topsellingstockService from '../../api/topsellingstock.service';
import Loader from '../../common/Loader';

function WarehouseDashboard() {
  const [warehouseData, setWarehouseData] = useState([]);
  const [dashboardData, setDashboardData] = useState({});
  const [topStock, setTopStock] = useState([]);
  const [lowStock, setLowStock] = useState([]); // ✅ added lowStock state
  const [loading, setLoading] = useState(false);

  const [lowStockCurrentPage, setLowStockCurrentPage] = useState(1);
  const [lowStockTotalPages, setLowStockTotalPages] = useState(1);
  const [topStockCurrentPage, setTopStockCurrentPage] = useState(1);
  const [topStockTotalPages, setTopStockTotalPages] = useState(1);

  const { user } = useAuth();

  const InventorySummaryItem = ({ title, value, color }) => (
    <div className=" px-1">
      <p className={`text-sm font-medium ${color}`}>{title}</p>
      <p className="text-lg text-gray-700 font-semibold">{value}</p>
    </div>
  );

  // Event handlers for "See All" buttons
  const handleTopStockSeeAll = () => {
    console.log('Navigate to detailed stock view');
  };

  const handleStockAlertSeeAll = () => {
    console.log('Navigate to detailed alerts view');
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await reportService.warehouseSummary(user.accessToken);
        setDashboardData(res?.data);

        const warehouseres = await reportService.Chart(user.accessToken);
        const formattedWarehouseData =
          warehouseres.data?.warehouseData.map((item) => ({
            month: item.warehouseName,
            value: item.totalWarehouseStock,
          })) || [];

        setWarehouseData(formattedWarehouseData);

        const topstockResponse = await topsellingstockService.topSellingStock(
          user.accessToken,
          topStockCurrentPage,
          5,
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

        setTopStockTotalPages(topstockResponse.pagination.totalPages);

        // ✅ fetch low stock here
        const lowStockResponse = await topsellingstockService.lowStock(
          user.accessToken,
          lowStockCurrentPage,
          3,
        );
        setLowStock(
          (lowStockResponse.data || []).map((item) => ({
            article: item.article,
            categoryCode: item.categoryCode,
            color: item.color,
            quality: item.quality,
            type: item.type,
            size: item.size,
            availableQty: item.availableQty,
            WishListQuantity: item.WishListQuantity,
            OrderedQuantity: item.OrderedQuantity,
            requiredQuantity: item.requiredQuantity,
          })),
        );
        setLowStockTotalPages(lowStockResponse.pagination.pages);
      } catch (error) {
        toast.error(error.response?.data?.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [user, lowStockCurrentPage, topStockCurrentPage]);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-meta-2 dark:bg-boxdark-2">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* ✅ Warehouse Summary */}
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
              title="Active Warehouses Delivered"
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

        {/* ✅ Charts + Top Selling */}
        <div className="flex flex-col gap-6">
          <div className="w-full">
            <SalesChart data={warehouseData} title={'Warehouse Management'} />
          </div>

          <div className="w-full">
            <TopSellingStock
              topcurrentPage={topStockCurrentPage}
              setTopCurrentPage={(page) => setTopStockCurrentPage(page)}
              topstocktotalPages={topStockTotalPages}
              data={topStock}
              onSeeAll={handleTopStockSeeAll}
              heading={'Inventory Management'}
            />
          </div>
        </div>

        {/* ✅ Stock Alert moved to last, full width */}
        <div className="w-full">
          <StockAlert
            currentPage={lowStockCurrentPage}
            setCurrentPage={(page) => setLowStockCurrentPage(page)}
            totalPages={lowStockTotalPages}
            data={lowStock}
            onSeeAll={handleStockAlertSeeAll}
          />
        </div>
      </div>
    </div>
  );
}

export default WarehouseDashboard;
