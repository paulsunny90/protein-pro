import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, DollarSign, CreditCard, UserCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // Product ID from URL params
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    stock: '',
    sku: '',
    status: 'Active',
    images: [] as string[],
    tags: '',
  });

  const categories = [
    'Protein',
    'Supplements',
    'Vitamins',
    'Fitness',
    'Baby Nutrition',
    'Snacks',
    'Beverages',
  ];

  const nav = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { label: 'Users', icon: UserCircle, path: '/UserManagement' },
    { label: 'Products', icon: Package, path: '/ProductDashboard' },
    { label: 'Orders', icon: ShoppingCart, path: '/OrdersPage' },
    { label: 'Subscriptions', icon: CreditCard, path: '/SubscriptionPage' },
    { label: 'Settings', icon: DollarSign, path: '/Settings' },
  ];

  // Simulate loading product data (in a real app, this would come from an API)
  useEffect(() => {
    // This is where you would fetch the product data based on the ID
    // For now, we'll simulate loading with dummy data
    const dummyProduct = {
      name: 'Whey Protein Powder',
      description: 'High-quality whey protein powder for muscle recovery and growth.',
      category: 'Protein',
      price: '29.99',
      stock: '150',
      sku: 'WP-1001',
      status: 'Active',
      tags: 'protein, supplement, health, fitness',
      images: [] as string[], // Add the missing images property
    };
    
    setFormData(dummyProduct);
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tagsArray = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
    setFormData(prev => ({
      ...prev,
      tags: tagsArray.join(',')
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Product data updated:', formData);
    
    // In a real app, you would send this data to your backend API
    // For now, just showing a success message
    alert('Product updated successfully!');
    navigate('/ProductDashboard'); // Navigate back to product dashboard
  };

  const handleCancel = () => {
    navigate('/ProductDashboard');
  };

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
                window.location.pathname === item.path
                  ? 'bg-gradient-to-r from-indigo-600/20 to-purple-600/20 text-white border border-indigo-500/30 shadow-lg'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className={`p-1.5 rounded-lg ${window.location.pathname === item.path ? 'bg-indigo-500' : 'bg-slate-700'}`}>
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
              Edit Product
            </h1>
            <p className="text-slate-500">Update product information</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-6 h-6 text-slate-600"></div>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold cursor-pointer hover:scale-105 transition-transform">
              A
            </div>
          </div>
        </header>

        <main className="p-6 flex-1">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 mb-6">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* Product Name */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-slate-700">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/70 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      placeholder="Enter product name"
                    />
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-slate-700">
                      Price *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/70 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      placeholder="0.00"
                    />
                  </div>

                  {/* SKU */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-slate-700">
                      SKU
                    </label>
                    <input
                      type="text"
                      name="sku"
                      value={formData.sku}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/70 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      placeholder="Product SKU"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-slate-700">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/70 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Stock Quantity */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-slate-700">
                      Stock Quantity
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/70 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      placeholder="0"
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-slate-700">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/70 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold mb-2 text-slate-700">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/70 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="Enter product description"
                  />
                </div>

                {/* Tags */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold mb-2 text-slate-700">
                    Tags
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleTagsChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/70 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="Enter tags separated by commas (e.g., protein, supplement, health)"
                  />
                </div>

                {/* Images Upload */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold mb-2 text-slate-700">
                    Product Images
                  </label>
                  <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      <p className="text-slate-500 mb-2">Drag and drop images here, or click to browse</p>
                      <p className="text-sm text-slate-400">Supports JPG, PNG, SVG up to 5MB</p>
                      <button type="button" className="mt-4 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-200 transition-colors">
                        Select Files
                      </button>
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-4 pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-3 border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                  >
                    Update Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditProduct;