import { Link } from 'react-router-dom';
import { useAuth } from '../../../../Context/AuthContext';

const Breadcrumb = ({ pageName }) => {
  const {user}  = useAuth()
  const roleDashboardMap = {
    Admin: '/dashboard',
    Administrator: '/administrator/AdministratorDashboard',
    'Account Section': '/accounting-manager/dashboard',
    'Packing Reporter': '/production-manager/dashboard',
    'Warehouse Manager': '/warehouse-manager/dashboard',
    'Inventory Manager': '/inventory-management/dashboard',
    'Sales Person': '/salesPerson/dashboard',
  };

  const userDashboard = roleDashboardMap[user?.user?.role] || '/dashboard'; 
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-title-md2 font-semibold text-black dark:text-white">
        {pageName}
      </h2>

      <nav>
        <ol className="flex items-center gap-2">
          <li>
            <Link className="font-medium" to= {userDashboard}>
              Dashboard /
            </Link>
          </li>
          <li className="font-medium text-primary">{pageName}</li>
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
