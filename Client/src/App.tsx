
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminDashboard from './features/admin/dashboard/Dashboard'
import UserManagement from './features/admin/UsersTable/UsersTable'
import OrdersPage from './features/admin/orders/OrdersTable'
import ProductDashboard from './features/admin/products/ProductTable'
import AddProduct from './features/admin/products/AddProduct'
import EditProduct from './features/admin/products/EditProduct'
import EditSubscription from './features/admin/subscriptions/EditSubscription'
import EditOrder from './features/admin/orders/EditOrder'
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
          <Route path="/AddProduct" element={<AddProduct />} />
          <Route path="/EditProduct/:id" element={<EditProduct />} />
          <Route path="/EditSubscription/:id" element={<EditSubscription />} />
          <Route path="/EditOrder/:id" element={<EditOrder />} />
          <Route path="/SubscriptionPage" element={<SubscriptionPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App