import { useEffect, useState } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'

import Loader from './common/Loader'
import PageTitle from './utils/PageTitle'
import SignIn from './pages/Authentication/SignIn'
import SignUp from './pages/Authentication/SignUp'
import Calendar from './pages/Calendar'
import Chart from './pages/Chart'
import Dashboard from './pages/Dashboard/Dashboard'
import FormElements from './pages/Form/FormElements'
import FormLayout from './pages/Form/FormLayout'
import Profile from './pages/Profile'
// import Settings from './pages/Settings'
import DefaultLayout from './layout/DefaultLayout'
import SalesOrder from './pages/SalesOrder'
// import SalesDetails from './pages/SalesDetails'
import ArticleList from './components/SuperAdmin/components/inventory/ArticleList'
import ProductList from './pages/ProductList'
import CustomerManagement from './components/SuperAdmin/components/customermanagement/CustomerManagement'

import RoleManagement from './components/SuperAdmin/components/rolemanagement/RoleManagement'
import DeliveryOrder from './components/SuperAdmin/components/inventory/DeliveryOrder'
import InternalTransfer from './components/SuperAdmin/components/inventory/InternalTransfer'
import Production from './components/SuperAdmin/components/inventory/Production'
// import DeliveryDetails from './components/inventory/DeliveryOrder/DeliveryDetails';
import ScanDelivery from './components/SuperAdmin/components/inventory/ScanDelivery'
import ScanOrderDetails from './components/SuperAdmin/components/inventory/ScanOrderDetails'
import DeliveryDetails from './components/SuperAdmin/components/inventory/DeliveryDetails'
import InternalDetails from './components/SuperAdmin/components/inventory/InternalDetails'
import ScanInternalTrans from './components/SuperAdmin/components/inventory/ScanInternalTrans'
import InternalScanOrderDetails from './components/SuperAdmin/components/inventory/InternalScanOrderDetails'
import ProductionAdd from './components/SuperAdmin/components/inventory/ProductionAdd'
import ProductCreateLabel from './components/SuperAdmin/components/inventory/ProductCreateLabel'
import AddNewCustomer from './components/SuperAdmin/components/customermanagement/AddNewCustomer'
import CustomerDetailsView from './components/SuperAdmin/components/customermanagement/CustomerDetailsView'
import CustomerEdit from './components/SuperAdmin/components/customermanagement/CustomerEdit'
import Logs from './components/SuperAdmin/components/Loggs/Logs'
// import Annoucement from './components/Annoucement.jsx/AnnouncementManager';
import AnnouncementManager from './components/SuperAdmin/components/Annoucement.jsx/AnnouncementManager'
import RoleDetailsViewPage from './components/SuperAdmin/components/rolemanagement/RoleDetailsViewPage'
import WarehouseManagement from './components/SuperAdmin/components/warehouse-management/WarehouseManagement'
import Reports from './components/SuperAdmin/components/Reports/Reports'
import Catagary from './components/SuperAdmin/components/catagories/Catagary'
import ArticleCode from './components/SuperAdmin/components/article-code/ArticleCode'
import WarehouseDetails from './components/SuperAdmin/components/warehouse-management/WarehouseDetails'
import InventoryDashboard from './components/InventoryAdmin/components/InventoryManagement/InventoryDashboard'
import InventoryArticalList from './components/InventoryAdmin/components/InventoryManagement/InventoryArticalList'
import AddArticleList from './components/InventoryAdmin/components/InventoryManagement/AddArticleList'
import ProductionManager_Dashboard from './components/ProductionAdmin/components/ProductionManager_Dashboard'
import Create_New_Order from './components/Sales Person/components/Create_New_Order'
import ProductionManager_Management from './components/ProductionAdmin/ProductionManager_Management'
import Add_Production from './components/ProductionAdmin/components/Add_Production'
import Create_lable from './components/ProductionAdmin/components/Create_lable'
import Warehouse_Management from './components/ProductionAdmin/components/Warehouse_Management'
import Warehouse_details from './components/ProductionAdmin/components/Warehouse_details'
import ActiveSchemesOrder from './components/Sales Person/components/Schemes'
import Scheme from './components/SuperAdmin/components/Scheme/Scheme'

