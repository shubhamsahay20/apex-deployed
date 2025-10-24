import { InventorySummary } from './InventorySummary'
import { ProductSummary } from './ProductSummary'
import { SalesChart } from './SalesChart'
import { StockAlert } from '../../../pages/Dashboard/StockAlert'
import reportService from '../../../api/report.service'
import topsellingstockService from '../../../api/topsellingstock.service'
import { useEffect, useState } from 'react'
import { useAuth } from '../../../Context/AuthContext'
import Loader from '../../../common/Loader'

export default function AdministratorDashboard () {
  const [productionSummary, setProductionSummary] = useState(null)
  const [inventorySummary, setInventorySummary] = useState(null)
  const [warehouseData, setWarehouseData] = useState([])
  const [lowStock, setLowStock] = useState([]) 
  const [loading, setLoading] = useState(false)

  const { user } = useAuth()

  useEffect(() => {
    setLoading(true)
    const fetchData = async () => {
      try {
        const productionres = await reportService.productionSummary(
          user.accessToken
        )
        setProductionSummary(productionres.data || [])

        const inventoryres = await reportService.inventorySummary(
          user.accessToken
        )
        setInventorySummary(inventoryres.data || [])

        const warehouseres = await reportService.Chart(user.accessToken)
        const formattedWarehouseData =
          warehouseres.data?.warehouseData.map(item => ({
            month: item.warehouseName,
            value: item.totalWarehouseStock
          })) || []
        setWarehouseData(formattedWarehouseData)

        const lowStockRes = await topsellingstockService.lowStock(
          user.accessToken
        )
        setLowStock(
          (lowStockRes.data || []).map(item => ({
            article: item.article,
            categoryCode: item.categoryCode,
            color: item.color,
            quality: item.quality,
            type: item.type,
            size: item.size,
            availableQty: item.availableQty,
            OrderedQuantity: item.OrderedQuantity,
            WishListQuantity: item.WishListQuantity, 
            requiredQuantity: item.requiredQuantity 
          }))
        )
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [user.accessToken])

  const handleStockAlertSeeAll = () => {
    console.log('Navigate to detailed alerts view')
  }

  if (loading) return <Loader />

  return (
    <div className='min-h-screen bg-meta-2 dark:bg-boxdark-2'>
      <div className='max-w-6xl mx-auto space-y-6 pt-4'>
        {/* Top Summary Cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <InventorySummary data={inventorySummary} />
          <ProductSummary data={productionSummary} />
        </div>

        {/* Sales Chart */}
        <div className='w-full'>
          <SalesChart
            head='Articles'
            title='Stock Overview Data'
            data={warehouseData}
          />
        </div>

        {/* Stock Alerts (full width, below chart) */}
        <div className='w-full'>
          <StockAlert data={lowStock} onSeeAll={handleStockAlertSeeAll} />
        </div>
      </div>
    </div>
  )
}
