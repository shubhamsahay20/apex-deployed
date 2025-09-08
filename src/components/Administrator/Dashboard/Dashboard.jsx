import { InventorySummary } from './InventorySummary';
import { ProductSummary } from './ProductSummary';
import { SalesChart } from './SalesChart';
import { StockAlert } from '../../../pages/Dashboard/StockAlert';
import reportService from '../../../api/report.service';
import { useEffect, useState } from 'react';
import { useAuth } from '../../../Context/AuthContext';

export default function AdministratorDashboard() {
  // Sample data for charts
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

  const [productionSummary, setProductionSummary] = useState(null);
  const [inventorySummary, setInventorySummary] = useState(null);
  const [warehouseData, setWarehouseData] = useState([]);
  const { user } = useAuth();
  useEffect(() => {
    const fetchData = async () => {
      try {
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

        const warehouseres = await reportService.Chart(
          user.accessToken,
        );
        console.log('Warehouse Data:', warehouseres.data?.warehouseData);

        // Map API data into chart format (adjust fields based on API response)
        const formattedWarehouseData =
          warehouseres.data?.warehouseData.map((item) => ({
            month: item.warehouseName, 
            value: item.totalWarehouseStock
          })) || [];

        setWarehouseData(formattedWarehouseData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

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

  return (
    <div className="min-h-screen bg-meta-2 dark:bg-boxdark-2">
      <div className="max-w-6xl mx-auto space-y-6 pt-4">
        <div className="w-full flex flex-col lg:flex-row gap-4">
          <div className="w-full lg:w-2/3 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InventorySummary data={inventorySummary} />
              <ProductSummary data={productionSummary} />
            </div>

            <div className="w-full">
              <SalesChart
                head="Articles"
                title="Stock Overview Data"
                data={warehouseData}
              />
            </div>
          </div>

          {/* Right side: Stock Alert card */}
          <div className="w-full lg:w-1/3">
            <StockAlert data={stockAlerts} onSeeAll={handleStockAlertSeeAll} />
          </div>
        </div>
      </div>
    </div>
  );
}
