import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ClickOutside from '../ClickOutside';
import { useAuth } from '../../../../Context/AuthContext';
import authService from '../../../../api/auth.service';
import { toast } from 'react-toastify';

const DropdownUser = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogOut = async () => {
    try {
      await authService.logout();
      toast.success('User Logout');
      navigate(`/login`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Logout failed');
    }
  };

  // Helper for avatar fallback
  const name = user?.user?.name || 'User';
  const profileImage = user?.user?.profileImage;
  const initial = name.charAt(0).toUpperCase();
  const colors = [
    '#E57373',
    '#64B5F6',
    '#81C784',
    '#FFD54F',
    '#BA68C8',
    '#4DB6AC',
  ];
  const color = colors[name.charCodeAt(0) % colors.length];

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <Link
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-4"
        to="#"
      >
        <span className="hidden text-right lg:block">
          <span className="block text-sm font-medium text-black dark:text-white">
            {name}
          </span>
          <span className="block text-xs">{user?.user?.role}</span>
        </span>

        {/*  Avatar (Image or Initial) */}
        {profileImage ? (
          <span className="h-12 w-12 rounded-full overflow-hidden border">
            <img
              src={profileImage}
              alt={name}
              className="w-full h-full object-cover"
            />
          </span>
        ) : (
          <span
            className="h-12 w-12 rounded-full flex items-center justify-center text-white text-lg font-semibold border"
            style={{ backgroundColor: color }}
          >
            {initial}
          </span>
        )}

        <svg
          className="hidden fill-current sm:block"
          width="12"
          height="8"
          viewBox="0 0 12 8"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0.410765 0.910734C0.736202 0.585297 1.26384 0.585297 1.58928 0.910734L6.00002 5.32148L10.4108 0.910734C10.7362 0.585297 11.2638 0.585297 11.5893 0.910734C11.9147 1.23617 11.9147 1.76381 11.5893 2.08924L6.58928 7.08924C6.26384 7.41468 5.7362 7.41468 5.41077 7.08924L0.410765 2.08924C0.0853277 1.76381 0.0853277 1.23617 0.410765 0.910734Z"
          />
        </svg>
      </Link>

      {/* <!-- Dropdown Start --> */}
      {dropdownOpen && (
        <div
          className={`absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark`}
        >
          <ul className="flex flex-col gap-5 border-b border-stroke px-6 py-7.5 dark:border-strokedark">
            <li>
              <Link
                to="/profile"
                className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
              >
                <svg
                  className="fill-current"
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M11 9.62499C8.42188 9.62499 6.35938 7.59687 6.35938 5.12187C6.35938 2.64687 8.42188 0.618744 11 0.618744C13.5781 0.618744 15.6406 2.64687 15.6406 5.12187C15.6406 7.59687 13.5781 9.62499 11 9.62499Z" />
                  <path d="M17.7719 21.4156H4.2281C3.5406 21.4156 2.9906 20.8656 2.9906 20.1781V17.0844C2.9906 13.7156 5.7406 10.9656 9.10935 10.9656H12.925C16.2937 10.9656 19.0437 13.7156 19.0437 17.0844V20.1781C19.0094 20.8312 18.4594 21.4156 17.7719 21.4156Z" />
                </svg>
                My Profile
              </Link>
            </li>
          </ul>

          <button
            onClick={handleLogOut}
            className="flex items-center gap-3.5 px-6 py-4 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="fill-current"
              width="22"
              height="22"
              viewBox="0 0 24 24"
            >
              <path d="M16 13v-2H7V8l-5 4 5 4v-3h9z" />
              <path d="M20 3h-8v2h8v14h-8v2h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z" />
            </svg>
            Log Out
          </button>
        </div>
      )}
      {/* <!-- Dropdown End --> */}
    </ClickOutside>
  );
};

export default DropdownUser;
