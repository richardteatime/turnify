import { Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Shifts from './pages/Shifts'
import Calendar from './pages/Calendar'
import Users from './pages/Users'
import Locations from './pages/Locations'
import Login from './pages/Login'
import Register from './pages/Register'
import useAuthStore from './store/authStore'

function PrivateRoute({ children, requiredRole = null }) {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const user = useAuthStore(state => state.user)
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" />
  }

  return children
}

export default function App() {
  return (
    <>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="shifts" element={<Shifts />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="locations" element={<Locations />} />
          <Route path="users" element={
            <PrivateRoute requiredRole="super_admin">
              <Users />
            </PrivateRoute>
          } />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
