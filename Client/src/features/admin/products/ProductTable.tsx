import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchProducts, deleteProduct } from '../../../store/slice/productSlice';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  CreditCard, 
  UserCircle
} from 'lucide-react';

const ProductDashboard = () => {
   const dispatch = useAppDispatch();

  const { products, loading } = useAppSelector(
    (state) => state.product
  );

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading products...</p>
        </div>
      </div>
    );
  }

  // 🔢 Dynamic stats
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.isActive).length;
  const inactiveProducts = products.filter(p => !p.isActive).length;
    
  const stats = [
    { label: 'Total Products', value: totalProducts.toString(), icon: '📦', color: 'from-blue-500 to-cyan-500', change: '+12%' },
    { label: 'Active', value: activeProducts.toString(), icon: '✅', color: 'from-green-500 to-emerald-500', change: '+8%' },
    { label: 'Inactive', value: inactiveProducts.toString(), icon: '⚠️', color: 'from-orange-500 to-red-500', change: '-1' },
    { label: 'Categories', value: [...new Set(products.map(p => p.category))].length.toString(), icon: '🏷️', color: 'from-purple-500 to-indigo-500', change: '+3' },
  ];

  const nav = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { label: 'Users', icon: UserCircle, path: '/UserManagement' },
    { label: 'Products', icon: Package, path: '/ProductDashboard', active: true },
    { label: 'Orders', icon: ShoppingCart, path: '/OrdersPage' },
    { label: 'Subscriptions', icon: CreditCard, path: '/SubscriptionPage' },
    { label: 'Settings', icon: DollarSign, path: '/Settings' },
  ];

  // const products = [
  //   { name: 'Whey Protein Powder', sku: 'WP-1001', category: 'Protein', price: '$29.99', stock: 150, status: 'Active', rating: '4.8', reviews: 124 },
  //   { name: 'Plant-Based Protein', sku: 'PP-1002', category: 'Protein', price: '$34.99', stock: 85, status: 'Inactive', rating: '4.6', reviews: 89 },
  //   { name: 'Protein Bars', sku: 'PB-1003', category: 'Protein', price: '$19.99', stock: 200, status: 'Active', rating: '4.5', reviews: 210 },
  //   { name: 'Pre-Workout Supplement', sku: 'PW-1004', category: 'Supplements', price: '$39.99', stock: 0, status: 'Inactive', rating: '4.7', reviews: 76 },
  // ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white hidden md:flex flex-col shadow-2xl">
        <div className="px-6 py-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
              Admin Panel
            </h1>
          </div>
          <p className="text-slate-400 text-sm">Product Management</p>
        </div>

        <nav className="flex-1 px-4 py-2 space-y-1">
          {nav.map((item, i) => (
            <Link
              key={i}
              to={item.path}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm transition-all duration-300 hover:translate-x-1 ${
                item.active 
                  ? 'bg-gradient-to-r from-indigo-600/20 to-purple-600/20 text-white border border-indigo-500/30 shadow-lg' 
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className={`p-1.5 rounded-lg ${item.active ? 'bg-indigo-500' : 'bg-slate-700'}`}>
                <item.icon className="w-5 h-5" />
              </div>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="bg-slate-800/50 rounded-xl p-3">
            <p className="text-xs text-slate-400">System Status</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-400">All systems operational</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Product Dashboard
            </h1>
            <p className="text-slate-500">Manage your product inventory</p>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/AddProduct" className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg">
              + Add Product
            </Link>
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold cursor-pointer hover:scale-105 transition-transform">
              A
            </div>
          </div>
        </header>

        <main className="p-6 flex-1">
          {/* Filters & Search */}
          <div className="flex flex-wrap items-end gap-4 mb-6">
            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-1 text-slate-700">Search Products</label>
              <input 
                type="text" 
                placeholder="Search by name or category..." 
                className="w-72 px-4 py-3 border border-slate-200 rounded-xl bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
              />
            </div>
            <select className="px-4 py-3 border border-slate-200 rounded-xl bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm min-w-[160px]">
              <option>All Categories</option>
              <option>Protein</option>
              <option>Supplements</option>
              <option>Vitamins</option>
            </select>
            <select className="px-4 py-3 border border-slate-200 rounded-xl bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm min-w-[160px]">
              <option>All Statuses</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6">
            {stats.map((stat, i) => (
              <StatCard key={i} {...stat} />
            ))}
          </div>

          {/* Products Table */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 hover:border-indigo-200 transition-all overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-800">Product Catalog</h2>
              <div className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium">
                {products.length} products
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50">
                  <tr className="text-sm font-semibold text-slate-600">
                    <th className="p-4">Product</th>
                    <th className="p-4">Name</th>
                    <th className="p-4">Brand</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {item.imageUrl ? (
                            <img 
                              src={`http://localhost:5000${item.imageUrl}`} 
                              alt={item.name}
                              className="w-12 h-12 rounded-xl object-cover shadow-md"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-md">
                              {item.name.charAt(0)}
                            </div>
                          )}
                          <span className="font-semibold text-slate-800">{item.name}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-3 py-1.5 text-xs font-bold rounded-full bg-purple-50 text-purple-600 shadow-sm">
                          {item.brand}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="px-3 py-1.5 text-xs font-bold rounded-full bg-blue-50 text-blue-600 shadow-sm">
                          {item.category}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-slate-800">${item.price.toFixed(2)}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1.5 text-xs font-semibold rounded-full shadow-sm ${
                          item.isActive 
                            ? 'bg-green-50 text-green-600' 
                            : 'bg-red-50 text-red-600'
                        }`}>
                          {item.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="p-4">
                        <ProductActionButtons productId={item._id || ''} status={item.isActive ? 'Active' : 'Inactive'} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-slate-200 text-center">
              <button className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors">
                Load More Products
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

// Stat Card Component
function StatCard({ label, value, icon, color, change }: { 
  label: string; 
  value: string; 
  icon: string; 
  color: string;
  change: string;
}) {
  return (
    <div className="p-6 bg-white/70 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:border-indigo-200 group">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-slate-500 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-slate-800 mt-1">{value}</p>
          <div className="flex items-center gap-1 mt-2">
            <span className="text-green-600 text-sm font-semibold">{change}</span>
            <span className="text-slate-400 text-xs">this month</span>
          </div>
        </div>
        <div className={`text-2xl p-3 rounded-xl bg-gradient-to-r ${color} shadow-md group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
      </div>
      <div className="mt-4 w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full bg-gradient-to-r ${color} rounded-full w-3/4 animate-pulse`}></div>
      </div>
    </div>
  );
}

// Action Button Component
function ActionButton({ label, color, onClick }: { label: string; color: "blue" | "green" | "red" | "gray"; onClick?: () => void }) {
  const colorClasses = {
    blue: "bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200",
    green: "bg-green-50 hover:bg-green-100 text-green-600 border-green-200",
    red: "bg-red-50 hover:bg-red-100 text-red-600 border-red-200",
    gray: "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200"
  };
  
  return (
    <button 
      className={`px-3 py-1.5 border rounded-lg text-sm font-medium transition-all hover:scale-105 ${colorClasses[color]}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

// Product Action Buttons Component
function ProductActionButtons({ productId, status }: { productId: string; status: string }) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const handleEdit = () => {
    navigate(`/EditProduct/${productId}`);
  };
  
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await dispatch(deleteProduct(productId)).unwrap();
        alert('Product deleted successfully!');
      } catch (error: any) {
        console.error('Delete error:', error);
        alert(`Failed to delete product: ${error.message}`);
      }
    }
  };
  
  const handleToggleStatus = () => {
    console.log(`${status === 'Active' ? 'Deactivating' : 'Activating'} product ${productId}`);
    // In a real app, you would call your API to toggle the status
  };
  
  return (
    <div className="flex flex-wrap gap-2">
      <ActionButton label="Edit" color="blue" onClick={handleEdit} />
      <ActionButton label="Delete" color="red" onClick={handleDelete} />
      <ActionButton 
        label={status === 'Active' ? 'Deactivate' : 'Activate'} 
        color={status === 'Active' ? 'red' : 'green'}
        onClick={handleToggleStatus}
      />
    </div>
  );
}

export default ProductDashboard;