// import CustomersList from './components/Sales Person/components/CustomersList';
// import Create_Scheme from './components/SuperAdmin/components/Scheme/Create_Scheme';
import CustomersList from './components/Sales Person/components/CustomersList';
import Orders from './components/Sales Person/Orders';
import SalesPersonProfile from './components/Sales Person/components/SalesPersonProfile';
import Wishlist from './components/Sales Person/components/Wishlist';
import AccountingDashboard from './components/AccountingAdmin/components/AccountingDashboard';
import Salespersondashboard from './components/Sales Person/components/Dashboard/Dashboard';
import ProtectedRoutes from './layout/ProtectedRoutes';
import Unauthorized from './pages/Unauthorised';
import CreateQRCode from './components/Administrator/components/CreateQRCode';
import CreateRoleForm from './components/AccountingAdmin/components/CreateRoleIDPassword';
import AdministratorDashboard from './components/Administrator/Dashboard/Dashboard';
import AddCategory from './components/SuperAdmin/components/catagories/AddCategory';
import EditCategory from './components/SuperAdmin/components/catagories/EditCategory';
import Productprofile from './components/ProductionAdmin/components/Productprofile';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/ReactToastify.css';
import Inventoryprofile from './components/InventoryAdmin/components/Inventoryprofile';
import Accountingprofile from './components/AccountingAdmin/components/Accountingprofile';
import AddArticleCode from './components/SuperAdmin/components/article-code/AddArticleCode';
import WarehouseDashboard from './components/WarehouseAdmin/WarehouseDashboard';
import NotFound from './layout/NotFound';
import EditArticleCode from './components/SuperAdmin/components/article-code/EditArticleCode';
import CreateWarehouse from './components/SuperAdmin/components/warehouse-management/CreateWarehouse';
import FactoryManagement from './components/SuperAdmin/components/Factory/FactoryManagement';
import CreateFactory from './components/SuperAdmin/components/Factory/CreateFactory';
import FactoryDetails from './components/SuperAdmin/components/Factory/FactoryDetails';
import EditFactory from './components/SuperAdmin/components/Factory/EditFactory';
import EditWarehouse from './components/SuperAdmin/components/warehouse-management/EditWarehouse';
import EditRole from './components/SuperAdmin/components/rolemanagement/EditRole';
import ForgotPassword from './pages/Authentication/Forgot';
import Cart from './components/Sales Person/components/Dashboard/Cart';
import QRScannerPage from './components/ProductionAdmin/components/ProductionScanner';
import QRScanner from './components/WarehouseAdmin/components/WarehouseScanner';
import DispatchScanner from './components/WarehouseAdmin/components/DispatchScanner';
import Stock from './components/WarehouseAdmin/components/StockData';
import OrderDetails from './components/InventoryAdmin/components/InventoryManagement/ViewSlesOrderList';
import QRDropdownPage from './components/ProductionAdmin/components/Production';
import ArticalData from './components/InventoryAdmin/components/InventoryManagement/ArticalData';
import ArticleDataWarehouse from './components/WarehouseAdmin/components/ArticleDataWarehouse';
import WarehouseDropdown from './components/WarehouseAdmin/components/WarehouseDropdown';
import Internal_warehouse_transfer from './components/Administrator/components/Internal_warehouse_transfer';
import UploadStatus from './components/InventoryAdmin/components/InventoryManagement/UploadStatus';
import Admin_WishList from './components/SuperAdmin/components/WishList_Admin/Admin_WishList';
import AdminOrders from './components/SuperAdmin/components/AdminOrders/AdminOrder';
import StockVerify from './components/WarehouseAdmin/components/StockVerify';
import ViewProduction from './components/ProductionAdmin/components/ViewProduction';
import AccountSectionViewOrder from './components/AccountingAdmin/components/AccountSectionViewOrder'
import ViewWarehouseStock from './components/WarehouseAdmin/components/ViewWarehouseStock'
import ViewArticle from './components/SuperAdmin/components/catagories/ViewArtical'
import Adminreset from './pages/Authentication/Adminreset'
import TotalCart from './components/Administrator/components/TotalCart'
import ProductionDetail from './components/ProductionAdmin/components/ProductionDetail'

