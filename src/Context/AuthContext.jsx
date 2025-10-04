import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';
import useAutoLogout from '../hooks/useAutoLogout';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0); // 🔹 NEW: Notification count

  const roleBasedEvents = {
    productionSuccess: ['Admin', 'Administrator', 'Production Manager'],
    AccountSectionApproval: ['Admin', 'Administrator', 'Account Section'],
    AccountSectionRejection: ['Admin', 'Administrator', 'Account Section'],
    SalesPersonGenearated: [
      'Admin',
      'Administrator',
      'Account Section',
      'Sales Person',
    ],
    qrgeneratedRequest: [
      'Admin',
      'Administrator',
      'Account Section',
      'Sales Person',
      'Warehouse Manager',
    ],
    warehouseFulfillment: ['Warehouse Manager'],
    inventoryRejected: [
      'Inventory Manager',
      'Admin',
      'Administrator',
      'Sales Person',
    ],
    // 🔹 loginSuccess handled separately
  };

  // Load user from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Initialize socket when user logs in
  useEffect(() => {
    if (!user) return;

    const newSocket = io('wss://apex-api.testsdlc.in', {
      transports: ['websocket'],
      withCredentials: true,
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('✅ Socket connected:', newSocket.id);
    });

    newSocket.on('connect_error', (err) => {
      console.error('❌ Socket connection error:', err.message);
    });

    console.log('User role:', user?.user.role);
    console.log('User id:', user?.user.id);

    // 🔹 Subscribe to all assigned warehouses
    if (
      user?.user?.role === 'Warehouse Manager' &&
      Array.isArray(user?.user?.warehouses)
    ) {
      user.user.warehouses.forEach((wh) => {
        const warehouseEvent = `warehouseFulfillment:${wh._id}`;
        console.log(`👂 Subscribing to ${warehouseEvent}`);

        newSocket.on(warehouseEvent, (data) => {
          console.log(`📦 Warehouse ${wh._id} fulfillment:`, data);
          toast.info(data?.message || `Warehouse ${wh.name} fulfillment`);
          addNotification('info', data?.message, data.data);
        });
      });
    }

    // 🔹 Handle other role-based events
    Object.keys(roleBasedEvents).forEach((event) => {
      if (event === 'warehouseFulfillment') return; // ✅ skip the generic one

      newSocket.on(event, (data) => {
        if (roleBasedEvents[event].includes(user?.user?.role)) {
          console.log(`📩 Event ${event}:`, data);

          if (event === 'productionSuccess') {
            console.log('after production data', data);

            toast.success(data?.message || 'Got Data');
            addNotification('success', data?.message, data);
          } else if (event === 'AccountSectionApproval') {
            console.log('account section approve hit', data);
            toast.success(data?.message || 'Factory request');
            addNotification('success', data?.message, data.data);
          } else if (event === 'AccountSectionRejection') {
            console.log('account section reject hit', data);
            toast.warning(data?.message || ' Account Section rejected');
            addNotification('warning', data?.message, data.data);
          } else if (event === 'SalesPersonGenearated') {
            console.log('Sales person cart hit', data);
            toast.success(data?.message || 'order created');
            addNotification('success', data?.message, data.data);
          } else if (event === 'inventoryRejected') {
            console.log('inventory rejected hitting', data);

            toast.error(`${data?.message}`);
            addNotification('error', data?.message, data.data);
          } else if (event === 'qrgeneratedRequest') {
            console.log('qr generated successfully ', data);

            toast.info(`${data?.message}`);
            addNotification('success', data?.message, data.data);
          }
        }
      });
    });

    // 🔹 Special handling for loginSuccess
    newSocket.on('loginSuccess', (data) => {
      console.log('data after login', data);
      console.log('user after login', user);

      if (data?.id === user?.user?.id) {
        toast.success(data?.message || 'Login success');
        addNotification('success', data?.message, data.data);
      } else if (['Admin', 'Administrator'].includes(user?.user?.role)) {
        toast.info(`${data?.data.name} (${data?.data?.role}) logged in`);
        addNotification(
          'info',
          `${data?.data.name} (${data?.data.role}) logged in`,
          data.data,
        );
      }
    });

    return () => {
      console.log('🔌 Cleaning up socket listeners');
      newSocket.disconnect();
    };
  }, [user]);

  // Add notification + increment count
  const addNotification = (type, message, data) => {
    setNotifications((prev) => [
      {
        id: Date.now(),
        type,
        message,
        data,
        time: new Date().toLocaleTimeString(),
      },
      ...prev,
    ]);
    setNotificationCount((prev) => prev + 1); // 🔹 Increment count
  };

  // Remove notification by ID
  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Reset count manually (for example, when user views all notifications)
  const resetNotificationCount = () => {
    setNotificationCount(0);
  };

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    console.log('userData ||', user);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
    setNotifications([]);
    setNotificationCount(0);

    window.location.href = '/login';
  };

  useAutoLogout(logout, 1000 * 60 * 60); // 1 hour

  return (
    <AuthContext.Provider
      value={{
        user,
        socket,
        notifications,
        notificationCount,
        addNotification,
        removeNotification,
        resetNotificationCount,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
