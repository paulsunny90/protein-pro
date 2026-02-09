import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import UserLayout from './features/user/UserLayout';
import HomePage from './features/user/home/HomePage';
import ProductsPage from './features/user/products/ProductsPage';
import SubscriptionsPage from './features/user/subscriptions/SubscriptionsPage';
import Dashboard from './features/user/dashboard/Dashboard';
import BMICalculator from './features/user/bmi-calculator/BMICalculator';
import FitnessPlans from './features/user/fitness/FitnessPlans';
import CartPage from './features/user/products/CartPage';
import ProgressTracker from './features/user/progress-tracker/ProgressTracker';
import LoginPage from './features/user/auth/LoginPage';
import SignupPage from './features/user/auth/SignupPage';
import ProductDetailsPage from './features/user/products/details/ProductDetailsPage';
import OrderPage from './features/user/orders/OrderPage';

// Admin routes
import AdminLayout from './features/admin/AdminLayout'
import AdminDashboard from './features/admin/dashboard/Dashboard'
import UserManagement from './features/admin/UsersTable/UsersTable'
import OrdersPage from './features/admin/orders/OrdersTable'
import ProductDashboard from './features/admin/products/ProductTable'
import AddProduct from './features/admin/products/AddProduct'
import EditProduct from './features/admin/products/EditProduct'
import EditSubscription from './features/admin/subscriptions/EditSubscription'
import EditOrder from './features/admin/orders/EditOrder'
import SubscriptionPage from './features/admin/subscriptions/SubscriptionPage'
import AdminLoginPage from './features/admin/auth/AdminLoginPage'
import AdminProtectedRoute from './features/admin/auth/AdminProtectedRoute'

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={
              <UserLayout>
                <HomePage />
              </UserLayout>
            } />
            <Route path="/products" element={
              <UserLayout>
                <ProductsPage />
              </UserLayout>
            } />
            <Route path="/products/:id" element={
              <UserLayout>
                <ProductDetailsPage />
              </UserLayout>
            } />
            <Route path="/subscriptions" element={
              <UserLayout>
                <SubscriptionsPage />
              </UserLayout>
            } />
            <Route path="/bmi" element={
              <UserLayout>
                <BMICalculator />
              </UserLayout>
            } />
            <Route path="/fitness" element={
              <UserLayout>
                <FitnessPlans />
              </UserLayout>
            } />
            <Route path="/cart" element={
              <UserLayout>
                <CartPage />
              </UserLayout>
            } />
            <Route path="/order" element={
              <UserLayout>
                <OrderPage />
              </UserLayout>
            } />
            <Route path="/progress" element={
              <UserLayout>
                <ProgressTracker />
              </UserLayout>
            } />

            {/* Auth routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Protected routes */}
            <Route path="/dashboard" element={
              <UserLayout>
                <Dashboard />
              </UserLayout>
            } />

            {/* Admin routes */}
            <Route path="/admin-login" element={<AdminLoginPage />} />

            <Route path="/admin" element={<AdminProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="orders" element={<OrdersPage />} />
                <Route path="products" element={<ProductDashboard />} />
                <Route path="products/add" element={<AddProduct />} />
                <Route path="products/edit/:id" element={<EditProduct />} />
                <Route path="subscriptions/edit/:id" element={<EditSubscription />} />
                <Route path="orders/edit/:id" element={<EditOrder />} />
                <Route path="subscriptions" element={<SubscriptionPage />} />
              </Route>
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App