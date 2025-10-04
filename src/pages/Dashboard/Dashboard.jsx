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
  const[loading,setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
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
        console.log('topsellingstock result ', topstockResponse);

        const lowStock = await topsellingstockService.lowStock(
          user.accessToken,
        );
        console.log('low stock', lowStock.data);
        setLowStock(
          (lowStock.data || []).map((item) => ({
            article: item.article,
            categoryCode: item.categoryCode,
            color: item.color,
            quality: item.quality,
            type: item.type,
            size: item.size,
            availableQty: item.availableQty,
            orderedQty: item.orderedQty,
          })),
        );
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally{
        setLoading(false)
      }
    };
    fetchData();
  }, []);

  console.log('usestate', topStock);

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

  const preOrderData = [
    { month: 'Jan', value: 4000 },
    { month: 'Feb', value: 2000 },
    { month: 'Mar', value: 3000 },
    { month: 'Apr', value: 2500 },
    { month: 'May', value: 2200 },
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
    {
      id: '322',
      name: 'Green Sneakers',
      quantity: '12 Cartons',
      status: 'Low',
    },
  ];

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

  if(loading) return <Loader/>

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
            <TopSellingStock data={topStock} onSeeAll={handleTopStockSeeAll} />
          </div>
        </div>
         <div className="flex flex-col lg:flex-row gap-6">
          <div className='w-full'>

            <StockAlert data={lowStock} onSeeAll={handleStockAlertSeeAll} />
          </div>
          </div>
      </div>
    </div>
  );
}
