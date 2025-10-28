import { InventorySummary } from './InventorySummary';
import { ProductSummary } from './ProductSummary';
import { SalesSummary } from './SalesSummary';
import { SalesChart } from './SalesChart';
import { PreOrdersChart } from './PreOrdersChart';
import { TopSellingStock } from './TopSellingStock';
import { StockAlert } from './StockAlert';

import { io } from 'socket.io-client';
import { useEffect, useState } from 'react';

import { toast } from 'react-toastify';
import reportService from '../../api/report.service';
import { useAuth } from '../../Context/AuthContext';
import topsellingstockService from '../../api/topsellingstock.service';
import Loader from '../../common/Loader';

export default function Dashboard() {
  const { user } = useAuth();
  const [salesSummary, setSalesSummary] = useState(null);
  const [productionSummary, setProductionSummary] = useState(null);
  const [salesChartData, setSalesChartData] = useState(null);
  const [inventorySummary, setInventorySummary] = useState(null);
  const [topStock, setTopStock] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lowStockCurrentPage, setLowStockCurrentPage] = useState(1);
  const [lowStockTotalPages, setLowStockTotalPages] = useState(1);

  const [topStockCurrentPage, setTopStockCurrentPage] = useState(1);
  const [topStockTotalPages, setTopStockTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await reportService.salesSummary(user.accessToken);
        console.log('Dashboard data', res.data);
        setSalesSummary(res.data || []);

        const productionres = await reportService.productionSummary(
          user.accessToken,
        );
        console.log('productionSummary', productionres.data);
        setProductionSummary(productionres.data || []);

        const inventoryres = await reportService.inventorySummary(
          user.accessToken,
        );
        console.log('inventorySummary', inventoryres.data);
        setInventorySummary(inventoryres.data || []);

        const salesChartRes = await reportService.adminSalesChart(
          user.accessToken,
        );
        console.log('production response', salesChartRes?.data);
        const formattedProductionData =
          salesChartRes.data?.map((item) => ({
            month: item.month,
            value: item.totalSales,
          })) || [];
        setSalesChartData(formattedProductionData);

        const topstockResponse = await topsellingstockService.topSellingStock(
          user.accessToken,
          topStockCurrentPage,
          5,
        );
        console.log('res top', topstockResponse);

        setTopStock(
          (topstockResponse.data || []).map((item) => ({
            article: item.article,
            categoryCode: item.categoryCode,
            size: item.size,
            color: item.color,
            quality: item.quality,
            type: item.type,
            totalQuantity: item.totalQuantity,
          })),
        );

        setTopStockTotalPages(topstockResponse.pagination.totalPages);

        const lowStock = await topsellingstockService.lowStock(
          user.accessToken,
          lowStockCurrentPage,
          5,
        );
        console.log('low stock', lowStock);
        setLowStock(
          (lowStock.data || []).map((item) => ({
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
        setLowStockTotalPages(lowStock.pagination.pages);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error(error.response.data.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [lowStockCurrentPage, topStockCurrentPage]);

  console.log('usestate', topStock);

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

  if (loading) return <Loader />;

  return (
    <div className="  min-h-screen bg-meta-2 dark:bg-boxdark-2">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InventorySummary data={inventorySummary} />
          <ProductSummary data={productionSummary} />
          <SalesSummary data={salesSummary} />
        </div>

        {/* <h1>return notification</h1> */}

        {/* Charts Section */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sales Chart - 70% Width */}
          <div className="w-full lg:w-full ">
            <SalesChart head="Sales" title="Sales Data" data={salesChartData} />
          </div>

          {/* PreOrders Chart - 30% Width */}
          {/* <div className="w-full lg:w-[33%] ">
            <PreOrdersChart
              data={preOrderData}
              onSeeAll={handlePreOrdersSeeAll}
            />
          </div> */}
        </div>

        {/* Tables Section */}
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full  ">
            <TopSellingStock
              topcurrentPage={topStockCurrentPage}
              setTopCurrentPage={(page) => setTopStockCurrentPage(page)}
              topstocktotalPages={topStockTotalPages}
              data={topStock}
              onSeeAll={handleTopStockSeeAll}
            />
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-6">
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
    </div>
  );
}
