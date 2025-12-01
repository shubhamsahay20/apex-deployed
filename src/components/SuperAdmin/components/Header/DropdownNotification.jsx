import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import ClickOutside from '../ClickOutside';
import { IoIosNotificationsOutline } from 'react-icons/io';
import { useAuth } from '../../../../Context/AuthContext';
import { ImCross } from "react-icons/im";

const DropdownNotification = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifying, setNotifying] = useState(true);

  const { notifications,notificationCount, removeNotification } = useAuth();

  // const notificationCount = notifications.length;

  // Group notifications into Today & Yesterday
  const groupedNotifications = useMemo(() => {
    const todayList = [];
    const yesterdayList = [];

    const todayDate = new Date().toDateString();

    notifications.forEach((n) => {
      const nDate = new Date(n.time).toDateString();
      if (nDate === todayDate) {
        todayList.push(n);
      } else {
        yesterdayList.push(n);
      }
    });

    return {
      today: todayList,
      yesterday: yesterdayList,
    };
  }, [notifications]);

  const getColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <li>
        <Link
          onClick={() => {
            setNotifying(false);
            setDropdownOpen(!dropdownOpen);
          }}
          to="#"
          className="relative flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 bg-white hover:text-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
        >
          <div className="relative">
            <IoIosNotificationsOutline className="text-3xl" />
            {notifying && notificationCount > 0 && (
              <span className="absolute top-0 right-0 flex h-3 w-3 items-center justify-center rounded-full text-red-500 bg-white text-[11px] font-bold shadow-sm">
                {notificationCount}
              </span>
            )}
          </div>
        </Link>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2.5 flex w-[350px] max-h-[400px] flex-col overflow-y-auto rounded-md border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
            <h5 className="mb-2 text-base font-semibold text-black dark:text-white">
              Notifications
            </h5>

            {/* Today */}
            {groupedNotifications.today.length > 0 && (
              <div className="mb-4">
                <p className="mb-2 text-xs font-medium text-gray-500">Today</p>
                {groupedNotifications.today.map((item) => (
                  <div
                    key={item.id}
                    className="mb-2 flex items-center justify-between rounded-md bg-[#eef4ff] p-3 transition-colors hover:bg-[#e2ecff]"
                  >
                    <div className="flex items-start gap-2">
                      <span
                        className={`mt-1 h-3 w-3 rounded-full ${getColor(item.type)}`}
                      ></span>
                      <div>
                        <p className="text-sm font-medium text-black dark:text-white">
                          {item.message}
                        </p>
                        <p className="text-xs text-gray-500">{item.time}</p>
                      </div>
                    </div>
                    <button
                      className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white"
                      onClick={() => removeNotification(item.id)}
                    >
                      <ImCross />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Yesterday */}
            {groupedNotifications.yesterday.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-medium text-gray-500">
                  Yesterday
                </p>
                {groupedNotifications.yesterday.map((item) => (
                  <div
                    key={item.id}
                    className="mb-2 flex items-center justify-between rounded-md bg-[#eef4ff] p-3 transition-colors hover:bg-[#e2ecff]"
                  >
                    <div className="flex items-start gap-2">
                      <span
                        className={`mt-1 h-3 w-3 rounded-full ${getColor(item.type)}`}
                      ></span>
                      <div>
                        <p className="text-sm font-medium text-black dark:text-white">
                          {item.message}
                        </p>
                        <p className="text-xs text-gray-500">{item.time}</p>
                      </div>
                    </div>
                    <button
                      className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white"
                      onClick={() => removeNotification(item.id)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* No Notifications */}
            {groupedNotifications.today.length === 0 &&
              groupedNotifications.yesterday.length === 0 && (
                <p className="text-sm text-gray-500">No notifications</p>
              )}
          </div>
        )}
      </li>
    </ClickOutside>
  );
};

export default DropdownNotification;
