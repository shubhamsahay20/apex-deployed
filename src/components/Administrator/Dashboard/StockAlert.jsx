import { InventorySummary } from './InventorySummary';
import { ProductSummary } from './ProductSummary';
import { SalesChart } from './SalesChart';
import { StockAlert } from './StockAlert';

export default function AdministratorDashboard() {
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
    { id: '033', name: 'Blue Sneakers', quantity: '60 Cartons', status: 'Low', image: '/images/blue.png' },
    { id: '304', name: 'Red Sneakers', quantity: '36 Cartons', status: 'Low', image: '/images/red.png' },
    { id: '322', name: 'Green Sneakers', quantity: '12 Cartons', status: 'Low', image: '/images/green.png' },
  ];

  const handleStockAlertSeeAll = () => {
    console.log('Navigate to detailed alerts view');
  };

  return (
    <div className="min-h-screen bg-[#f4f5f9] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Row: Summary Cards + Stock Alert */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3">
            <InventorySummary />
          </div>
          <div className="lg:col-span-5">
            <ProductSummary />
          </div>
          <div className="lg:col-span-4">
            <StockAlert data={stockAlerts} onSeeAll={handleStockAlertSeeAll} />
          </div>
        </div>

        {/* Chart Row */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <SalesChart head="Stock Overview" title="Articles" data={salesData} />
        </div>
      </div>
    </div>
  );
}
