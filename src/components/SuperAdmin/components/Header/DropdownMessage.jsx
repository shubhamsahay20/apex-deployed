import { useState } from 'react';
import { Link } from 'react-router-dom';
import ClickOutside from '../ClickOutside';
import { CiHeart } from "react-icons/ci";

import UserOne from '../../../../images/user/user-01.png';
import UserTwo from '../../../../images/user/user-02.png';
import UserThree from '../../../../images/user/user-03.png';
import UserFour from '../../../../images/user/user-04.png';

const likesData = [
  {
    userImg: UserTwo,
    userName: 'Mariya Desoja',
    productName: 'Red Shoes',
    time: '2min ago',
  },
  {
    userImg: UserOne,
    userName: 'Robert Jhon',
    productName: 'Smart Watch',
    time: '10min ago',
  },
  {
    userImg: UserThree,
    userName: 'Henry Dholi',
    productName: 'Blue Jacket',
    time: '1 day ago',
  },
  {
    userImg: UserFour,
    userName: 'Cody Fisher',
    productName: 'Wireless Earbuds',
    time: '5 days ago',
  },
];

const DropdownMessage = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifying, setNotifying] = useState(true);

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <li className="relative">
        <Link
          onClick={() => {
            setNotifying(false);
            setDropdownOpen(!dropdownOpen);
          }}
          className="relative flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 bg-white hover:text-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
          to="#"
        >
          {/* Dot */}
          <span
            className={`absolute -top-0.5 -right-0.5 z-10 h-2 w-2 rounded-full bg-meta-1 ${
              notifying === false ? 'hidden' : 'inline'
            }`}
          >
            <span className="absolute -z-10 inline-flex h-full w-full animate-ping rounded-full bg-meta-1 opacity-75"></span>
          </span>

          <CiHeart className="text-2xl" />
        </Link>

        {/* Dropdown */}
        {dropdownOpen && (
          <div className="absolute -right-16 mt-2.5 flex w-80 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="px-4.5 py-3">
              <h5 className="text-sm font-medium text-bodydark2">Likes</h5>
            </div>

            <ul className="flex flex-col overflow-y-auto max-h-80">
              {likesData.map((like, index) => (
                <li key={index}>
                  <Link
                    to="/products"
                    className="flex gap-4.5 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
                  >
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full">
                      <img src={like.userImg} alt={like.userName} />
                    </div>

                    <div>
                      <h6 className="text-sm font-medium text-black dark:text-white">{like.userName}</h6>
                      <p className="text-sm">
                        liked your product{' '}
                        <span className="font-semibold text-primary">{like.productName}</span>
                      </p>
                      <p className="text-xs text-gray-500">{like.time}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </li>
    </ClickOutside>
  );
};

export default DropdownMessage;
