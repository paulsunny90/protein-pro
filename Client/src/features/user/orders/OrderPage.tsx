import React, { useState, useEffect } from 'react';
import { CreditCard, MapPin, Phone, Mail, User, Building2, CheckCircle, Truck, ChevronRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { createOrder } from '../../../store/slice/orderSlice';
import { clearCart } from '../../../store/slice/cartSlice';
import PaymentPage from './payPage';
import OrderSuccessPage from './OredeSucesespage';

const OrderPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { items: cartItems } = useAppSelector((state: any) => state.cart);
  const { loading } = useAppSelector((state: any) => state.order);

  // Use a ref to track if order was successfully placed to avoid race condition with cart clearing
  const orderSuccessRef = React.useRef(false);

  // 1: Shipping, 2: Payment, 3: Confirmation (Success)
  const [step, setStep] = useState(1);

  const [shippingInfo, setShippingInfo] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [orderSummary, setOrderSummary] = useState<any>(null);

  useEffect(() => {
    if (cartItems.length > 0) {
      const subtotal = cartItems.reduce(
        (sum: number, item: any) => sum + (item.product?.price || 0) * item.quantity,
        0
      );
      const shipping = subtotal > 0 ? 5.99 : 0;
      const tax = subtotal * 0.08;
      const total = subtotal + shipping + tax;

      setOrderSummary({
        items: cartItems.map((item: any) => ({
          ...item.product,
          quantity: item.quantity,
          size: item.size,
          // We need to keep product ID for the order
          product: item.product?._id
        })),
        subtotal: subtotal.toFixed(2),
        shipping: shipping.toFixed(2),
        tax: tax.toFixed(2),
        total: total.toFixed(2)
      });
    } else {
      // If cart is empty, redirect to cart (unless we are at Success step or just placed an order)
      if (step !== 3 && !orderSuccessRef.current) {
        navigate('/cart');
      }
    }
  }, [cartItems, navigate, step]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePlaceOrder = async () => {
    const orderData = {
      items: orderSummary.items.map((item: any) => ({
        product: item.product, // ID
        quantity: item.quantity,
        size: item.size
      })),
      shippingAddress: shippingInfo,
      paymentMethod,
      totalAmount: parseFloat(orderSummary.total)
    };

    const resultAction = await dispatch(createOrder(orderData));

    if (createOrder.fulfilled.match(resultAction)) {
      // Set ref first to prevent redirect
      orderSuccessRef.current = true;
      dispatch(clearCart());
      setStep(3); // Go to Success
    } else {
      console.error("Order creation failed");
      // Optionally set an error state here
    }
  };

  const steps = [
    { number: 1, title: 'Shipping', icon: Truck },
    { number: 2, title: 'Payment', icon: CreditCard },
  ];

  const renderStepIndicator = () => (
    <div className="mb-12">
      <div className="flex items-center justify-between relative max-w-2xl mx-auto">
        {/* Connecting Line */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 rounded-full -z-10"></div>
        <div
          className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500 ease-out -z-10"
          style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
        ></div>

        {steps.map((s) => {
          const Icon = s.icon;
          const isActive = step >= s.number;
          const isCompleted = step > s.number;

          return (
            <div key={s.number} className="flex flex-col items-center group cursor-default">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${isActive
                    ? 'bg-white border-blue-600 shadow-[0_0_0_4px_rgba(37,99,235,0.2)] scale-110'
                    : 'bg-gray-100 border-white text-gray-400'
                  }`}
              >
                {isCompleted ? (
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                ) : (
                  <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                )}
              </div>
              <span className={`mt-3 text-sm font-semibold transition-colors duration-300 ${isActive ? 'text-blue-900' : 'text-gray-400'
                }`}>
                {s.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );

  const InputField = ({ label, icon: Icon, ...props }: any) => (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
        {label}
      </label>
      <div className="relative group">
        <div className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200">
          <Icon className="h-5 w-5" />
        </div>
        <input
          {...props}
          className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-200 outline-none text-gray-800 placeholder-gray-400 font-medium"
        />
      </div>
    </div>
  );

  const renderShippingForm = () => (
    <div className="soft-card p-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Shipping Details</h2>
        <span className="text-sm text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-full">Step 1 of 2</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="First Name"
          icon={User}
          type="text"
          name="firstName"
          value={shippingInfo.firstName}
          onChange={handleInputChange}
          placeholder="John"
        />
        <InputField
          label="Last Name"
          icon={User}
          type="text"
          name="lastName"
          value={shippingInfo.lastName}
          onChange={handleInputChange}
          placeholder="Doe"
        />
        <InputField
          label="Email Address"
          icon={Mail}
          type="email"
          name="email"
          value={shippingInfo.email}
          onChange={handleInputChange}
          placeholder="john@example.com"
        />
        <InputField
          label="Phone Number"
          icon={Phone}
          type="tel"
          name="phone"
          value={shippingInfo.phone}
          onChange={handleInputChange}
          placeholder="(123) 456-7890"
        />

        <div className="md:col-span-2">
          <InputField
            label="Street Address"
            icon={MapPin}
            type="text"
            name="address"
            value={shippingInfo.address}
            onChange={handleInputChange}
            placeholder="123 Main St, Apt 4B"
          />
        </div>

        <InputField
          label="City"
          icon={Building2}
          type="text"
          name="city"
          value={shippingInfo.city}
          onChange={handleInputChange}
          placeholder="New York"
        />
        <InputField
          label="State / Province"
          icon={Building2}
          type="text"
          name="state"
          value={shippingInfo.state}
          onChange={handleInputChange}
          placeholder="NY"
        />
        <InputField
          label="ZIP / Postal Code"
          icon={MapPin}
          type="text"
          name="zipCode"
          value={shippingInfo.zipCode}
          onChange={handleInputChange}
          placeholder="10001"
        />

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
            Country
          </label>
          <div className="relative">
            <select
              name="country"
              value={shippingInfo.country}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-200 outline-none text-gray-800 font-medium appearance-none cursor-pointer"
            >
              <option>United States</option>
              <option>Canada</option>
              <option>United Kingdom</option>
              <option>Australia</option>
              <option>Germany</option>
            </select>
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500">
              <ChevronRight className="w-5 h-5 rotate-90" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-col-reverse md:flex-row justify-between gap-4">
        <button
          onClick={() => navigate('/cart')}
          className="flex items-center justify-center text-gray-600 py-3 px-6 rounded-xl font-semibold hover:bg-gray-100 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="mr-2 w-5 h-5" />
          Back to Cart
        </button>
        <button
          onClick={() => setStep(2)}
          disabled={!shippingInfo.address || !shippingInfo.city || !shippingInfo.state || !shippingInfo.zipCode || loading}
          className="group flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-10 rounded-xl font-bold shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          {loading ? 'Processing...' : 'Continue to Payment'}
          <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/30 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {step !== 3 && (
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-3">Checkout</h1>
            <p className="text-lg text-gray-500">Complete your purchase securely in just a few steps.</p>
          </div>
        )}

        {step !== 3 && renderStepIndicator()}

        <div className="transition-all duration-500 ease-in-out">
          {step === 1 && renderShippingForm()}

          {step === 2 && (
            <PaymentPage
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              onNext={handlePlaceOrder}
              onBack={() => setStep(1)}
              loading={loading}
            />
          )}

          {step === 3 && (
            <OrderSuccessPage
              orderSummary={orderSummary}
              onContinueShopping={() => navigate('/')}
              onViewDashboard={() => navigate('/dashboard')}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderPage;