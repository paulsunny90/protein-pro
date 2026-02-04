  

import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const ProductDashboard = () => {
  const stats = [
    { label: 'Total Products', value: '5', icon: '📦', color: 'from-blue-500 to-cyan-500', change: '+12%' },
    { label: 'In Stock', value: '4', icon: '✅', color: 'from-green-500 to-emerald-500', change: '+8%' },
    { label: 'Out of Stock', value: '1', icon: '⚠️', color: 'from-orange-500 to-red-500', change: '-1' },
    { label: 'Avg. Rating', value: '4.7', icon: '⭐', color: 'from-purple-500 to-indigo-500', change: '+0.2' },
  ];

  const products = [
    { name: 'Whey Protein Powder', sku: 'WP-1001', category: 'Protein', price: '$29.99', stock: 150, status: 'Active', rating: '4.8', reviews: 124 },
    { name: 'Plant-Based Protein', sku: 'PP-1002', category: 'Protein', price: '$34.99', stock: 85, status: 'Inactive', rating: '4.6', reviews: 89 },
    { name: 'Protein Bars', sku: 'PB-1003', category: 'Protein', price: '$19.99', stock: 200, status: 'Active', rating: '4.5', reviews: 210 },
    { name: 'Pre-Workout Supplement', sku: 'PW-1004', category: 'Supplements', price: '$39.99', stock: 0, status: 'Inactive', rating: '4.7', reviews: 76 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Product Management
          </h1>
          <p className="text-slate-500 mt-1">Manage your product inventory and catalog</p>
        </div>
        <Link to="/AddProduct" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
          + New Product
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-wrap items-end gap-4 mb-10">
        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1 text-slate-700">Search Products</label>
          <input 
            type="text" 
            placeholder="Search by name or SKU..." 
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-12">
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
                <th className="p-4">SKU</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Status</th>
                <th className="p-4">Rating</th>
                <th className="p-4">Reviews</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-md">
                        {item.name.charAt(0)}
                      </div>
                      <span className="font-semibold text-slate-800">{item.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-600 font-mono">{item.sku}</td>
                  <td className="p-4">
                    <span className="px-3 py-1.5 text-xs font-bold rounded-full bg-blue-50 text-blue-600 shadow-sm">
                      {item.category}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-slate-800">{item.price}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm ${
                      item.stock === 0 
                        ? 'bg-red-100 text-red-600' 
                        : 'bg-green-100 text-green-600'
                    }`}>
                      {item.stock} {item.stock > 0 ? 'in stock' : 'out of stock'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1.5 text-xs font-semibold rounded-full shadow-sm ${
                      item.status === 'Active' 
                        ? 'bg-green-50 text-green-600' 
                        : 'bg-red-50 text-red-600'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">★</span>
                      <span className="font-semibold text-slate-800">{item.rating}</span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-600">{item.reviews}</td>
                  <td className="p-4">
                    <ProductActionButtons productId={item.sku} status={item.status} />
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
  
  const handleEdit = () => {
    navigate(`/EditProduct/${productId}`);
  };
  
  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this product?')) {
      console.log(`Deleting product ${productId}`);
      // In a real app, you would call your API to delete the product
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
