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
import Loader from '../../../common/Loader';

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
  const [loading, setLoading] = useState(false);
  const [lowStockCurrentPage, setLowStockCurrentPage] = useState(1);
  const [lowStockTotalPages, setLowStockTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
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
        const lowStockRes = await topsellingstockService.lowStock(
          user.accessToken,
          lowStockCurrentPage,
          5,
        );
        setLowStock(
          (lowStockRes.data || []).map((item) => ({
            article: item.article,
            categoryCode: item.categoryCode,
            color: item.color,
            quality: item.quality,
            type: item.type,
            size: item.size,
            availableQty: item.availableQty,
            OrderedQuantity: item.OrderedQuantity,
            WishListQuantity: item.WishListQuantity,
            requiredQuantity: item.requiredQuantity,
          })),
        );
        setLowStockTotalPages(lowStockRes.pagination.pages)
      } catch (error) {
        toast.error(error.response?.data?.message || 'Error fetching data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user.accessToken,lowStockCurrentPage]);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-meta-2 dark:bg-boxdark-2">
      <div className="max-w-7xl mx-auto space-y-6">
       
        {/* Production Chart */}
        <div className="w-full">
          <SalesChart
            title="Production Status"
            head="Article Producted"
            data={productionChartData}
          />
        </div>

       
        {/* Stock Alerts */}
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
};

export default ProductionManager_Dashboard;
