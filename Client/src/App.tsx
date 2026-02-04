
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminDashboard from './features/admin/dashboard/Dashboard'
import UserManagement from './features/admin/UsersTable/UsersTable'
import OrdersPage from './features/admin/orders/OrdersTable'
import ProductDashboard from './features/admin/products/ProductTable'
import SubscriptionPage from './features/admin/subscriptions/Subscriptio'

const App = () => {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/UserManagement" element={<UserManagement />} />
          <Route path="/OrdersPage" element={<OrdersPage />} />
          <Route path="/ProductDashboard" element={<ProductDashboard />} />
          <Route path="/SubscriptionPage" element={<SubscriptionPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App