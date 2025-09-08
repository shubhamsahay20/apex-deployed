import { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { toast } from 'react-toastify'

export const AuthContext = createContext()

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [socket, setSocket] = useState(null)
  const [notifications, setNotifications] = useState([])
  const [notificationCount, setNotificationCount] = useState(0) // 🔹 NEW: Notification count

  const roleBasedEvents = {
    productionSuccess: ['Admin', 'Administrator', 'Production Manager'],
    adminFactoryRequest: ['Admin', 'Administrator'],
    warehouseFulfillment: ['Warehouse Manager'],
    inventoryRejected: ['Inventory Manager', 'Admin', 'Administrator']
    // 🔹 loginSuccess handled separately
  }

  // Load user from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error)
        localStorage.removeItem('user')
      }
    }
  }, [])

  // Initialize socket when user logs in
  useEffect(() => {
    if (user) {
      const newSocket = io('ws://apex-api.testsdlc.in', {
        transports: ['websocket'],
        withCredentials: true
      })

      setSocket(newSocket)

      newSocket.on('connect', () => {
        console.log('✅ Socket connected:', newSocket.id)
      })

      newSocket.on('connect_error', err => {
        console.error('❌ Socket connection error:', err.message)
      })

      console.log('role', user?.user.role)

      // Handle events
      Object.keys(roleBasedEvents).forEach(event => {
        newSocket.on(event, data => {
          if (roleBasedEvents[event].includes(user?.user?.role)) {
            console.log(`📩 ${event}:`, data)

            if (event === 'productionSuccess') {
              toast.info(data?.message || 'Got Data')
              addNotification('success', data?.message, data)
            } else if (event === 'adminFactoryRequest') {
              toast.warning(data?.message || 'Factory request')
              addNotification('warning', data?.message, data.data)
            } else if (event === 'warehouseFulfillment') {
              toast.info(data?.message || 'Warehouse fulfillment')
              addNotification('info', data?.message, data.data)
            } else if (event === 'inventoryRejected') {
              toast.error(data?.message || 'Inventory rejected')
              addNotification('error', data?.message, data.data)
            }
          }
        })
      })

      // 🔹 Special handling for loginSuccess
      newSocket.on('loginSuccess', data => {
        console.log("data after login",data);
        console.log("user after login",user);
        
      
        // Self login → visible to everyone
        if (data?.id === user?.user?.id) {
          toast.success(data?.message || 'Login success')
          addNotification('success', data?.message, data.data)
        }
        // Notify Admin & Administrator when ANY user logs in
        else if (['Admin', 'Administrator'].includes(user?.user?.role)) {
          toast.info(`${data?.data.name} (${data?.data?.role}) logged in`)
          addNotification(
            'info',
            `${data?.data.name} (${data?.data.role}) logged in`,
            data.data
          )
        }
      })

      return () => {
        newSocket.disconnect()
      }
    }
  }, [user])

  // Add notification + increment count
  const addNotification = (type, message, data) => {
    setNotifications(prev => [
      {
        id: Date.now(),
        type,
        message,
        data,
        time: new Date().toLocaleTimeString()
      },
      ...prev
    ])
    setNotificationCount(prev => prev + 1) // 🔹 Increment count
  }

  // Remove notification by ID
  const removeNotification = id => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  // Reset count manually (for example, when user views all notifications)
  const resetNotificationCount = () => {
    setNotificationCount(0)
  }

  const login = userData => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
    console.log('userData ||', user)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    if (socket) {
      socket.disconnect()
      setSocket(null)
    }
    setNotifications([])
    setNotificationCount(0)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        socket,
        notifications,
        notificationCount, // 🔹 Expose count in context
        addNotification,
        removeNotification,
        resetNotificationCount, // 🔹 Allow resetting count
        login,
        logout,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
