import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import SidebarLinkGroup from './SidebarLinkGroup';
import { useAuth } from '../../../../Context/AuthContext';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const { pathname } = location;

  const { user } = useAuth();

  const trigger = useRef(null);
  const sidebar = useRef(null);

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true',
  );

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-white duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex items-center justify-between gap-2 px-8 py-5.5 lg:py-6.5">
        <NavLink to="/">
          <div className="w-46 h-15">
            <img
              src={'/images/Logo.jpg'}
              alt="Logo"
              className="w-full h-full object-contain"
            />
          </div>
        </NavLink>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        >
          <svg
            className="fill-current"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
              fill=""
            />
          </svg>
        </button>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        <nav className=" py-4 px-4 lg:px-6">
          <div>
            <ul className=" flex flex-col gap-1.5">
              {/* Role Based Dashboard */}

              {user?.user?.role === 'Admin' && (
                <li>
                  <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                      'group relative flex items-center gap-2.5   mt-2  rounded-md px-4 font-medium text-[#606060] hover:text-[#007CF0] duration-300 ease-in-out  ' +
                      (isActive && '!text-blue-500')
                    }
                  >
                    <svg
                      className="text-gray-800 group-hover:text-blue-600"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect x="3" y="3" width="7" height="7" rx="1.5" />
                      <rect x="14" y="3" width="7" height="5" rx="1.5" />
                      <rect x="14" y="10" width="7" height="11" rx="1.5" />
                      <rect x="3" y="14" width="7" height="7" rx="1.5" />
                    </svg>
                    Dashboard
                  </NavLink>
                </li>
              )}

              {user?.user?.role === 'Sales Person' && (
                <li>
                  <NavLink
                    to="/salesPerson/dashboard"
                    className={({ isActive }) =>
                      'group relative flex items-center gap-2.5   mt-2  rounded-md px-4 font-medium text-[#606060] hover:text-[#007CF0] duration-300 ease-in-out  ' +
                      (isActive && '!text-blue-500')
                    }
                  >
                    <svg
                      className="text-gray-800 group-hover:text-blue-600"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect x="3" y="3" width="7" height="7" rx="1.5" />
                      <rect x="14" y="3" width="7" height="5" rx="1.5" />
                      <rect x="14" y="10" width="7" height="11" rx="1.5" />
                      <rect x="3" y="14" width="7" height="7" rx="1.5" />
                    </svg>
                    Dashboard
                  </NavLink>
                </li>
              )}

              {user?.user?.role === 'Account Section' && (
                <li>
                  <NavLink
                    to="/accounting-manager/dashboard"
                    className={({ isActive }) =>
                      'group relative flex items-center gap-2.5   mt-2  rounded-md px-4 font-medium text-[#606060] hover:text-[#007CF0] duration-300 ease-in-out  ' +
                      (isActive && '!text-blue-500')
                    }
                  >
                    <svg
                      className="text-gray-800 group-hover:text-blue-600"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect x="3" y="3" width="7" height="7" rx="1.5" />
                      <rect x="14" y="3" width="7" height="5" rx="1.5" />
                      <rect x="14" y="10" width="7" height="11" rx="1.5" />
                      <rect x="3" y="14" width="7" height="7" rx="1.5" />
                    </svg>
                    Dashboard
                  </NavLink>
                </li>
              )}

              {user?.user?.role === 'Administrator' && (
                <li>
                  <NavLink
                    to="/administrator/AdministratorDashboard"
                    className={({ isActive }) =>
                      'group relative flex items-center gap-2.5   mt-2  rounded-md px-4 font-medium text-[#606060] hover:text-[#007CF0] duration-300 ease-in-out  ' +
                      (isActive && '!text-blue-500')
                    }
                  >
                    <svg
                      className="text-gray-800 group-hover:text-blue-600"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect x="3" y="3" width="7" height="7" rx="1.5" />
                      <rect x="14" y="3" width="7" height="5" rx="1.5" />
                      <rect x="14" y="10" width="7" height="11" rx="1.5" />
                      <rect x="3" y="14" width="7" height="7" rx="1.5" />
                    </svg>
                    Dashboard
                  </NavLink>
                </li>
              )}

              {user?.user?.role === 'Production Manager' && (
                <li>
                  <NavLink
                    to="/production-manager/dashboard"
                    className={({ isActive }) =>
                      'group relative flex items-center gap-2.5   mt-2  rounded-md px-4 font-medium text-[#606060] hover:text-[#007CF0] duration-300 ease-in-out  ' +
                      (isActive && '!text-blue-500')
                    }
                  >
                    <svg
                      className="text-gray-800 group-hover:text-blue-600"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect x="3" y="3" width="7" height="7" rx="1.5" />
                      <rect x="14" y="3" width="7" height="5" rx="1.5" />
                      <rect x="14" y="10" width="7" height="11" rx="1.5" />
                      <rect x="3" y="14" width="7" height="7" rx="1.5" />
                    </svg>
                    Dashboard
                  </NavLink>
                </li>
              )}

              {user?.user?.role === 'Inventory Manager' && (
                <li>
                  <NavLink
                    to="/inventory-management/dashboard"
                    className={({ isActive }) =>
                      'group relative flex items-center gap-2.5   mt-2  rounded-md px-4 font-medium text-[#606060] hover:text-[#007CF0] duration-300 ease-in-out  ' +
                      (isActive && '!text-blue-500')
                    }
                  >
                    <svg
                      className="text-gray-800 group-hover:text-blue-600"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect x="3" y="3" width="7" height="7" rx="1.5" />
                      <rect x="14" y="3" width="7" height="5" rx="1.5" />
                      <rect x="14" y="10" width="7" height="11" rx="1.5" />
                      <rect x="3" y="14" width="7" height="7" rx="1.5" />
                    </svg>
                    Dashboard
                  </NavLink>
                </li>
              )}

              {user?.user?.role === 'Warehouse Manager' && (
                <li>
                  <NavLink
                    to="/warehouse-management/dashboard"
                    className={({ isActive }) =>
                      'group relative flex items-center gap-2.5   mt-2  rounded-md px-4 font-medium text-[#606060] hover:text-[#007CF0] duration-300 ease-in-out  ' +
                      (isActive && '!text-blue-500')
                    }
                  >
                    <svg
                      className="text-gray-800 group-hover:text-blue-600"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect x="3" y="3" width="7" height="7" rx="1.5" />
                      <rect x="14" y="3" width="7" height="5" rx="1.5" />
                      <rect x="14" y="10" width="7" height="11" rx="1.5" />
                      <rect x="3" y="14" width="7" height="7" rx="1.5" />
                    </svg>
                    Dashboard
                  </NavLink>
                </li>
              )}

              {user?.user?.role === 'Admin' && (
                <li>
                  <NavLink
                    to="/SalesOrder"
                    className={({ isActive }) =>
                      'group relative flex items-center gap-2.5   mt-2  rounded-md px-4 font-medium text-[#606060] hover:text-[#007CF0] duration-300 ease-in-out  ' +
                      (isActive && '!text-blue-500')
                    }
                  >
                    <svg
                      className="fill-current text-gray-800"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11.0229 17.8543H9.64879C9.55723 17.8543 9.49609 17.9154 9.49609 18.007C9.49609 18.0986 9.55723 18.1597 9.64879 18.1597H11.0229C11.1144 18.1597 11.1756 18.0986 11.1756 18.007C11.1756 17.9306 11.0993 17.8543 11.0229 17.8543Z"
                        fill="currentColor"
                      />
                      <path
                        d="M19.6778 2.84592C19.228 2.39615 18.6305 2.14872 17.9939 2.14872L6.56664 2.14844C5.93011 2.14844 5.33285 2.39587 4.88276 2.84565C4.43298 3.29542 4.18555 3.89297 4.18555 4.52953V19.7673C4.18555 20.4039 4.43298 21.0011 4.88276 21.4512C5.33253 21.901 5.93008 22.1484 6.56664 22.1484H17.9954C18.6319 22.1484 19.2291 21.901 19.6792 21.4512C20.129 21.0015 20.3764 20.4039 20.3764 19.7673V4.52953C20.3753 3.89328 20.1279 3.29574 19.6781 2.84593L19.6778 2.84592ZM19.4234 19.7681C19.4234 20.5561 18.783 21.1965 17.9951 21.1965H6.56633C5.77836 21.1965 5.13796 20.5561 5.13796 19.7681V4.52959C5.13796 3.74163 5.77839 3.10122 6.56633 3.10122H17.9951C18.783 3.10122 19.4234 3.74165 19.4234 4.52959V19.7681Z"
                        fill="currentColor"
                      />
                      <path
                        d="M10.0389 10.86L8.47085 12.4284L7.85547 11.813C7.66982 11.6274 7.36756 11.6274 7.1822 11.813C6.99656 11.9987 6.99656 12.301 7.1822 12.4863L8.1349 13.439C8.2248 13.5289 8.34532 13.5787 8.47196 13.5787C8.59859 13.5787 8.71939 13.5289 8.80901 13.439L10.7141 11.5339C10.8998 11.3483 10.8998 11.046 10.7141 10.8606C10.5285 10.6747 10.2243 10.6736 10.0389 10.8601L10.0389 10.86Z"
                        fill="currentColor"
                      />
                      <path
                        d="M10.0389 15.6206L8.47085 17.1887L7.85547 16.5733C7.66982 16.3877 7.36756 16.3877 7.1822 16.5733C6.99656 16.759 6.99656 17.0612 7.1822 17.2466L8.1349 18.1993C8.2248 18.2892 8.34532 18.339 8.47196 18.339C8.59859 18.339 8.71939 18.2892 8.80901 18.1993L10.7141 16.2942C10.8998 16.1085 10.8998 15.8063 10.7141 15.6209C10.5285 15.435 10.2243 15.435 10.0389 15.6206L10.0389 15.6206Z"
                        fill="currentColor"
                      />
                      <path
                        d="M10.0389 6.09712L8.47085 7.66522L7.85547 7.04985C7.66982 6.8642 7.36756 6.8642 7.1822 7.04985C6.99656 7.23549 6.99656 7.53775 7.1822 7.72311L8.1349 8.67582C8.2248 8.76571 8.34532 8.81553 8.47196 8.81553C8.59859 8.81553 8.71939 8.76571 8.80901 8.67582L10.7141 6.7707C10.8998 6.58505 10.8998 6.28279 10.7141 6.09743C10.5285 5.91178 10.2243 5.91178 10.0389 6.09715L10.0389 6.09712Z"
                        fill="currentColor"
                      />
                      <path
                        d="M17.0428 11.6729H12.2806C12.0173 11.6729 11.8047 11.8863 11.8047 12.1488C11.8047 12.4112 12.0182 12.6247 12.2806 12.6247H17.0428C17.3061 12.6247 17.5187 12.4112 17.5187 12.1488C17.5187 11.8855 17.3052 11.6729 17.0428 11.6729Z"
                        fill="currentColor"
                      />
                      <path
                        d="M17.0428 17.3869H12.2806C12.0173 17.3869 11.8047 17.6004 11.8047 17.8628C11.8047 18.1253 12.0182 18.3388 12.2806 18.3388H17.0428C17.3061 18.3388 17.5187 18.1253 17.5187 17.8628C17.5187 17.6004 17.3052 17.3869 17.0428 17.3869Z"
                        fill="currentColor"
                      />
                      <path
                        d="M17.0428 6.9101H12.2806C12.0173 6.9101 11.8047 7.12357 11.8047 7.38603C11.8047 7.64849 12.0182 7.86197 12.2806 7.86197H17.0428C17.3061 7.86197 17.5187 7.64849 17.5187 7.38603C17.5187 7.12357 17.3052 6.9101 17.0428 6.9101Z"
                        fill="currentColor"
                      />
                      <path
                        d="M11.0229 18.9228H9.64879C9.55723 18.9228 9.49609 18.9839 9.49609 19.0755C9.49609 19.167 9.55723 19.2282 9.64879 19.2282H11.0229C11.1144 19.2282 11.1756 19.167 11.1756 19.0755C11.1756 18.9839 11.0993 18.9228 11.0229 18.9228Z"
                        fill="currentColor"
                      />
                    </svg>
                    Sales Order
                  </NavLink>
                </li>
              )}

              {user?.user?.role === 'Inventory Manager' && (
                <li>
                  <NavLink
                    to="/inventory-management/article-list"
                    className={({ isActive }) =>
                      `group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-[#606060] duration-300 ease-in-out hover:text-[#007CF0] dark:hover:bg-meta-4 ${
                        isActive ? 'bg-white text-[#007CF0] dark:bg-meta-4' : ''
                      }`
                    }
                  >
                    <svg
                      className="fill-current text-gray-600 group-hover:text-blue-500"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="9"
                        y="2"
                        width="6"
                        height="6"
                        rx="1"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M12 2V8"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />

                      <rect
                        x="3"
                        y="10"
                        width="6"
                        height="6"
                        rx="1"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M6 10V16"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />

                      <rect
                        x="15"
                        y="10"
                        width="6"
                        height="6"
                        rx="1"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M18 10V16"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                    Inventory Management
                  </NavLink>
                </li>
              )}

              {(user?.user?.role === 'Admin' ||
                user?.user?.role === 'Administrator') && (
                <SidebarLinkGroup
                  activeCondition={
                    pathname === '/forms' || pathname.includes('forms')
                  }
                >
                  {(handleClick, open) => {
                    return (
                      <React.Fragment>
                        <NavLink
                          to="#"
                          className={({ isActive }) =>
                            `group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-[#606060] duration-300 ease-in-out hover:text-[#007CF0] dark:hover:bg-meta-4 ${
                              isActive ||
                              pathname === '/forms' ||
                              pathname.includes('forms')
                                ? 'bg-white text-[#007CF0] dark:bg-meta-4'
                                : ''
                            }`
                          }
                          onClick={(e) => {
                            e.preventDefault();
                            sidebarExpanded
                              ? handleClick()
                              : setSidebarExpanded(true);
                          }}
                        >
                          <svg
                            className="fill-current text-gray-800"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M6.39941 2.8056C6.58696 2.75275 6.80066 2.85913 6.85449 3.0722L7.44336 5.27142L12.0771 4.05658L12.1553 4.04388C12.3363 4.03196 12.5071 4.13519 12.5547 4.32416L13.5371 7.9599L17.1289 6.99994L17.207 6.98724C17.3879 6.97529 17.5586 7.07799 17.6064 7.26654L19.4473 14.1015L21.0918 13.6738L21.1699 13.6611C21.3509 13.6491 21.5217 13.7524 21.5693 13.9413L22.0098 15.5634L22.0352 15.6816C22.1318 16.2718 21.7795 16.8747 21.1855 16.9902L21.1865 16.9911L15.2451 18.5566C15.319 19.7233 14.5683 20.8112 13.3994 21.1152L13.4004 21.1161C12.2316 21.4433 11.0176 20.8695 10.5098 19.8281L9.53027 20.0966H9.5293C9.32201 20.1484 9.10639 20.0455 9.05176 19.83L5.05566 5.11517L3.15625 5.58978C2.66711 5.71199 2.1309 5.41922 1.98438 4.90619C1.83715 4.39059 2.15651 3.87827 2.66699 3.73236L2.66895 3.73138L6.39941 2.80463V2.8056ZM14.4277 18.413C14.2479 17.514 13.2795 16.8605 12.2881 17.1308H12.2871C11.3419 17.3786 10.802 18.3459 11.0947 19.2919C11.3645 20.1688 12.2862 20.6652 13.1875 20.4179L13.3457 20.3642C14.1162 20.0644 14.6173 19.2777 14.4277 18.414V18.413ZM2.85547 4.45502C2.73855 4.49232 2.69983 4.60492 2.72656 4.70697C2.73995 4.7576 2.76888 4.80098 2.80859 4.82709C2.84723 4.85249 2.89975 4.86399 2.96777 4.84467H2.96973L5.24121 4.28802L5.25293 4.2851V4.28705H5.32227C5.46608 4.28705 5.6031 4.38901 5.66992 4.51849L5.69434 4.57611L5.69531 4.57806V4.57904L9.69141 19.2704L10.2715 19.1288C10.1771 18.4611 10.3557 17.7402 10.8076 17.1953L10.3408 17.3163H10.3398C10.1324 17.368 9.91659 17.2647 9.8623 17.0488L6.21387 3.60931L2.85547 4.45502ZM13.6299 16.4619C14.2774 16.701 14.8124 17.218 15.0615 17.8564L20.9756 16.2929C21.1741 16.2386 21.2941 16.0581 21.2793 15.8603L21.2646 15.7744L20.9297 14.5244C18.6525 15.133 15.8599 15.8704 13.6299 16.4619ZM8.74414 10.0263L10.502 16.4872L18.7246 14.3124L16.9668 7.84955L8.74414 10.0263ZM7.6543 6.01654L8.53223 9.28021L12.792 8.14838L11.915 4.88373L7.6543 6.01654Z"
                              fill="currentColor"
                              stroke="#333333"
                              strokeWidth="0.2"
                            />
                          </svg>
                          Inventory
                          <svg
                            className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                              open && 'rotate-180'
                            }`}
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                              fill=""
                            />
                          </svg>
                        </NavLink>
                        {/* <!-- Dropdown Menu Start --> */}
                        <div
                          className={`translate transform overflow-hidden ${
                            !open && 'hidden'
                          }`}
                        >
                          {(user?.user?.role === 'Admin' ||
                            user?.user?.role === 'Administrator') && (
                            <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                              <li>
                                <NavLink
                                  to="/articleList"
                                  className={({ isActive }) =>
                                    'group relative flex items-center gap-2.5rounded-md px-4 font-medium text-[#606060] hover:text-[#007CF0] duration-300 ease-in-out  ' +
                                    (isActive && '!text-blue-500')
                                  }
                                >
                                  Articles List
                                </NavLink>
                              </li>
                              <li>
                                <NavLink
                                  to="/inventory/delivery-orders"
                                  className={({ isActive }) =>
                                    'group relative flex items-center gap-2.5   mt-2  rounded-md px-4 font-medium text-[#606060] hover:text-[#007CF0] duration-300 ease-in-out  ' +
                                    (isActive && '!text-blue-500')
                                  }
                                >
                                  Delivery Orders
                                </NavLink>
                              </li>
                              <li>
                                <NavLink
                                  to="/inventory/internal-transfers"
                                  className={({ isActive }) =>
                                    'group relative flex items-center gap-2.5 rounded-md mt-2 px-4 font-medium text-[#606060] hover:text-[#007CF0] duration-300 ease-in-out  ' +
                                    (isActive && '!text-blue-500')
                                  }
                                >
                                  Internal Transfers
                                </NavLink>
                              </li>
                            </ul>
                          )}
                        </div>
                        {/* <!-- Dropdown Menu End --> */}
                      </React.Fragment>
                    );
                  }}
                </SidebarLinkGroup>
              )}

              {user?.user?.role === 'Admin' && (
                <li>
                  <NavLink
                    to="/customer-management"
                    className={({ isActive }) =>
                      'group relative flex items-center gap-2.5   mt-2  rounded-md px-4 font-medium text-[#606060] hover:text-[#007CF0] duration-300 ease-in-out  ' +
                      (isActive && '!text-blue-500')
                    }
                  >
                    <svg
                      className="fill-current"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 12c2.21 0 4-1.79 4-4S14.21 4 12 4 8 5.79 8 8s1.79 4 4 4Zm0 2c-2.67 0-8 1.34-8 4v2c0 .55.45 1 1 1h8.26a6.5 6.5 0 0 1-.76-3c0-1.1.28-2.14.77-3H12Zm6.94 1.06-1.03.17c-.17-.13-.35-.24-.54-.34l-.15-1.05a.5.5 0 0 0-.5-.43h-1a.5.5 0 0 0-.5.43l-.15 1.05c-.19.1-.37.21-.54.34l-1.03-.17a.5.5 0 0 0-.58.36l-.25.96c-.07.26.08.52.33.6l.98.39c-.01.09-.02.19-.02.29s.01.2.02.29l-.98.39a.5.5 0 0 0-.33.6l.25.96c.08.27.34.43.58.36l1.03-.17c.17.13.35.24.54.34l.15 1.05c.05.27.25.43.5.43h1c.25 0 .45-.16.5-.43l.15-1.05c.19-.1.37-.21.54-.34l1.03.17c.24.07.5-.09.58-.36l.25-.96a.5.5 0 0 0-.33-.6l-.98-.39c.01-.09.02-.19.02-.29s-.01-.2-.02-.29l.98-.39a.5.5 0 0 0 .33-.6l-.25-.96a.5.5 0 0 0-.58-.36ZM18 19.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z"
                        fill="currentColor"
                      />
                    </svg>
                    Customer Management
                  </NavLink>
                </li>
              )}

              {(user?.user?.role === 'Admin' ||
                user?.user?.role === 'Administrator') && (
                <li>
                  <NavLink
                    to="/role-management"
                    className={({ isActive }) =>
                      'group relative flex items-center gap-2.5   mt-2  rounded-md px-4 font-medium text-[#606060] hover:text-[#007CF0] duration-300 ease-in-out  ' +
                      (isActive && '!text-blue-500')
                    }
                  >
                    <svg
                      className="fill-current"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4ZM12 14c-2.67 0-8 1.34-8 4v2c0 .55.45 1 1 1h7.1c-.07-.33-.1-.66-.1-1 0-1.01.25-1.96.7-2.8C12.47 15.44 12.24 14.74 12 14Zm9.94 2.66-.71-.11c-.14-.5-.36-.97-.65-1.39l.42-.59a.5.5 0 0 0-.04-.63l-1.06-1.06a.5.5 0 0 0-.63-.04l-.59.42c-.42-.29-.89-.51-1.39-.65l-.11-.71A.5.5 0 0 0 17.25 12h-1.5a.5.5 0 0 0-.5.42l-.11.71c-.5.14-.97.36-1.39.65l-.59-.42a.5.5 0 0 0-.63.04l-1.06 1.06a.5.5 0 0 0-.04.63l.42.59c-.29.42-.51.89-.65 1.39l-.71.11a.5.5 0 0 0-.42.5v1.5c0 .24.18.46.42.5l.71.11c.14.5.36.97.65 1.39l-.42.59a.5.5 0 0 0 .04.63l1.06 1.06c.18.18.46.2.63.04l.59-.42c.42.29.89.51 1.39.65l.11.71c.04.24.25.42.5.42h1.5c.24 0 .46-.18.5-.42l.11-.71c.5-.14.97-.36 1.39-.65l.59.42c.18.15.45.14.63-.04l1.06-1.06a.5.5 0 0 0 .04-.63l-.42-.59c.29-.42.51-.89.65-1.39l.71-.11c.24-.04.42-.25.42-.5v-1.5a.5.5 0 0 0-.42-.5ZM18 20.25c-1.24 0-2.25-1.01-2.25-2.25S16.76 15.75 18 15.75 20.25 16.76 20.25 18 19.24 20.25 18 20.25Z"
                        fill="currentColor"
                      />
                    </svg>
                    Role Management
                  </NavLink>
                </li>
              )}

              {/* // factory */}
              {(user?.user?.role === 'Admin' ||
                user?.user?.role === 'Administrator' ||
                user?.user?.role === '') && (
                <li>
                  <NavLink
                    to="/factory-management"
                    className={({ isActive }) =>
                      'group relative flex items-center gap-2.5   mt-2  rounded-md px-4 font-medium text-[#606060] hover:text-[#007CF0] duration-300 ease-in-out  ' +
                      (isActive && '!text-blue-500')
                    }
                  >
                    <svg
                      className="fill-current"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2 18.8889V7.5L7.5 10V7.5L12.5 10V5.83333L18 8.33333V18.8889H2ZM0 5.83333C0 4.54467 1.04467 3.5 2.33333 3.5H6.66667V1.11111C6.66667 0.497778 7.16444 0 7.77778 0H12.2222C12.8356 0 13.3333 0.497778 13.3333 1.11111V3.5H17.6667C18.9553 3.5 20 4.54467 20 5.83333V18.8889C20 19.5022 19.5022 20 18.8889 20H1.11111C0.497778 20 0 19.5022 0 18.8889V5.83333ZM5.55556 15.5556H7.22222V13.8889H5.55556V15.5556ZM9.44444 15.5556H11.1111V13.8889H9.44444V15.5556ZM13.3333 15.5556H15V13.8889H13.3333V15.5556Z"
                        fill="currentColor"
                      />
                    </svg>
                    Factory Management
                  </NavLink>
                </li>
              )}

              {(user?.user?.role === 'Admin' ||
                user?.user?.role === 'Administrator' ||
                user?.user?.role === '') && (
                <li>
                  <NavLink
                    to="/warehouse-management"
                    className={({ isActive }) =>
                      'group relative flex items-center gap-2 mt-2  rounded-md px-4 py-2 font-medium text-[#606060] hover:text-[#007CF0] duration-300 ease-in-out  ' +
                      (isActive && '!text-blue-500')
                    }
                  >
                    <svg
                      className="fill-current"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1.11111 7.5L10 1.11111L18.8889 7.5V16.675C18.8889 17.8919 17.8889 18.8889 16.675 18.8889H3.325C2.11111 18.8889 1.11111 17.8919 1.11111 16.675V7.5ZM3.33333 8.55556V16.6667H16.6667V8.55556L10 4.05556L3.33333 8.55556ZM6.11111 15V11.1111H8.88889V15H6.11111ZM11.1111 15V11.1111H13.8889V15H11.1111Z"
                        fill="currentColor"
                      />
                    </svg>
                    Warehouse Management
                  </NavLink>
                </li>
              )}

              {(user?.user?.role === 'Admin' ||
                user?.user?.role === 'Production Manager' ||
                user?.user?.role === 'Administrator') && (
                <li>
                  <NavLink
                    to="/production-manager/management"
                    className={({ isActive }) =>
                      'group relative flex items-center gap-2.5   mt-2  rounded-md px-4 font-medium text-[#606060] hover:text-[#007CF0] duration-300 ease-in-out  ' +
                      (isActive && '!text-blue-500')
                    }
                  >
                    <svg
                      className="fill-current"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3.325 0h13.35C18.51 0 20 1.49 20 3.325v13.35C20 18.51 18.51 20 16.675 20H3.325C1.49 20 0 18.51 0 16.675V3.325C0 1.49 1.49 0 3.325 0ZM10 6.5c1.93 0 3.5 1.57 3.5 3.5s-1.57 3.5-3.5 3.5-3.5-1.57-3.5-3.5 1.57-3.5 3.5-3.5Zm0-2c-.28 0-.55.03-.81.09l-.38-1.16c-.1-.31-.43-.48-.74-.38l-1.18.39c-.31.1-.48.43-.38.74l.38 1.15c-.48.34-.88.77-1.2 1.26l-1.17-.39c-.31-.1-.64.07-.74.38l-.39 1.18c-.1.31.07.64.38.74l1.17.38c-.06.27-.09.54-.09.82 0 .28.03.55.09.81l-1.17.38c-.31.1-.48.43-.38.74l.39 1.18c.1.31.43.48.74.38l1.17-.39c.32.49.73.92 1.21 1.26l-.38 1.15c-.1.31.07.64.38.74l1.18.39c.31.1.64-.07.74-.38l.38-1.16c.26.06.53.09.81.09.28 0 .55-.03.81-.09l.38 1.16c.1.31.43.48.74.38l1.18-.39c.31-.1.48-.43.38-.74l-.38-1.15c.48-.34.88-.77 1.2-1.26l1.17.39c.31.1.64-.07.74-.38l.39-1.18c.1-.31-.07-.64-.38-.74l-1.17-.38c.06-.27.09-.54.09-.81 0-.28-.03-.55-.09-.82l1.17-.38c.31-.1.48-.43.38-.74l-.39-1.18c-.1-.31-.43-.48-.74-.38l-1.17.39c-.32-.49-.73-.92-1.21-1.26l.38-1.15c.1-.31-.07-.64-.38-.74l-1.18-.39c-.31-.1-.64.07-.74.38l-.38 1.16c-.26-.06-.53-.09-.81-.09Z"
                        fill="currentColor"
                      />
                    </svg>
                    Production Management
                  </NavLink>
                </li>
              )}

              {user?.user?.role === 'Warehouse Manager' && (
                <li>
                  <NavLink
                    to="/warehouse-management/Stock"
                    className={({ isActive }) =>
                      'group relative flex items-center gap-2.5   mt-2  rounded-md px-4 font-medium text-[#606060] hover:text-[#007CF0] duration-300 ease-in-out  ' +
                      (isActive && '!text-blue-500')
                    }
                  >
                    <svg
                      className="fill-current"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M2.5 2h15a.5.5 0 0 1 .5.5v15a.5.5 0 0 1-.5.5h-15a.5.5 0 0 1-.5-.5v-15A.5.5 0 0 1 2.5 2Zm6.25 2.5H4v3.75h4.75V4.5Zm7.75 0h-4.75v3.75H16.5V4.5ZM4 9.75v5.75h4.75V9.75H4Zm7.75 0V15.5H16.5V9.75h-4.75Z" />
                    </svg>
                    Stock
                  </NavLink>
                </li>
              )}
              {user?.user?.role === 'Warehouse Manager' && (
                <li>
                  <NavLink
                    to="/warehouse-management/StockVerify"
                    className={({ isActive }) =>
                      'group relative flex items-center gap-2.5   mt-2  rounded-md px-4 font-medium text-[#606060] hover:text-[#007CF0] duration-300 ease-in-out  ' +
                      (isActive && '!text-blue-500')
                    }
                  >
                    <svg
                      className="fill-current"
                      width="22"
                      height="22"
                      viewBox="0 0 22 22"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M11 15.25a4.25 4.25 0 110-8.5 4.25 4.25 0 010 8.5zM18.2 12.1l1.1-.9c.2-.15.2-.45.05-.66l-1-1.73a.43.43 0 00-.55-.17l-1.3.5a7.3 7.3 0 00-.8-.5l-.3-1.35a.43.43 0 00-.42-.34h-2.02a.43.43 0 00-.42.34l-.3 1.35c-.28.13-.56.28-.8.5l-1.3-.5a.43.43 0 00-.55.17l-1 1.73a.43.43 0 00.05.66l1.1.9c-.02.28-.02.56 0 .84l-1.1.9a.43.43 0 00-.05.66l1 1.73c.12.2.38.28.58.17l1.3-.5c.24.22.52.37.8.5l.3 1.35c.04.24.24.4.42.4h2.02c.18 0 .38-.16.42-.4l.3-1.35c.28-.13.56-.28.8-.5l1.3.5c.2.11.46.03.58-.17l1-1.73a.43.43 0 00-.05-.66l-1.1-.9c.02-.28.02-.56 0-.84z" />
                    </svg>
                    Stock Verify
                  </NavLink>
                </li>
              )}

              {user?.user?.role === 'Admin' && (
                <li>
                  <NavLink
                    to="/reports"
                    className={({ isActive }) =>
                      'group relative flex items-center gap-2.5   mt-2  rounded-md px-4 font-medium text-[#606060] hover:text-[#007CF0] duration-300 ease-in-out  ' +
                      (isActive && '!text-blue-500')
                    }
                  >
                    <svg
                      className="fill-current"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3.325 0h13.35C18.51 0 20 1.49 20 3.325v13.35C20 18.51 18.51 20 16.675 20H3.325C1.49 20 0 18.51 0 16.675V3.325C0 1.49 1.49 0 3.325 0Zm3.675 5a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h1.5a.5.5 0 0 0 .5-.5V5.5a.5.5 0 0 0-.5-.5H7Zm4 3a.5.5 0 0 0-.5.5v6a.5.5 0 0 0 .5.5h1.5a.5.5 0 0 0 .5-.5v-6a.5.5 0 0 0-.5-.5H11Zm4 2a.5.5 0 0 0-.5.5v4a.5.5 0 0 0 .5.5h1.5a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 0-.5-.5H15Z"
                        fill="currentColor"
                      />
                    </svg>
                    Reports
                  </NavLink>
                </li>
              )}

              {user?.user?.role === 'Admin' && (
                <li>
                  <NavLink
                    to="/categories"
                    className={({ isActive }) =>
                      'group relative flex items-center gap-2.5   mt-2  rounded-md px-4 font-medium text-[#606060] hover:text-[#007CF0] duration-300 ease-in-out  ' +
                      (isActive && '!text-blue-500')
                    }
                  >
                    <svg
                      className="fill-current"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3.325 0h13.35C18.51 0 20 1.49 20 3.325v13.35C20 18.51 18.51 20 16.675 20H3.325C1.49 20 0 18.51 0 16.675V3.325C0 1.49 1.49 0 3.325 0Zm2.675 4a.75.75 0 0 0-.75.75v2.5c0 .414.336.75.75.75h2.5c.414 0 .75-.336.75-.75v-2.5a.75.75 0 0 0-.75-.75h-2.5Zm6 0a.75.75 0 0 0-.75.75v2.5c0 .414.336.75.75.75h2.5c.414 0 .75-.336.75-.75v-2.5a.75.75 0 0 0-.75-.75h-2.5ZM5.25 11a.75.75 0 0 0-.75.75v2.5c0 .414.336.75.75.75h2.5c.414 0 .75-.336.75-.75v-2.5a.75.75 0 0 0-.75-.75h-2.5Zm6 0a.75.75 0 0 0-.75.75v2.5c0 .414.336.75.75.75h2.5c.414 0 .75-.336.75-.75v-2.5a.75.75 0 0 0-.75-.75h-2.5Z"
                        fill="currentColor"
                      />
                    </svg>
                    Add Article
                  </NavLink>
                </li>
              )}

              {user?.user?.role === 'Admin' && (
                <li>
                  <NavLink
                    to="/article-codes"
                    className={({ isActive }) =>
                      'group relative flex items-center gap-2.5   mt-2  rounded-md px-4 font-medium text-[#606060] hover:text-[#007CF0] duration-300 ease-in-out  ' +
                      (isActive && '!text-blue-500')
                    }
                  >
                    <svg
                      className="fill-current"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3.325 0h13.35C18.51 0 20 1.49 20 3.325v13.35C20 18.51 18.51 20 16.675 20H3.325C1.49 20 0 18.51 0 16.675V3.325C0 1.49 1.49 0 3.325 0Zm4 4c-.414 0-.75.336-.75.75v10.5c0 .414.336.75.75.75h5.5c.414 0 .75-.336.75-.75V7.5L11 4H7.325Zm4.675 1.06V7h2.06L12 5.06ZM7.5 9.25c.276 0 .5.224.5.5v.5h1a.5.5 0 1 1 0 1H8v.5a.5.5 0 1 1-1 0V11H6a.5.5 0 1 1 0-1h1v-.25c0-.276.224-.5.5-.5Zm4 0c.276 0 .5.224.5.5V10h1a.5.5 0 1 1 0 1h-1v.25a.5.5 0 1 1-1 0V11h-1a.5.5 0 1 1 0-1h1v-.25c0-.276.224-.5.5-.5Z"
                        fill="currentColor"
                      />
                    </svg>
                    Article Codes
                  </NavLink>
                </li>
              )}

              {user?.user?.role === 'Admin' && (
                <li>
                  <NavLink
                    to="/scheme"
                    className={({ isActive }) =>
                      'group relative flex items-center gap-2.5   mt-2  rounded-md px-4 font-medium text-[#606060] hover:text-[#007CF0] duration-300 ease-in-out  ' +
                      (isActive && '!text-blue-500')
                    }
                  >
                    <svg
                      className="fill-current"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0 3.325C0 1.49 1.49 0 3.325 0h13.35C18.51 0 20 1.49 20 3.325v13.35C20 18.51 18.51 20 16.675 20H3.325C1.49 20 0 18.51 0 16.675V3.325Zm6.5 4.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM10 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm3.5 5.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM7.3 7.8l1.7 1.1m.5.6 2.3 3.1"
                        fill="currentColor"
                        stroke="currentColor"
                        strokeWidth="0.8"
                        strokeLinecap="round"
                      />
                    </svg>
                    Schemes
                  </NavLink>
                </li>
              )}
              {(user?.user?.role === 'Admin' ||
                user?.user?.role === 'Administrator') && (
                <li>
                  <NavLink
                    to="/annoucement"
                    className={({ isActive }) =>
                      'group relative flex items-center gap-2.5   mt-2  rounded-md px-4 font-medium text-[#606060] hover:text-[#007CF0] duration-300 ease-in-out  ' +
                      (isActive && '!text-blue-500')
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      className="fill-current"
                    >
                      <path d="M3 10v4a1 1 0 0 0 1 1h2.382l4.447 2.668A2 2 0 0 0 13 16.056V7.944a2 2 0 0 0-2.171-1.612L6.382 9H4a1 1 0 0 0-1 1ZM15 8v8h1a3 3 0 0 0 0-6h-1Zm3.5 0a4.5 4.5 0 0 1 0 9H18v-9h.5Z" />
                    </svg>
                    Annoucement
                  </NavLink>
                </li>
              )}

              {(user?.user?.role === 'Admin' ||
                user?.user?.role === 'Administrator') && (
                <li>
                  <NavLink
                    to="/administrator/internal-warehouse-transfer"
                    className={({ isActive }) =>
                      'group relative flex items-center gap-2.5   mt-2  rounded-md px-4 font-medium text-[#606060] hover:text-[#007CF0] duration-300 ease-in-out  ' +
                      (isActive && '!text-blue-500')
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      className="fill-current"
                    >
                      <path d="M3 3h18v6H3V3Zm2 2v2h14V5H5Z" />
                      <path d="M3 10h6v4H3v-4Zm12 0h6v4h-6v-4Z" />
                      <path d="M9 12l2.5-2.5L14 12l-2.5 2.5L9 12Z" />
                      <path d="M3 17h18v4H3v-4Z" />
                    </svg>
                    Internal Warehouse Transfer
                  </NavLink>
                </li>
              )}

              {user?.user?.role === 'Admin' && (
                <li>
                  <NavLink
                    to="/logs"
                    className={({ isActive }) =>
                      'group relative flex items-center gap-2.5   mt-2  rounded-md px-4 font-medium text-[#606060] hover:text-[#007CF0] duration-300 ease-in-out  ' +
                      (isActive && '!text-blue-500')
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      className="fill-current"
                    >
                      <path d="M6 2a2 2 0 0 0-2 2v16c0 1.103.897 2 2 2h12a2 2 0 0 0 2-2V8l-6-6H6zm7 1.5L18.5 9H13V3.5zM8 12h8v2H8v-2zm0 4h8v2H8v-2z" />
                    </svg>
                    Logs
                  </NavLink>
                </li>
              )}

              {/* <!-- Menu Item Settings --> */}

              {user?.user?.role === 'Administrator' && (
                <li>
                  <NavLink
                    to="/Administrator/CreateQRCode"
                    className={({ isActive }) =>
                      'group relative flex items-center gap-2.5   mt-2  rounded-md px-4 font-medium text-[#606060] hover:text-[#007CF0] duration-300 ease-in-out  ' +
                      (isActive && '!text-blue-500')
                    }
                  >
                    <svg
                      className="fill-current"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3 2h4v2H4v3H2V3a1 1 0 0 1 1-1Zm10-0h4a1 1 0 0 1 1 1v4h-2V4h-3V2Zm4 16h-4v-2h3v-3h2v4a1 1 0 0 1-1 1Zm-14 0a1 1 0 0 1-1-1v-4h2v3h3v2H3Zm4-9h6v2H7v-2Z"
                        fill="currentColor"
                      />
                    </svg>
                    Create QR Code
                  </NavLink>
                </li>
              )}

              {user?.user?.role === 'Sales Person' && (
                <li>
                  <NavLink
                    to="/salesPerson/Schemes"
                    className={({ isActive }) =>
                      'group relative flex items-center gap-2.5   mt-2  rounded-md px-4 font-medium text-[#606060] hover:text-[#007CF0] duration-300 ease-in-out  ' +
                      (isActive && '!text-blue-500')
                    }
                  >
                    <svg
                      className="fill-current text-gray-600 group-hover:text-blue-500"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4 2h12a1 1 0 0 1 1 1v3H3V3a1 1 0 0 1 1-1Zm-1 6h14v2H3V8Zm0 4h14v2H3v-2Zm1 4h12a1 1 0 0 0 1-1v-1H3v1a1 1 0 0 0 1 1Z"
                        fill="currentColor"
                      />
                    </svg>
                    Schemes
                  </NavLink>
                </li>
              )}

              {user?.user?.role === 'Sales Person' && (
                <li>
                  <NavLink
                    to="/salesPerson/Customerslist"
                    className={({ isActive }) =>
                      'group relative flex items-center gap-2.5   mt-2  rounded-md px-4 font-medium text-[#606060] hover:text-[#007CF0] duration-300 ease-in-out  ' +
                      (isActive && '!text-blue-500')
                    }
                  >
                    <svg
                      className="fill-current text-gray-600 group-hover:text-blue-500"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10 10a3 3 0 1 0-3-3 3 3 0 0 0 3 3Zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4Z"
                        fill="currentColor"
                      />
                    </svg>
                    Customers List
                  </NavLink>
                </li>
              )}

              {user?.user?.role === 'Sales Person' && (
                <li>
                  <NavLink
                    to="/salesPerson/Orders"
                    className={({ isActive }) =>
                      'group relative flex items-center gap-2.5   mt-2  rounded-md px-4 font-medium text-[#606060] hover:text-[#007CF0] duration-300 ease-in-out  ' +
                      (isActive && '!text-blue-500')
                    }
                  >
                    <svg
                      className="fill-current text-gray-600 group-hover:text-blue-500"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5 6V5a5 5 0 0 1 10 0v1h1a2 2 0 0 1 2 2v9a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V8a2 2 0 0 1 2-2h1Zm2 0h6V5a3 3 0 0 0-6 0v1Z"
                        fill="currentColor"
                      />
                    </svg>
                    Orders
                  </NavLink>
                </li>
              )}

              {(user?.user?.role === 'Production Manager' ||
                user?.user?.role === '') && (
                <li>
                  <NavLink
                    to="/QRScannerPage"
                    className={({ isActive }) =>
                      'group relative flex items-center gap-2.5   mt-2  rounded-md px-4 font-medium text-[#606060] hover:text-[#007CF0] duration-300 ease-in-out  ' +
                      (isActive && '!text-blue-500')
                    }
                  >
                    <svg
                      className="fill-current"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill="currentColor"
                        d="M3 7V5a2 2 0 0 1 2-2h2v2H5v2H3Zm14-2V3h2a2 2 0 0 1 2 2v2h-2V5h-2ZM5 19v-2H3v2a2 2 0 0 0 2 2h2v-2H5Zm14-2v2h-2v2h2a2 2 0 0 0 2-2v-2h-2ZM4 11h16v2H4v-2Z"
                      />
                    </svg>
                    Production Scanner
                  </NavLink>
                </li>
              )}
              {(user?.user?.role === 'Production Manager' ||
                user?.user?.role === '') && (
                <li>
                  <NavLink
                    to="/manualProcess"
                    className={({ isActive }) =>
                      'group relative flex items-center gap-2.5   mt-2  rounded-md px-4 font-medium text-[#606060] hover:text-[#007CF0] duration-300 ease-in-out  ' +
                      (isActive && '!text-blue-500')
                    }
                  >
                    <svg
                      className="fill-current"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill="currentColor"
                        d="M12 2a1 1 0 0 1 1 1v7h1.5a2.5 2.5 0 0 1 2.45 3.02l-.6 3A5.5 5.5 0 0 1 10.95 21H9a7 7 0 0 1-7-7v-3a2 2 0 0 1 2-2h6V3a1 1 0 0 1 1-1h1Z"
                      />
                    </svg>
                    Manual Process
                  </NavLink>
                </li>
              )}
              {user?.user?.role === 'Warehouse Manager' && (
                <li>
                  <NavLink
                    to="/warehouse-management/QRScanner"
                    className={({ isActive }) =>
                      'group relative flex items-center gap-2.5   mt-2  rounded-md px-4 font-medium text-[#606060] hover:text-[#007CF0] duration-300 ease-in-out  ' +
                      (isActive && '!text-blue-500')
                    }
                  >
                    <svg
                      className="fill-current"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill="currentColor"
                        d="M3 7V5a2 2 0 0 1 2-2h2v2H5v2H3Zm14-2V3h2a2 2 0 0 1 2 2v2h-2V5h-2ZM5 19v-2H3v2a2 2 0 0 0 2 2h2v-2H5Zm14-2v2h-2v2h2a2 2 0 0 0 2-2v-2h-2ZM4 11h16v2H4v-2Z"
                      />
                    </svg>
                    Warehouse Scanner
                  </NavLink>
                </li>
              )}
              {user?.user?.role === 'Warehouse Manager' && (
                <li>
                  <NavLink
                    to="/warehouse-management/DispatchScanner"
                    className={({ isActive }) =>
                      'group relative flex items-center gap-2.5   mt-2  rounded-md px-4 font-medium text-[#606060] hover:text-[#007CF0] duration-300 ease-in-out  ' +
                      (isActive && '!text-blue-500')
                    }
                  >
                    <svg
                      className="fill-current"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill="currentColor"
                        d="M4 4h16a2 2 0 0 1 2 2v3H2V6a2 2 0 0 1 2-2Zm-2 7h20v2H2v-2Zm0 4h20v3a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-3Zm4 1v4h2v-4H6Zm4 0v4h2v-4h-2Zm4 0v4h2v-4h-2Zm4 0v4h2v-4h-2Z"
                      />
                    </svg>
                    Dispatch Scanner
                  </NavLink>
                </li>
              )}
              {(user?.user?.role === 'Sales Person' ||
                user?.user?.role === 'Inventory Manager') && (
                <li>
                  <NavLink
                    to="/ArticalData"
                    className={({ isActive }) =>
                      'group relative flex items-center gap-2.5   mt-2  rounded-md px-4 font-medium text-[#606060] hover:text-[#007CF0] duration-300 ease-in-out  ' +
                      (isActive && '!text-blue-500')
                    }
                  >
                    <svg
                      className="fill-current"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill="currentColor"
                        d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6H6zm7 1.5L18.5 9H13V3.5zM8 13h8v2H8v-2zm0 4h5v2H8v-2z"
                      />
                    </svg>
                    Article Data
                  </NavLink>
                </li>
              )}
              {user?.user?.role === 'Warehouse Manager' && (
                <li>
                  <NavLink
                    to="/ArticleDataWarehouse"
                    className={({ isActive }) =>
                      'group relative flex items-center gap-2.5   mt-2  rounded-md px-4 font-medium text-[#606060] hover:text-[#007CF0] duration-300 ease-in-out  ' +
                      (isActive && '!text-blue-500')
                    }
                  >
                    <svg
                      className="fill-current"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill="currentColor"
                        d="M12 2 2 7v2h2v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9h2V7l-10-5Zm6 18H6V9h12v11ZM8 11h2v2H8v-2Zm3 0h2v2h-2v-2Zm3 0h2v2h-2v-2Zm-6 4h2v2H8v-2Zm3 0h2v2h-2v-2Zm3 0h2v2h-2v-2Z"
                      />
                    </svg>
                    Article Data Warehouse
                  </NavLink>
                </li>
              )}
              {user?.user?.role === 'Warehouse Manager' && (
                <li>
                  <NavLink
                    to="/manualDispatch"
                    className={({ isActive }) =>
                      'group relative flex items-center gap-2.5   mt-2  rounded-md px-4 font-medium text-[#606060] hover:text-[#007CF0] duration-300 ease-in-out  ' +
                      (isActive && '!text-blue-500')
                    }
                  >
                    <svg
                      className="fill-current"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill="currentColor"
                        d="M3 3h13v6h5l-2-3h-3V3H3v18h7v-2H5V5h11v2h2.5l3.5 5v9h-2v-2H12v2H9v-4h9v2h2v-5H9v-2h11V9h-2V7h-2v2H9V3Z"
                      />
                      <path
                        fill="currentColor"
                        d="M16 13l-4 4 4 4v-3h5v-2h-5v-3Z"
                      />
                    </svg>
                    Manual Dispatch
                  </NavLink>
                </li>
              )}

              {user?.user?.role === 'Sales Person' && (
                <li>
                  <NavLink
                    to="/salesPerson/cart"
                    className={({ isActive }) =>
                      'group relative flex items-center gap-2.5   mt-2  rounded-md px-4 font-medium text-[#606060] hover:text-[#007CF0] duration-300 ease-in-out  ' +
                      (isActive && '!text-blue-500')
                    }
                  >
                    <svg
                      className="fill-none stroke-current"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3 3h2l2.6 9.1a2 2 0 001.9 1.4h7.6a1 1 0 00.95-.69L21 7H6"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle cx="9" cy="20" r="1.5" fill="currentColor" />
                      <circle cx="18" cy="20" r="1.5" fill="currentColor" />
                    </svg>
                    Cart
                  </NavLink>
                </li>
              )}

              {user?.user?.role === 'Sales Person' && (
                <li>
                  <NavLink
                    to="/salesPerson/Wishlist"
                    className={({ isActive }) =>
                      'group relative flex items-center gap-2.5 mt-2 rounded-md px-4 font-medium text-[#606060] hover:text-[#007CF0] duration-300 ease-in-out ' +
                      (isActive && '!text-blue-500')
                    }
                  >
                    <svg
                      className="text-gray-800 group-hover:text-blue-500"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 21s-6.5-4.35-9.33-7.19A5.33 5.33 0 0 1 7.5 4.5c1.54 0 3.04.72 4.5 2.18 1.46-1.46 2.96-2.18 4.5-2.18a5.33 5.33 0 0 1 4.83 9.31C18.5 16.65 12 21 12 21Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Wishlist
                  </NavLink>
                </li>
              )}

              {user?.user?.role === 'Admin' && (
                <li>
                  <NavLink
                    to="/admin/Wishlist"
                    className={({ isActive }) =>
                      'group relative flex items-center gap-2.5 mt-2 rounded-md px-4 font-medium text-[#606060] hover:text-[#007CF0] duration-300 ease-in-out ' +
                      (isActive && '!text-blue-500')
                    }
                  >
                    <svg
                      className="text-gray-800 group-hover:text-blue-500"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 21s-6.5-4.35-9.33-7.19A5.33 5.33 0 0 1 7.5 4.5c1.54 0 3.04.72 4.5 2.18 1.46-1.46 2.96-2.18 4.5-2.18a5.33 5.33 0 0 1 4.83 9.31C18.5 16.65 12 21 12 21Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Wishlist
                  </NavLink>
                </li>
              )}
            </ul>
          </div>

          {/* <!-- Others Group --> */}
          <div>
            <ul className="mb-6 flex flex-col gap-1.5">
              <li>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    'group relative flex items-center gap-2.5   mt-2  rounded-md px-4 font-medium text-[#606060] hover:text-[#007CF0] duration-300 ease-in-out  ' +
                    (isActive && '!text-blue-500')
                  }
                >
                  <svg
                    className="fill-current text-gray-800"
                    width="18"
                    height="22"
                    viewBox="0 0 18 22"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9.43652 0.950195C9.64002 0.950286 9.80354 1.11753 9.80371 1.32227C9.80371 1.52714 9.64013 1.69522 9.43652 1.69531H2.07812C1.86261 1.69535 1.68561 1.87447 1.68555 2.09668V19.9033C1.68562 20.1257 1.86244 20.3046 2.07812 20.3047H9.48633V20.3096C9.66627 20.3344 9.80371 20.4899 9.80371 20.6777C9.80354 20.8825 9.64002 21.0497 9.43652 21.0498H2.07812C1.45526 21.0498 0.950268 20.5347 0.950195 19.9033V2.09668C0.950268 1.46531 1.45526 0.950233 2.07812 0.950195H9.43652ZM12.0635 6.31152C12.2073 6.16594 12.4403 6.16587 12.584 6.31152L16.9424 10.7373L16.957 10.751V10.7549C17.0161 10.8228 17.0499 10.909 17.0498 11C17.0498 11.0988 17.011 11.194 16.9424 11.2637L12.584 15.6885C12.5124 15.7614 12.4178 15.7979 12.3232 15.7979C12.2288 15.7978 12.1351 15.7612 12.0635 15.6885C11.9202 15.5428 11.9202 15.3076 12.0635 15.1621L15.7949 11.373H5.54297C5.33936 11.373 5.17578 11.2049 5.17578 11C5.17578 10.7951 5.33935 10.627 5.54297 10.627H15.7949L12.0635 6.83789C11.9204 6.69244 11.92 6.45698 12.0635 6.31152Z"
                      fill="currentColor"
                      stroke="#333333"
                      strokeWidth="0.2"
                    />
                  </svg>
                  Log Out
                </NavLink>
              </li>
            </ul>
          </div>
        </nav>
        {/* <!-- Sidebar Menu --> */}
      </div>
    </aside>
  );
};

export default Sidebar;
