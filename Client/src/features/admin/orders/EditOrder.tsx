import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, DollarSign, CreditCard, UserCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const EditOrder = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // Order ID from URL params
  
  const [formData, setFormData] = useState({
    orderId: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    shippingAddress: '',
    shippingCity: '',
    shippingCountry: '',
    shippingZipCode: '',
    orderDate: '',
    status: 'Processing',
    paymentMethod: 'Credit Card',
    paymentStatus: 'Paid',
    items: [] as { productName: string; quantity: number; price: number; subtotal: number }[],
    subtotal: 0,
    tax: 0,
    shipping: 0,
    discount: 0,
    total: 0,
  });

  const statuses = [
    'Processing',
    'Shipped',
    'Delivered',
    'Cancelled',
  ];

  const paymentMethods = [
    'Credit Card',
    'PayPal',
    'Bank Transfer',
    'Cash on Delivery',
  ];

  const paymentStatuses = [
    'Paid',
    'Pending',
    'Failed',
    'Refunded',
  ];

  const nav = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { label: 'Users', icon: UserCircle, path: '/UserManagement' },
    { label: 'Products', icon: Package, path: '/ProductDashboard' },
    { label: 'Orders', icon: ShoppingCart, path: '/OrdersPage' },
    { label: 'Subscriptions', icon: CreditCard, path: '/SubscriptionPage' },
    { label: 'Settings', icon: DollarSign, path: '/Settings' },
  ];

  // Simulate loading order data (in a real app, this would come from an API)
  useEffect(() => {
    // This is where you would fetch the order data based on the ID
    // For now, we'll simulate loading with dummy data
    const dummyOrder = {
      orderId: 'ORD-001',
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      customerPhone: '+1 (555) 123-4567',
      shippingAddress: '123 Main Street',
      shippingCity: 'New York',
      shippingCountry: 'USA',
      shippingZipCode: '10001',
      orderDate: '2023-06-15',
      status: 'Processing',
      paymentMethod: 'Credit Card',
      paymentStatus: 'Paid',
      items: [
        { productName: 'Whey Protein Powder', quantity: 2, price: 29.99, subtotal: 59.98 },
        { productName: 'Protein Bar', quantity: 1, price: 4.99, subtotal: 4.99 },
      ],
      subtotal: 64.97,
      tax: 5.20,
      shipping: 9.99,
      discount: 0,
      total: 80.16,
    };
    
    setFormData(dummyOrder);
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleItemChange = (index: number, field: keyof typeof formData.items[0], value: string | number) => {
    const newItems = [...formData.items];
    (newItems[index][field] as any) = value;
    setFormData(prev => ({
      ...prev,
      items: newItems
    }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [
        ...prev.items,
        { productName: '', quantity: 1, price: 0, subtotal: 0 }
      ]
    }));
  };

  const removeItem = (index: number) => {
    const newItems = [...formData.items];
    newItems.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      items: newItems
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Order data updated:', formData);
    
    // In a real app, you would send this data to your backend API
    // For now, just showing a success message
    alert('Order updated successfully!');
    navigate('/OrdersPage'); // Navigate back to orders page
  };

  const handleCancel = () => {
    navigate('/OrdersPage');
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white hidden md:flex flex-col shadow-2xl">
        <div className="px-6 py-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
              Admin Panel
            </h1>
          </div>
          <p className="text-slate-400 text-sm">Order Management</p>
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
              Edit Order
            </h1>
            <p className="text-slate-500">Update order information</p>
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
          <div className="max-w-6xl mx-auto">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 mb-6">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* Order ID */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-slate-700">
                      Order ID *
                    </label>
                    <input
                      type="text"
                      name="orderId"
                      value={formData.orderId}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/70 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      placeholder="Enter order ID"
                    />
                  </div>

                  {/* Order Date */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-slate-700">
                      Order Date
                    </label>
                    <input
                      type="date"
                      name="orderDate"
                      value={formData.orderDate}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/70 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Customer Name */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-slate-700">
                      Customer Name *
                    </label>
                    <input
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/70 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      placeholder="Enter customer name"
                    />
                  </div>

                  {/* Customer Email */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-slate-700">
                      Customer Email
                    </label>
                    <input
                      type="email"
                      name="customerEmail"
                      value={formData.customerEmail}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/70 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      placeholder="Enter customer email"
                    />
                  </div>

                  {/* Customer Phone */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-slate-700">
                      Customer Phone
                    </label>
                    <input
                      type="tel"
                      name="customerPhone"
                      value={formData.customerPhone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/70 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      placeholder="Enter customer phone"
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
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-slate-700">
                      Payment Method
                    </label>
                    <select
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/70 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    >
                      {paymentMethods.map((method) => (
                        <option key={method} value={method}>
                          {method}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Payment Status */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-slate-700">
                      Payment Status
                    </label>
                    <select
                      name="paymentStatus"
                      value={formData.paymentStatus}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/70 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    >
                      {paymentStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-slate-700">
                      Shipping Address
                    </label>
                    <input
                      type="text"
                      name="shippingAddress"
                      value={formData.shippingAddress}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/70 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      placeholder="Street address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-slate-700">
                      City
                    </label>
                    <input
                      type="text"
                      name="shippingCity"
                      value={formData.shippingCity}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/70 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      placeholder="City"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-slate-700">
                      Country
                    </label>
                    <input
                      type="text"
                      name="shippingCountry"
                      value={formData.shippingCountry}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/70 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      placeholder="Country"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-slate-700">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      name="shippingZipCode"
                      value={formData.shippingZipCode}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/70 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      placeholder="ZIP code"
                    />
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-slate-800">Order Items</h2>
                    <button
                      type="button"
                      onClick={addItem}
                      className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
                    >
                      + Add Item
                    </button>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-50/50">
                        <tr>
                          <th className="p-3 text-left text-sm font-semibold text-slate-600">Product</th>
                          <th className="p-3 text-left text-sm font-semibold text-slate-600">Quantity</th>
                          <th className="p-3 text-left text-sm font-semibold text-slate-600">Price</th>
                          <th className="p-3 text-left text-sm font-semibold text-slate-600">Subtotal</th>
                          <th className="p-3 text-left text-sm font-semibold text-slate-600">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.items.map((item, index) => (
                          <tr key={index} className="border-b border-slate-100">
                            <td className="p-3">
                              <input
                                type="text"
                                value={item.productName}
                                onChange={(e) => handleItemChange(index, 'productName', e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white/70 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                placeholder="Product name"
                              />
                            </td>
                            <td className="p-3">
                              <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                                className="w-20 px-3 py-2 rounded-lg border border-slate-200 bg-white/70 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                              />
                            </td>
                            <td className="p-3">
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={item.price}
                                onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value))}
                                className="w-24 px-3 py-2 rounded-lg border border-slate-200 bg-white/70 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                              />
                            </td>
                            <td className="p-3 font-semibold text-slate-800">${item.subtotal.toFixed(2)}</td>
                            <td className="p-3">
                              <button
                                type="button"
                                onClick={() => removeItem(index)}
                                className="px-3 py-1 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Order Totals */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div></div> {/* Empty column for alignment */}
                  <div className="bg-slate-50/50 rounded-xl p-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-slate-600">Subtotal:</span>
                      <span className="font-semibold">${formData.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-slate-600">Tax:</span>
                      <span className="font-semibold">${formData.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-slate-600">Shipping:</span>
                      <span className="font-semibold">${formData.shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-slate-600">Discount:</span>
                      <span className="font-semibold">-${formData.discount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between pt-3 border-t border-slate-200 mt-2">
                      <span className="text-lg font-bold text-slate-800">Total:</span>
                      <span className="text-lg font-bold text-slate-800">${formData.total.toFixed(2)}</span>
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
                    Update Order
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

export default EditOrder;