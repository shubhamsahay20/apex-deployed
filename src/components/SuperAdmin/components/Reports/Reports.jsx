import React, { useEffect, useState } from 'react'
import { FaFileExport } from 'react-icons/fa'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { toast } from 'react-toastify'
import reportService from '../../../../api/report.service'
import { useAuth } from '../../../../Context/AuthContext'
import Loader from '../../../../common/Loader'

const Reports = () => {
  const [activeReport, setActiveReport] = useState('stock')
  const { user } = useAuth()

  // Data states
  const [salesReport, setSalesReport] = useState([])
  const [customerReport, setCustomerReport] = useState([])
  const [stockReport, setStockReport] = useState([])
  const [productionReport, setProductionReport] = useState([])
  const [warehouseReport, setWarehouseReport] = useState([])

  const [loading, setLoading] = useState(false)

  // Pagination per report
  const [pagination, setPagination] = useState({
    sales: { currentPage: 1, totalPages: 1 },
    stock: { currentPage: 1, totalPages: 1 },
    products: { currentPage: 1, totalPages: 1 },
    warehouse: { currentPage: 1, totalPages: 1 },
    customer: { currentPage: 1, totalPages: 1 }
  })

  const tabs = [
    { key: 'stock', label: '📦 Stock Report' },
    { key: 'sales', label: '📊 Sales Report' },
    { key: 'products', label: '🛍️ Products Report' },
    { key: 'warehouse', label: '🏭 Warehouse Report' },
    { key: 'customer', label: '👤 Customer Report' }
  ]

  const columns = {
    stock: [
      'Article',
      'Category Name',
      'Color',
      'Size',
      'Type',
      'Quality',
      'Factory',
      'Warehouse',
      'Stock in Warehouse',
      'Total Quantity'
    ],
    sales: ['Sales Order No', 'Order Date', 'Customer', 'Article', 'Quantity'],
    products: [
      'Production No.',
      'Article',
      'Color',
      'Size',
      'Type',
      'Quality',
      'Factory Name',
      'Production Quantity',
      'Dispatched Quantity'
    ],
    warehouse: ['Warehouse Name', 'Location', 'Total Quantity'],
    customer: ['Customer', 'Article', 'City', 'Total Quantity']
  }

  const rowMappers = {
    stock: row => [
      row.article,
      row.categoryCode,
      row.color,
      row.size,
      row.type,
      row.quality,
      row.factory,
      row.warehouse,
      row.stockAtWarehouse,
      row.totalQuantity
    ],
    sales: row => [
      row.salesOrderNo,
      row.orderDate,
      row.customer,
      row.article,
      row.quantity
    ],
    products: row => [
      row.productionNo,
      row.article,
      row.category?.color,
      row.category?.size,
      row.category?.type,
      row.category?.quality,
      row.factory?.name,
      row.productionQuantity,
      row.dispatchedQuantity
    ],
    warehouse: row => [
      row.warehouseName,
      row.warehouseLocation,
      row.totalQuantity
    ],
    customer: row => [row.customer, row.article, row.city, row.totalQuantity]
  }

  const reportData = {
    stock: stockReport,
    sales: salesReport,
    products: productionReport,
    warehouse: warehouseReport,
    customer: customerReport
  }

  // -------------------------------
  // Fetching Reports
  // -------------------------------
  const fetchStockReport = async () => {
    try {
      setLoading(true)
      const res = await reportService.stockReport(
        user.accessToken,
        pagination.stock.currentPage,
        10
      )
      setStockReport(res?.data || [])
      setPagination(prev => ({
        ...prev,
        stock: { ...prev.stock, totalPages: res?.pagination?.totalPages || 1 }
      }))
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch Stock Report')
    } finally {
      setLoading(false)
    }
  }

  const fetchSalesReport = async () => {
    try {
      setLoading(true)
      const res = await reportService.salesReport(
        user.accessToken,
        pagination.sales.currentPage,
        5
      )
      setSalesReport(res?.data || [])
      setPagination(prev => ({
        ...prev,
        sales: { ...prev.sales, totalPages: res?.pagination?.totalPages || 1 }
      }))
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch Sales Report')
    } finally {
      setLoading(false)
    }
  }

  const fetchProductionReport = async () => {
    try {
      setLoading(true)
      const res = await reportService.productionReport(
        user.accessToken,
        pagination.products.currentPage,
        5
      )
      setProductionReport(res?.products || [])
      setPagination(prev => ({
        ...prev,
        products: {
          ...prev.products,
          totalPages: res?.pagination?.totalPages || 1
        }
      }))
    } catch (err) {
      toast.error(
        err.response?.data?.message || 'Failed to fetch Production Report'
      )
    } finally {
      setLoading(false)
    }
  }

  const fetchWarehouseReport = async () => {
    try {
      setLoading(true)
      const res = await reportService.warehouseReport(
        user.accessToken,
        pagination.warehouse.currentPage,
        5
      )
      setWarehouseReport(res?.data?.data || [])
      setPagination(prev => ({
        ...prev,
        warehouse: {
          ...prev.warehouse,
          totalPages: res?.data?.pagination?.totalPages || 1
        }
      }))
    } catch (err) {
      toast.error(
        err.response?.data?.message || 'Failed to fetch Warehouse Report'
      )
    } finally {
      setLoading(false)
    }
  }

  const fetchCustomerReport = async () => {
    try {
      setLoading(true)
      const res = await reportService.customerReport(
        user.accessToken,
        pagination.customer.currentPage,
        5
      )
      setCustomerReport(res?.data || [])
      setPagination(prev => ({
        ...prev,
        customer: {
          ...prev.customer,
          totalPages: res?.pagination?.totalPages || 1
        }
      }))
    } catch (err) {
      toast.error(
        err.response?.data?.message || 'Failed to fetch Customer Report'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (activeReport === 'stock') fetchStockReport()
    if (activeReport === 'sales') fetchSalesReport()
    if (activeReport === 'products') fetchProductionReport()
    if (activeReport === 'warehouse') fetchWarehouseReport()
    if (activeReport === 'customer') fetchCustomerReport()
  }, [activeReport, pagination[activeReport].currentPage])

  // -------------------------------
  // Export PDF
  // -------------------------------
  const handleExportPDF = () => {
    const doc = new jsPDF()
    const data = reportData[activeReport]
    const headers = [columns[activeReport]]
    const rows = data.map(row => rowMappers[activeReport](row))

    doc.setFontSize(14)
    doc.text(`${tabs.find(t => t.key === activeReport)?.label}`, 14, 10)

    autoTable(doc, {
      head: headers,
      body: rows,
      startY: 20
    })

    doc.save(`${activeReport}_report.pdf`)
  }

  // -------------------------------
  // Render Table
  // -------------------------------
  const renderTable = () => {
    const data = reportData[activeReport] || []
    const { currentPage, totalPages } = pagination[activeReport]

    if (!data.length && !loading) {
      return (
        <div className='bg-white text-center p-10 rounded shadow text-gray-500'>
          No data available for this report.
        </div>
      )
    }

    return (
      <div className='bg-white shadow rounded-lg relative'>
        {/* Loader */}
        {loading && (
          <div className='absolute inset-0 flex items-center justify-center bg-white/70 z-10'>
            <Loader />
          </div>
        )}

        {/* Fixed Top Bar */}
        <div className='flex justify-between items-center p-4 border-b sticky top-0 bg-white z-20'>
          <h3 className='text-lg font-semibold text-gray-800 capitalize'>
            {tabs.find(t => t.key === activeReport)?.label}
          </h3>
          <button
            onClick={handleExportPDF}
            className='flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-300 text-sm rounded text-gray-700 hover:bg-gray-50'
          >
            <FaFileExport /> Export
          </button>
        </div>

        {/* Scrollable Table */}
        <div className='overflow-x-auto'>
          <table className='w-full text-sm text-left border-collapse min-w-[700px]'>
            <thead className='bg-gray-50 text-gray-600 uppercase text-xs'>
              <tr>
                {columns[activeReport].map((col, i) => (
                  <th key={i} className='p-4 whitespace-nowrap'>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className='text-gray-700'>
              {data.map((row, index) => (
                <tr key={index} className='border-b hover:bg-gray-50'>
                  {rowMappers[activeReport](row).map((cell, i) => (
                    <td key={i} className='p-4 whitespace-nowrap'>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Fixed Bottom Pagination */}
        {/* Pagination — bottom of table container */}
        <div className='flex justify-between items-center p-4 border-t bg-white z-20 text-sm text-gray-600'>
          <button
            disabled={currentPage === 1}
            onClick={() =>
              setPagination(prev => ({
                ...prev,
                [activeReport]: {
                  ...prev[activeReport],
                  currentPage: prev[activeReport].currentPage - 1
                }
              }))
            }
            className='px-3 py-1 border rounded bg-gray-50 disabled:opacity-50'
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() =>
              setPagination(prev => ({
                ...prev,
                [activeReport]: {
                  ...prev[activeReport],
                  currentPage: prev[activeReport].currentPage + 1
                }
              }))
            }
            className='px-3 py-1 border rounded bg-gray-50 disabled:opacity-50'
          >
            Next
          </button>
        </div>
      </div>
    )
  }

  // -------------------------------
  // Main JSX
  // -------------------------------
  return (
    <div className='bg-gray-100 min-h-screen p-6'>
      {/* Tabs */}
      <div className='flex flex-wrap gap-3 mb-6 justify-start'>
        {tabs.map(report => (
          <button
            key={report.key}
            onClick={() => {
              setActiveReport(report.key)
              setPagination(prev => ({
                ...prev,
                [report.key]: { ...prev[report.key], currentPage: 1 }
              }))
            }}
            className={`py-2 px-4 rounded-lg text-sm font-medium shadow transition ${
              activeReport === report.key
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {report.label}
          </button>
        ))}
      </div>

      {/* Table */}
      {renderTable()}
    </div>
  )
}

export default Reports