function App () {
  const [loading, setLoading] = useState(true)
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000)
  }, [])

  return loading ? (
    <Loader />
  ) : (
    <Routes>
      <Route path='/' element={<Navigate to='/login' />} />
      <Route path='/unauthorized' element={<Unauthorized />} />

      <Route
        path='/login'
        element={
          <>
            <PageTitle title='Signin ' />
            <SignIn />
          </>
        }
      />
      <Route
        path='/forgotpassword'
        element={
          <>
            {/* <ProtectedRoutes role={['Admin', 'Warehouse Manager']}> */}
            <PageTitle title='ForgotPassword' />
            <ForgotPassword />
            {/* </ProtectedRoutes> */}
          </>
        }
      />

      <Route
        path='/signup'
        element={
          <>
          
            <PageTitle title='Signup ' />
            <SignUp />
          </>
        }
      />
      <Route
        path='/Adminreset'
        element={
          <>
            <PageTitle title='Admin Reset ' />
            <Adminreset />
          </>
        }
      />

      <Route
        path='*'
        element={
          <DefaultLayout>
            <Routes>
              <Route
                path='/dashboard'
                element={
                  <>
                    <ProtectedRoutes role={['Admin']}>
                      <PageTitle title='Dashboard ' />
                      <Dashboard />
                    </ProtectedRoutes>
                  </>
                }
              />
              <Route
                path='/production-manager/dashboard'
                element={
                  <>
                    <ProtectedRoutes role={['Production Manager', 'Admin']}>
                      <PageTitle title='Production Manager Dashboard ' />
                      <ProductionManager_Dashboard />
                    </ProtectedRoutes>
                  </>
                }
              />
              <Route
                path='/production-manager/management'
                element={
                  <>
                    <ProtectedRoutes
                      role={[ 'Admin', 'Administrator']}
                    >
                      <PageTitle title='Production Manager Management ' />
                      <ProductionManager_Management />
                    </ProtectedRoutes>
                  </>
                }
              />
              <Route
                path='/production-manager/ProductionDetail'
                element={
                  <>
                    <ProtectedRoutes
                      role={['Production Manager']}
                    >
                      <PageTitle title='Production Detail ' />
                      <ProductionDetail />
                    </ProtectedRoutes>
                  </>
                }
              />
              <Route
                path='/production-manager/management/add-production'
                element={
                  <>
                    <ProtectedRoutes
                      role={['Production Manager', 'Administrator', 'Admin']}
                    >
                      <PageTitle title='Production Manager Management ' />
                      <Add_Production />
                    </ProtectedRoutes>
                  </>
                }
              />
              <Route
                path='/production-manager/management/create-label'
                element={
                  <>
                    <ProtectedRoutes
                      role={['Production Manager', 'Administrator', 'Admin']}
                    >
                      <PageTitle title='Production Manager Management ' />
                      <Create_lable />
                    </ProtectedRoutes>
                  </>
                }
              />
              <Route
                path='/prodction-manager/warehouse_management'
                element={
                  <>
                    <ProtectedRoutes
                      role={['Production Manager', 'Administrator', 'Admin']}
                    >
                      <PageTitle title='Production Manager/Warehouse Management ' />
                      <Warehouse_Management />
                    </ProtectedRoutes>
                  </>
                }
              />
              <Route
                path='/production-manager/warehouse_details'
                element={
                  <>
                    <ProtectedRoutes
                      role={['Production Manager', 'Administrator', 'Admin']}
                    >
                      <PageTitle title='Production Manager/Warehouse Details ' />
                      <Warehouse_details />
                    </ProtectedRoutes>
                  </>
                }
              />
              <Route
                path='/SalesOrder'
                element={
                  <>
                    <ProtectedRoutes role={['Sales Person', 'Admin']}>
                      <PageTitle title='Calendar ' />
                      <SalesOrder />
                    </ProtectedRoutes>
                  </>
                }
              />
              {/* <Route
                path='/SalesDetails/:id'
                element={
                  <>
                    <ProtectedRoutes role={['Sales Person', 'Admin']}>
                      <PageTitle title='Sales Details  ' />
                      <SalesDetails />
                    </ProtectedRoutes>
                  </>
                }
              /> */}
              <Route
                path='/salesPerson/cart'
                element={
                  <>
                    <ProtectedRoutes role={['Sales Person', 'Admin']}>
                      <PageTitle title='Sales Details  ' />
                      <Cart />
                    </ProtectedRoutes>
                  </>
                }
              />
              <Route
                path='/TotalCart'
                element={
                  <>
                    <ProtectedRoutes role={['Administrator']}>
                      <PageTitle title='All Sales Details  ' />
                      <TotalCart />
                    </ProtectedRoutes>
                  </>
                }
              />
              <Route
                path='/calendar'
                element={
                  <>
                    <PageTitle title='Calendar ' />
                    <Calendar />
                  </>
                }
              />
              <Route
                path='/profile'
                element={
                  <>
                    <PageTitle title='Profile ' />
                    <Profile />
                  </>
                }
              />
              <Route
                path='/articleList'
                element={
                  <>
                    <ProtectedRoutes role={['Admin', 'Administrator']}>
                      <PageTitle title='Article List ' />
                      <ArticleList />
                    </ProtectedRoutes>
                  </>
                }
              />
              <Route
                path='/inventory/delivery-orders'
                element={
                  <>
                    <ProtectedRoutes
                      role={['Admin', 'Administrator', 'Inventory Manager']}
                    >
                      <PageTitle title='Delivery Order ' />
                      <DeliveryOrder />
                    </ProtectedRoutes>
                  </>
                }
              />
              <Route
                path='/inventory/delivery-details'
                element={
                  <>
                    <ProtectedRoutes role={['Admin','Administrator','Inventory Manager']}>
                      <PageTitle title='Delivery Order ' />
                      <DeliveryDetails />
                    </ProtectedRoutes>
                  </>
                }
              />
              <Route
                path='/inventory/scan-delivery'
                element={
                  <>
                    <ProtectedRoutes role={['Admin', 'Inventory Manager']}>
                      <PageTitle title='Delivery Order ' />
                      <ScanDelivery />
                    </ProtectedRoutes>
                  </>
                }
              />
              <Route
                path='/inventory/scan-order-details'
                element={
                  <>
                    <ProtectedRoutes role={['Admin', 'Inventory Manager']}>
                      <PageTitle title='Delivery Order ' />
                      <ScanOrderDetails />
                    </ProtectedRoutes>
                  </>
                }
              />
              {/* Intenal Transfer Routes start  */}
              <Route
                path='/inventory/internal-transfers'
                element={
                  <>
                    <ProtectedRoutes
                      role={['Admin', 'Administrator', 'Inventory Manager']}
                    >
                      <PageTitle title='Internal Transfer  ' />
                      <InternalTransfer />
                    </ProtectedRoutes>
                  </>
                }
              />
              <Route
                path='/inventory/internal-details'
                element={
                  <>
                    <ProtectedRoutes role={['Admin', 'Inventory Manager']}>
                      <PageTitle title='Delivery Order ' />
                      <InternalDetails />
                    </ProtectedRoutes>
                  </>
                }
              />
              <Route
                path='/inventory/internal-label'
                element={
                  <>
                    <ProtectedRoutes role={['Admin', 'Inventory Manager']}>
                      <PageTitle title='Delivery Order ' />
                      <ScanInternalTrans />
                    </ProtectedRoutes>
                  </>
                }
              />
              {/* */}
              {/* Internal Transfer Route END  */}
              {/*  INVENTRY PRODUCT ROUTES START */}
              <Route
                path='inventory/product-add'
                element={
                  <>
                    <ProtectedRoutes role={['Admin', 'Inventory Manager']}>
                      <PageTitle title='Delivery Order ' />
                      <ProductionAdd />
                    </ProtectedRoutes>
                  </>
                }
              />
              <Route
                path='/inventory/product-create-lebel'
                element={
                  <>
                    <ProtectedRoutes role={['Admin', 'Inventory Manager']}>
                      <PageTitle title='Delivery Order ' />
                      <ProductCreateLabel />
                    </ProtectedRoutes>
                  </>
                }
              />
              {/* INVENTRY PRODUCT ROUTES END  */}
              {/* <Route
                path="/inventory/production"
                element={
                  <>
                    <ProtectedRoutes role={['Admin','Administrator', 'Inventory Manager']}>
                      <PageTitle title="Production " />
                      <Production />
                    </ProtectedRoutes>
                  </>
                }
              /> */}
              <Route
                path='/productList'
                element={
                  <>
                    <ProtectedRoutes role={['Admin']}>
                      <PageTitle title='Article List data  ' />
                      <ProductList />
                    </ProtectedRoutes>
                  </>
                }
              />
              <Route
                path='/productList'
                element={
                  <>
                    <ProtectedRoutes role={['Admin', 'Inventory Manager']}>
                      <PageTitle title='Article List data  ' />
                      <ProductList />
                    </ProtectedRoutes>
                  </>
                }
              />{' '}
              <Route
                path='/productList'
                element={
                  <>
                    <ProtectedRoutes role={['Admin', 'Inventory Manager']}>
                      <PageTitle title='Article List data  ' />
                      <ProductList />
                    </ProtectedRoutes>
                  </>
                }
              />
              <Route
                path='/forms/form-layout'
                element={
                  <>
                    <ProtectedRoutes role={['Admin']}>
                      <PageTitle title='Role Management ' />
                      <FormLayout />
                    </ProtectedRoutes>
                  </>
                }
              />
              {/*  CUSTOMER MANAGEMENT ROUTES START  */}
              <Route
                path='/customer-management'
                element={
                  <>
                    <ProtectedRoutes role={['Admin']}>
                      <PageTitle title='Customer Management ' />
                      <CustomerManagement />
                    </ProtectedRoutes>
                  </>
                }
              />
              <Route
                path='/factory-management'
                element={
                  <>
                    <ProtectedRoutes
                      role={[
                        'Admin',
                        'Sales Person',
                        'Production Manager',
                        'Administrator',
                        'Inventory Manager',
                        'Warehouse Manager'
                      ]}
                    >
                      <PageTitle title='Factory Management ' />
                      <FactoryManagement />
                    </ProtectedRoutes>
                  </>
                }
              />
              <Route
                path='/inventory-management/dashboard'
                element={
                  <>
                    <ProtectedRoutes role={['Admin', 'Inventory Manager']}>
                      <PageTitle title='Inventory Management ' />
                      <InventoryDashboard />
                    </ProtectedRoutes>
                  </>
                }
              />
              <Route
                path='/inventory-management/article-list'
                element={
                  <>
                    <ProtectedRoutes role={['Admin', 'Inventory Manager']}>
                      <PageTitle title='Inventory Management Article List ' />
                      <InventoryArticalList />
                    </ProtectedRoutes>
                  </>
                }
              />
              <Route
                path='/inventory-management/article-list/add-new-article'
                element={
                  <>
                    <ProtectedRoutes role={['Admin', 'Inventory Manager']}>
                      <PageTitle title='Inventory Management Add New Article   ' />
                      <AddArticleList />
                    </ProtectedRoutes>
                  </>
                }
              />
              <Route
                path='/customer/add-new-customer'
                element={
                  <>
                    <ProtectedRoutes role={['Admin']}>
                      <PageTitle title='Add New Customer ' />
                      <AddNewCustomer />
                    </ProtectedRoutes>
                  </>
                }
              />
              <Route
                path='/customer/:id/view-customer'
                element={
                  <>
                    <ProtectedRoutes role={['Admin']}>
                      <PageTitle title='Customer Details View ' />
                      <CustomerDetailsView />
                    </ProtectedRoutes>
                  </>
                }
              />
              <Route
                path='customer/:id/edit-customer'
                element={
                  <>
                    <ProtectedRoutes role={['Admin']}>
                      <PageTitle title='Customer Edit ' />
                      <CustomerEdit />
                    </ProtectedRoutes>
                  </>
                }
              />
              {/*  CUSTOMER MANAGEMENT ROUTES END   */}
              <Route
                path='/role-management'
                element={
                  <>
                    <ProtectedRoutes role={['Admin', 'Administrator']}>
                      <PageTitle title='Role Management ' />
                      <RoleManagement />
                    </ProtectedRoutes>
                  </>
                }
              />
              <Route
                path='/view-details/:role/:id'
                element={
                  <>
                    <ProtectedRoutes role={['Admin','Administrator']}>
                      <PageTitle title='Role Details ViewPage ' />
                      <RoleDetailsViewPage />
                    </ProtectedRoutes>
                  </>
                }
              />
              <Route
                path='/warehouse-management'
                element={
                  <>
                    <ProtectedRoutes
                      role={['Admin', 'Administrator', 'Warehouse Manager']}
                    >
                      <PageTitle title='Warehouse Management ' />
                      <WarehouseManagement />
                    </ProtectedRoutes>
                  </>
                }
              />
              <Route
                path='/warehouse-details/:id'
                element={
                  <>
                    <ProtectedRoutes
                      role={['Admin', 'Administrator', 'Warehouse Manager']}
                    >
                      <PageTitle title='Tables ' />
                      <WarehouseDetails />
                    </ProtectedRoutes>
                  </>
                }
              />
              <Route
                path='/factory-details/:id'
                element={
                  <>
                    <ProtectedRoutes
                      role={['Admin', 'Administrator', 'Warehouse Manager']}
                    >
                      <PageTitle title=' Factory ' />
                      <FactoryDetails />
                    </ProtectedRoutes>
                  </>
                }
              />
              <Route
                path='/reports'
                element={
                  <>
                    <ProtectedRoutes role={['Admin']}>
                      <PageTitle title='Reports ' />
                      <Reports />
                    </ProtectedRoutes>
                  </>
                }
              />
              <Route
                path='/categories'
                element={
                  <>
                    <ProtectedRoutes role={['Admin']}>
                      <PageTitle title='Category ' />
                      <Catagary />
                    </ProtectedRoutes>
                  </>
                }
              />
              <Route
                path='/addcategory'
                element={
                  <>
                    <ProtectedRoutes role={['Admin']}>
                      <PageTitle title='Category ' />
                      <AddCategory />
                    </ProtectedRoutes>
                  </>
                }
              />
              <Route
                path='/ViewArticle-details/:id'
                element={
                  <>
                    <ProtectedRoutes role={['Admin']}>
                      <PageTitle title='ViewArticle ' />
                      <ViewArticle />
                    </ProtectedRoutes>
                  </>
                }
              />
              <Route
                path='/editcategory/:id'
                element={
                  <>
                    <ProtectedRoutes role={['Admin']}>
                      <PageTitle title='Edit Category ' />
                      <EditCategory />
                    </ProtectedRoutes>
                  </>
                }
              />
              <Route
                path='/article-codes'
                element={
                  <>
                    <ProtectedRoutes role={['Admin']}>
                      <PageTitle title='Article Code ' />
                      <ArticleCode />
                    </ProtectedRoutes>
                  </>
                }
              />
              <Route
                path='/annoucement'
                element={
                  <>
                    <ProtectedRoutes
                      role={['Admin', 'Sales Person', 'Administrator']}
                    >
                      <PageTitle title='Announcement Manager ' />
                      <AnnouncementManager />
                    </ProtectedRoutes>
                  </>
                }
              />
              <Route
                path='/logs'
                element={
                  <>
                    <ProtectedRoutes role={['Admin']}>
                      <PageTitle title='Logs' />
                      <Logs />
                    </ProtectedRoutes>
                  </>
                }
              />
              <Route
                path='/edit-role/:id'
                element={
                  <>
                    <ProtectedRoutes role={['Admin','Administrator']}>
                      <EditRole />
                    </ProtectedRoutes>
                  </>
                }
              />
              {/* <Route
                path='/settings'
                element={
                  <>
                    <ProtectedRoutes role={['Admin']}>
                      <PageTitle title='Settings ' />
                      <Settings />
                    </ProtectedRoutes>
                  </>
                }
              /> */}
              <Route
                path='/salesPerson/create_New_Order'
                element={
                  <>
                    <ProtectedRoutes role={['Sales Person', 'Admin']}>
                      <PageTitle title='Create_New_Order' />
                      <Create_New_Order />
                    </ProtectedRoutes>
                  </>
                }
              />
              <Route
                path='/salesPerson/Schemes'
                element={
                  <>
                    <ProtectedRoutes role={['Sales Person', 'Admin']}>
                      <PageTitle title='Schemes' />
                      <ActiveSchemesOrder />
                    </ProtectedRoutes>
                  </>
                }
              />
              <Route
                path='/scheme'
                element={
                  <>
                    <ProtectedRoutes role={['Admin']}>
                      <PageTitle title='Schemes' />
                      <Scheme />
                    </ProtectedRoutes>
                  </>
                }
              />
              <Route
                path='/salesPerson/Customerslist'
                element={
                  <>
                    <ProtectedRoutes role={['Admin', 'Sales Person']}>
                      <PageTitle title='Customers List' />
                      <CustomersList />
                    </ProtectedRoutes>
                  </>
                }
              />
              <Route
                path='/salesPerson/Orders'
                element={
                  <>
                    <ProtectedRoutes
                      role={['Sales Person', 'Admin', 'Account Section']}
                    >
                      <PageTitle title='Orders' />
                      <Orders />
                    </ProtectedRoutes>
                  </>
                }
              />
              <Route
                path='/salesPerson/SalesPersonProfile'
                element={
                  <>
                    <ProtectedRoutes role={['Sales Person', 'Admin']}>
                      <PageTitle title='SalesPersonProfile' />
                      <SalesPersonProfile />
                    </ProtectedRoutes>
                  </>
                }
              />
              <Route
                path='/salesPerson/Wishlist'
                element={
                  <>
                    <ProtectedRoutes role={['Sales Person', 'Admin']}>
                      <PageTitle title='Wishlist' />
                      <Wishlist />
                    </ProtectedRoutes>
                  </>
                }
              />
              <Route
                path='/admin/Wishlist'
                element={
                  <>
                    <ProtectedRoutes role={['Admin']}>
                      <PageTitle title='Wishlist' />
                      <Admin_WishList />
                    </ProtectedRoutes>
                  </>
                }
              />
              <Route
                path='/accounting-manager/dashboard'
                element={
                  <>
                    <ProtectedRoutes role={['Account Section']}>
                      <PageTitle title='Dashboard' />
                      <AccountingDashboard />
                    </ProtectedRoutes>
                  </>
                }
              />
              <Route
                path='/salesPerson/dashboard'
                element={
                  <>
                    <ProtectedRoutes role={['Sales Person']}>
                      <PageTitle title='SalesePrsonDashboard' />
                      <Salespersondashboard />
                    </ProtectedRoutes>
                  </>
                }
              />
              <Route
                path='/administrator/CreateQRCode'
                element={
                  <>
                    <ProtectedRoutes role={['Admin', 'Administrator']}>
                      <PageTitle title='CreateQRCode' />
                      <CreateQRCode />
                    </ProtectedRoutes>
                  </>
                }
              />
              <Route
                path='/administrator/internal-warehouse-transfer'
                element={
                  <>
                    <ProtectedRoutes role={['Admin', 'Administrator']}>
                      <PageTitle title='CreateQRCode' />
                      <Internal_warehouse_transfer />
                    </ProtectedRoutes>
                  </>
                }
              />
              {/* <Route
                path="/administrator/CreateRoleForm"
                element={
                  <>
                    <ProtectedRoutes role={['Admin', 'Administrator']}>
                      <PageTitle title="CreateRoleForm" />
                      <CreateRoleForm />
                    </ProtectedRoutes>
                  </>
                }
              /> */}
              <Route
                path='/administrator/AdministratorDashboard'
                element={
                  <>
                    <ProtectedRoutes role={['Administrator']}>
                      <PageTitle title='AdministratorDashboard' />
                      <AdministratorDashboard />
                    </ProtectedRoutes>
                  </>
                }
              />
              <Route
                path='/prodction-manager/Productprofile'
                element={
                  <>
                    <ProtectedRoutes role={['Admin', 'Production Manager']}>
                      <PageTitle title='Productprofile' />
                      <Productprofile />
                    </ProtectedRoutes>
                  </>
                }
              />
              <Route
                path='/inventory/inventoryprofile'
                element={
                  <>
                    <ProtectedRoutes role={['Admin', 'Inventory Manager']}>
                      <PageTitle title='Inventoryprofile' />
                      <Inventoryprofile />
                    </ProtectedRoutes>
                  </>
                }
              />
              <Route
                path='/accounting-manager/accountingprofile'
                element={
                  <>
                    <ProtectedRoutes role={['Sales Person', 'Admin']}>
                      <PageTitle title='Accounting profile' />
                      <Accountingprofile />
                    </ProtectedRoutes>
                  </>
                }
              />
              <Route
                path='/add-articlecode'
                element={
                  <>
                    <ProtectedRoutes role={['Admin']}>
                      <PageTitle title='Article-Code' />
                      <AddArticleCode />
                    </ProtectedRoutes>
                  </>
                }
              />
              <Route
                path='/edit-articlecode/:id'
                element={
                  <>
                    <ProtectedRoutes role={['Admin']}>
                      <PageTitle title=' Edit Article-Code' />
                      <EditArticleCode />
                    </ProtectedRoutes>
                  </>
                }
              />
              <Route
                path='/warehouse-management/dashboard'
                element={
                  <>
                    <ProtectedRoutes role={['Admin', 'Warehouse Manager']}>
                      <PageTitle title='WarehouseDashboard' />
                      <WarehouseDashboard />
                    </ProtectedRoutes>
                  </>
                }
              />
              <Route
                path='/warehouse-management/CreateWarehouse'
                element={
                  <>
                    <ProtectedRoutes
                      role={['Admin', 'Administrator', 'Warehouse Manager']}
                    >
                      <PageTitle title='CreateWarehouse' />
                      <CreateWarehouse />
                    </ProtectedRoutes>
                  </>
                }
              />
              <Route
                path='/factory-management/CreateFactory'
                element={
                  <>
                    <ProtectedRoutes
                      role={[
                        'Admin',
                        'Sales Person',
                        'Production Manager',
                        'Administrator',
                        'Warehouse Manager'
                      ]}
                    >
                      <PageTitle title='CreateFactory' />
                      <CreateFactory />
                    </ProtectedRoutes>
                  </>
                }
              />
              <Route
                path='/factory-edit/:id'
                element={
                  <>
                    <ProtectedRoutes role={['Admin', 'Warehouse Manager']}>
                      <PageTitle title='CreateFactory' />
                      <EditFactory />
                    </ProtectedRoutes>
                  </>
                }
              />
              <Route
                path='/warehouse-edit/:id'
                element={
                  <>
                    <ProtectedRoutes
                      role={['Admin', 'Administrator', 'Warehouse Manager']}
                    >
                      <PageTitle title='EditWarehouse' />
                      <EditWarehouse />
                    </ProtectedRoutes>
                  </>
                }
              />
              <Route
                path='/QRScannerPage'
                element={
                  <>
                    <ProtectedRoutes role={['Production Manager']}>
                      <PageTitle title='QRScannerPage' />
                      <QRScannerPage />
                    </ProtectedRoutes>
                  </>
                }
              />
              <Route
                path='/warehouse-management/QRScanner'
                element={
                  <>
                    <ProtectedRoutes role={['Warehouse Manager']}>
                      <PageTitle title='QRScanner' />
                      <QRScanner />
                    </ProtectedRoutes>
                  </>
                }
              />
              <Route
                path='/warehouse-management/DispatchScanner'
                element={
                  <>
                    <ProtectedRoutes role={['Warehouse Manager']}>
                      <PageTitle title='DispatchScanner' />
                      <DispatchScanner />
                    </ProtectedRoutes>
                  </>
                }
              />
              <Route
                path='/warehouse-management/StockVerify'
                element={
                  <>
                    <ProtectedRoutes role={['Warehouse Manager']}>
                      <PageTitle title='StockVerify' />
                      <StockVerify />
                    </ProtectedRoutes>
                  </>
                }
              />

               <Route
                path='/warehouse-management/view-stock'
                element={
                  <>
                    <ProtectedRoutes role={['Warehouse Manager']}>
                      <PageTitle title='View Stock' />
                      <ViewWarehouseStock />
                    </ProtectedRoutes>
                  </>
                }
              />


              <Route
                path='/warehouse-management/Stock'
                element={
                  <>
                    <ProtectedRoutes role={['Warehouse Manager']}>
                      <PageTitle title='Stock' />
                      <Stock />
                    </ProtectedRoutes>
                  </>
                }
              />
              <Route
                path='/inventory-management/OrderDetails'
                element={
                  <>
                    <ProtectedRoutes role={['Inventory Manager']}>
                      <PageTitle title='Order Details' />
                      <OrderDetails />
                    </ProtectedRoutes>
                  </>
                }
              />

               <Route
                path='/account-section/view-order'
                element={
                  <>
                    <ProtectedRoutes role={['Account Section']}>
                      <PageTitle title='Account Section Order Details' />
                      <AccountSectionViewOrder />
                    </ProtectedRoutes>
                  </>
                }
              />


              <Route
                path='/inventory-management/article-list/upload/:id'
                element={
                  <>
                    <ProtectedRoutes role={['Inventory Manager']}>
                      <PageTitle title='upload Details' />
                      <UploadStatus />
                    </ProtectedRoutes>
                  </>
                }
              />
              <Route
                path='/manualProcess'
                element={
                  <>
                    <ProtectedRoutes role={['Production Manager']}>
                      <PageTitle title='QRDropdownPage' />
                      <QRDropdownPage />
                    </ProtectedRoutes>
                  </>
                }
              />
              <Route
                path='/manualDispatch'
                element={
                  <>
                    <ProtectedRoutes role={['Warehouse Manager']}>
                      <PageTitle title='WarehouseDropdown' />
                      <WarehouseDropdown />
                    </ProtectedRoutes>
                  </>
                }
              />
              <Route
                path='/ArticalData'
                element={
                  <>
                    <ProtectedRoutes
                      role={['Inventory Manager', 'Sales Person']}
                    >
                      <PageTitle title='ArticalData' />
                      <ArticalData />
                     
                    </ProtectedRoutes>
                  </>
                }
              />

                 <Route
                path="/production-manager/view-details/:id"
                element={
                  <>
                    <ProtectedRoutes
                      role={['Admin', 'Administrator', 'Production Manager']}
                    >
                      <PageTitle title="View Production" />
                      <ViewProduction />
                    </ProtectedRoutes>
                  </>
                }
              />
              <Route
                path='/ArticalData'
                element={
                  <>
                    <ProtectedRoutes
                      role={['Inventory Manager', 'Sales Person']}
                    >
                      <PageTitle title='ArticalData' />
                      <ArticalData />
                    </ProtectedRoutes>
                  </>
                }
              />
              <Route
                path='/ArticleDataWarehouse'
                element={
                  <>
                    <ProtectedRoutes role={['Warehouse Manager']}>
                      <PageTitle title='ArticleDataWarehouse' />
                      <ArticleDataWarehouse />
                    </ProtectedRoutes>
                  </>
                }
              />
            </Routes>
            <ToastContainer position='top-right' autoClose={1000} />
          </DefaultLayout>
        }
      />
    </Routes>
  )
}

export default App
