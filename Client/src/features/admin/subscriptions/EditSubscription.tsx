import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, DollarSign, CreditCard, UserCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const EditSubscription = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // Subscription ID from URL params
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    billingCycle: 'monthly',
    features: [] as string[],
    status: 'Active',
  });

  const billingCycles = [
    'daily',
    'weekly',
    'monthly',
    'yearly',
  ];

  const nav = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { label: 'Users', icon: UserCircle, path: '/UserManagement' },
    { label: 'Products', icon: Package, path: '/ProductDashboard' },
    { label: 'Orders', icon: ShoppingCart, path: '/OrdersPage' },
    { label: 'Subscriptions', icon: CreditCard, path: '/SubscriptionPage' },
    { label: 'Settings', icon: DollarSign, path: '/Settings' },
  ];

  // Simulate loading subscription data (in a real app, this would come from an API)
  useEffect(() => {
    // This is where you would fetch the subscription data based on the ID
    // For now, we'll simulate loading with dummy data
    const dummySubscription = {
      name: 'Gold Plan',
      description: 'Premium subscription with exclusive features and priority support.',
      price: '49.99',
      billingCycle: 'monthly',
      features: [
        '2 Product Boxes per month',
        'Priority Support',
        'Premium Content Access',
        'Exclusive Discounts',
      ],
      status: 'Active',
    };
    
    setFormData(dummySubscription);
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData(prev => ({
      ...prev,
      features: newFeatures
    }));
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const removeFeature = (index: number) => {
    const newFeatures = [...formData.features];
    newFeatures.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      features: newFeatures
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Subscription data updated:', formData);
    
    // In a real app, you would send this data to your backend API
    // For now, just showing a success message
    alert('Subscription updated successfully!');
    navigate('/SubscriptionPage'); // Navigate back to subscription page
  };

  const handleCancel = () => {
    navigate('/SubscriptionPage');
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white hidden md:flex flex-col shadow-2xl">
        <div className="px-6 py-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
              <CreditCard className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
              Admin Panel
            </h1>
          </div>
          <p className="text-slate-400 text-sm">Subscription Management</p>
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
              Edit Subscription Plan
            </h1>
            <p className="text-slate-500">Update subscription plan details</p>
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
                  {/* Plan Name */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-slate-700">
                      Plan Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/70 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      placeholder="Enter plan name"
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

                  {/* Billing Cycle */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-slate-700">
                      Billing Cycle *
                    </label>
                    <select
                      name="billingCycle"
                      value={formData.billingCycle}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/70 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    >
                      {billingCycles.map((cycle) => (
                        <option key={cycle} value={cycle}>
                          {cycle.charAt(0).toUpperCase() + cycle.slice(1)}
                        </option>
                      ))}
                    </select>
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
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/70 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="Enter plan description"
                  />
                </div>

                {/* Features */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold mb-2 text-slate-700">
                    Features
                  </label>
                  <div className="space-y-3">
                    {formData.features.map((feature, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => handleFeatureChange(index, e.target.value)}
                          className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-white/70 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                          placeholder="Enter feature"
                        />
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="px-4 py-3 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addFeature}
                      className="px-4 py-3 bg-indigo-100 text-indigo-700 rounded-xl hover:bg-indigo-200 transition-colors"
                    >
                      + Add Feature
                    </button>
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
                    Update Plan
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

export default EditSubscription;