import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchProducts, deleteProduct } from '../../../store/slice/productSlice';
import { Package, Search, Filter, Edit2, Trash2, Zap, Activity, Heart, ShoppingBag } from 'lucide-react';

const ProductDashboard = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { products, loading } = useAppSelector((state) => state.product);

  const [activeTab, setActiveTab] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchProducts(true));
  }, [dispatch]);

  // Filter Logic
  const filteredProducts = products.filter(product => {
    const matchesTab = activeTab === 'All' || product.targetGroup === activeTab;
    const matchesType = filterType === 'All' || product.productType === filterType;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesType && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  const collections = [
    { id: 'All', label: 'Overview', icon: Package, color: 'indigo' },
    { id: 'Mens', label: 'Men', icon: Zap, color: 'blue' },
    { id: 'Women', label: 'Women', icon: Activity, color: 'pink' },
    { id: 'Babys', label: 'Baby', icon: Heart, color: 'emerald' },
  ];

  return (
    <div className="p-6 md:p-10 min-h-screen bg-slate-50/50">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 animate-fade-in">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Product Ecosystem</h1>
          <p className="text-slate-500 font-medium">Manage your nutritional catalog across all collections.</p>
        </div>
        <Link
          to="/admin/products/add"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:shadow-lg hover:-translate-y-1 transition-all"
        >
          <Package className="w-5 h-5" />
          <span>Add Product</span>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 animate-slide-up">
        <StatCard title="Total Inventory" value={products.length} icon={Package} color="blue" />
        <StatCard title="Active Listings" value={products.filter(p => p.isActive).length} icon={Activity} color="emerald" />
        <StatCard title="Low Stock" value={products.filter(p => (p.stock || 0) < 10 && (p.stock || 0) > 0).length} icon={Zap} color="amber" />
        <StatCard title="Out of Stock" value={products.filter(p => (p.stock || 0) === 0).length} icon={ShoppingBag} color="rose" />
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100 animate-slide-up delay-100">

        {/* Toolbar */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-8">

          {/* Collection Tabs */}
          <div className="flex p-1.5 bg-slate-100/80 rounded-2xl self-start">
            {collections.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${isActive
                    ? 'bg-white text-slate-800 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? `text-${tab.color}-500` : ''}`} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 pl-11 pr-5 py-3 bg-slate-50 border-0 rounded-2xl font-bold text-sm text-slate-700 focus:ring-2 focus:ring-indigo-100 placeholder-slate-400"
              />
            </div>

            {/* Type Filter */}
            <div className="relative group">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="appearance-none pl-11 pr-10 py-3 bg-slate-50 border-0 rounded-2xl font-bold text-sm text-slate-700 focus:ring-2 focus:ring-indigo-100 cursor-pointer"
              >
                <option value="All">All Types</option>
                <option value="Supplements">Supplements</option>
                <option value="Foods">Foods</option>
              </select>
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
          </div>
        </div>

        {/* Product Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50/50 text-left">
              <tr>
                <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-widest rounded-l-2xl">Product</th>
                <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-widest">Pricing</th>
                <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-widest">Inventory</th>
                <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-widest">Satus</th>
                <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-widest rounded-r-2xl">Actions</th>
              </tr>
            </thead>
            <tbody className="space-y-4">
              {filteredProducts.map((product) => (
                <tr key={product._id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white shadow-sm border border-slate-100 shrink-0">
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-300 font-bold text-xl">
                            {product.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{product.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-slate-500 font-medium">{product.category}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-300" />
                          <span className="text-xs text-slate-500 font-medium">{product.brand}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-black text-slate-700">${product.price}</div>
                    {product.discount > 0 && (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md mt-1 inline-block">
                        {product.discount}% OFF
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${(product.stock || 0) > 10 ? 'bg-emerald-500' : (product.stock || 0) > 0 ? 'bg-amber-500' : 'bg-red-500'}`} />
                      <span className="font-bold text-sm text-slate-600">
                        {product.stock || 0} units
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${product.isActive
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-slate-100 text-slate-500'
                      }`}>
                      {product.isActive ? 'Active' : 'Draft'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => navigate(`/admin/products/edit/${product._id}`)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => product._id && dispatch(deleteProduct(product._id))}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 text-center">No products found</h3>
              <p className="text-slate-500 text-sm">Try adjusting your active filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color }: any) => (
  <div className="p-6 bg-white rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 rounded-2xl bg-${color}-50 text-${color}-600`}>
        <Icon className="w-6 h-6" />
      </div>
      {/* <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">+2.5%</span> */}
    </div>
    <div className="text-4xl font-black text-slate-900 mb-1 tracking-tight">{value}</div>
    <div className="text-sm font-bold text-slate-400">{title}</div>
  </div>
);

export default ProductDashboard;
