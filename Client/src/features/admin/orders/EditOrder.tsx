import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, CreditCard, UserCircle, Loader2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getOrderById, updateOrder } from '../../../services/orderService';

const EditOrder = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    orderId: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    shippingAddress: '',
    shippingCity: '',
    shippingCountry: 'India',
    shippingZipCode: '',
    orderDate: '',
    status: 'Pending',
    paymentMethod: 'ONLINE',
    paymentStatus: 'Pending',
    items: [] as any[],
    subtotal: 0,
    tax: 0,
    shipping: 0,
    discount: 0,
    total: 0,
  });

  const statuses = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  const paymentStatuses = ['Paid', 'Pending', 'Failed', 'Refunded'];
  const paymentMethods = ['Credit Card', 'PayPal', 'Bank Transfer', 'Cash on Delivery', 'ONLINE', 'COD'];

  const nav = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { label: 'Users', icon: UserCircle, path: '/admin/users' },
    { label: 'Products', icon: Package, path: '/admin/products' },
    { label: 'Orders', icon: ShoppingCart, path: '/admin/orders' },
    { label: 'Subscriptions', icon: CreditCard, path: '/admin/subscriptions' },
  ];

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (!id) return;
        setLoading(true);
        const data = await getOrderById(id);

        setFormData({
          orderId: data._id,
          customerName: data.user?.name || '',
          customerEmail: data.user?.email || '',
          customerPhone: (data.shippingAddress as any)?.phone || '',
          shippingAddress: (data.shippingAddress as any)?.address || (data.shippingAddress as any)?.street || '',
          shippingCity: (data.shippingAddress as any)?.city || '',
          shippingCountry: (data.shippingAddress as any)?.country || 'India',
          shippingZipCode: (data.shippingAddress as any)?.zipCode || (data.shippingAddress as any)?.postalCode || '',
          orderDate: data.createdAt ? new Date(data.createdAt).toISOString().split('T')[0] : '',
          status: data.orderStatus,
          paymentMethod: data.paymentMethod,
          paymentStatus: data.isPaid ? 'Paid' : 'Pending',
          items: data.orderItems.map((item: any) => ({
            productName: item.product?.name || 'Product',
            quantity: item.quantity,
            price: item.price,
            subtotal: item.price * item.quantity,
            productId: item.product?._id || item.product
          })),
          subtotal: data.itemsPrice,
          tax: (data.totalPrice - data.itemsPrice - data.shippingPrice),
          shipping: data.shippingPrice,
          discount: 0,
          total: data.totalPrice,
        });
      } catch (err: any) {
        console.error('Error fetching order:', err);
        setError(err.response?.data?.message || 'Failed to load order');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };

    if (field === 'quantity' || field === 'price') {
      newItems[index].subtotal = newItems[index].quantity * newItems[index].price;
    }

    const subtotal = newItems.reduce((acc, item) => acc + item.subtotal, 0);

    setFormData(prev => ({
      ...prev,
      items: newItems,
      subtotal,
      total: subtotal + prev.shipping + prev.tax - prev.discount
    }));
  };

  const addItem = () => {
    // This would ideally open a product picker
    setFormData(prev => ({
      ...prev,
      items: [
        ...prev.items,
        { productName: '', quantity: 1, price: 0, subtotal: 0, productId: '' }
      ]
    }));
  };

  const removeItem = (index: number) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    const subtotal = newItems.reduce((acc, item) => acc + item.subtotal, 0);

    setFormData(prev => ({
      ...prev,
      items: newItems,
      subtotal,
      total: subtotal + prev.shipping + prev.tax - prev.discount
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!id) return;
      setIsSubmitting(true);

      const updateData = {
        orderStatus: formData.status,
        isPaid: formData.paymentStatus === 'Paid',
        shippingAddress: {
          address: formData.shippingAddress,
          city: formData.shippingCity,
          country: formData.shippingCountry,
          postalCode: formData.shippingZipCode,
          phone: formData.customerPhone,
        },
        orderItems: formData.items.map(item => ({
          product: item.productId,
          quantity: item.quantity,
          price: item.price
        })),
        totalPrice: formData.total,
        itemsPrice: formData.subtotal,
        shippingPrice: formData.shipping
      };

      await updateOrder(id, updateData);
      alert('Order updated successfully!');
      navigate('/admin/orders');
    } catch (err: any) {
      console.error('Error updating order:', err);
      alert(err.response?.data?.message || 'Failed to update order');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/orders');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <p className="text-xl font-bold text-slate-800">{error}</p>
        <button onClick={() => navigate('/admin/orders')} className="px-6 py-2 bg-indigo-600 text-white rounded-lg">Go Back</button>
      </div>
    );
  }

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
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm transition-all duration-300 hover:translate-x-1 ${window.location.pathname === item.path
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
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                  >
                    {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    {isSubmitting ? 'Updating...' : 'Update Order'}
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