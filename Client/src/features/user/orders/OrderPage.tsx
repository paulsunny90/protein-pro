import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, User, Building2, CheckCircle, ChevronRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { createOrder } from '../../../store/slice/orderSlice';
import { clearCart } from '../../../store/slice/cartSlice';
import { fetchAddresses } from '../../../store/slice/addressSlice';
import PaymentPage from './payPage';
import OrderSuccessPage from './OredeSucesespage';
import type { Address } from '../../../services/addressService';

const OrderPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { items: cartItems } = useAppSelector((state: any) => state.cart);
  const { loading } = useAppSelector((state: any) => state.order);
  const { addresses } = useAppSelector((state: any) => state.address);
  const orderSuccessRef = React.useRef(false);

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

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [isManualEntry, setIsManualEntry] = useState(false);

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  useEffect(() => {
    if (addresses.length > 0 && !shippingInfo.address && !isManualEntry) {
      const defaultAddr = addresses.find((a: Address) => a.isDefault) || addresses[0];
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr._id || null);
        setShippingInfo({
          firstName: defaultAddr.firstName,
          lastName: defaultAddr.lastName,
          email: defaultAddr.email || user?.email || '',
          phone: defaultAddr.phone,
          address: `${defaultAddr.street}${defaultAddr.houseNoOrName ? `, ${defaultAddr.houseNoOrName}` : ''}`,
          city: defaultAddr.city,
          state: defaultAddr.state,
          zipCode: defaultAddr.postalCode,
          country: defaultAddr.country
        });
      }
    }
  }, [addresses, user?.email, isManualEntry]);

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
          product: item.product?._id
        })),
        subtotal: subtotal.toFixed(2),
        shipping: shipping.toFixed(2),
        tax: tax.toFixed(2),
        total: total.toFixed(2)
      });
    } else {
      if (step !== 3 && !orderSuccessRef.current) {
        navigate('/cart');
      }
    }
  }, [cartItems, navigate, step]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async () => {
    if (!orderSummary) return;
    const orderData = {
      orderItems: orderSummary.items.map((item: any) => ({
        product: item.product,
        quantity: item.quantity,
        size: item.size,
        price: item.price
      })),
      shippingAddress: shippingInfo,
      paymentMethod: paymentMethod === 'credit-card' ? 'ONLINE' : 'COD',
      itemsPrice: parseFloat(orderSummary.subtotal),
      shippingPrice: parseFloat(orderSummary.shipping),
      totalPrice: parseFloat(orderSummary.total)
    };
    const resultAction = await dispatch(createOrder(orderData));
    if (createOrder.fulfilled.match(resultAction)) {
      orderSuccessRef.current = true;
      dispatch(clearCart());
      setStep(3);
    }
  };

  const InputField = ({ label, icon: Icon, ...props }: any) => (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">{label}</label>
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
        <div className="flex items-center gap-4">
          {addresses.length > 0 && (
            <button
              onClick={() => {
                setIsManualEntry(!isManualEntry);
                if (!isManualEntry) setSelectedAddressId(null);
              }}
              className="text-sm font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2"
            >
              <MapPin className="w-4 h-4" />
              {isManualEntry ? "Show Saved Addresses" : "Enter New Address"}
            </button>
          )}
        </div>
      </div>

      {!isManualEntry && addresses.length > 0 ? (
        <div className="mb-0 space-y-4 animate-fade-in">
          <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Select a delivery address</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {addresses.map((addr: Address) => {
              const isActive = selectedAddressId === addr._id;
              return (
                <div
                  key={addr._id}
                  onClick={() => {
                    setSelectedAddressId(addr._id || null);
                    setShippingInfo({
                      firstName: addr.firstName,
                      lastName: addr.lastName,
                      email: addr.email || user?.email || '',
                      phone: addr.phone,
                      address: `${addr.street}${addr.houseNoOrName ? `, ${addr.houseNoOrName}` : ''}`,
                      city: addr.city,
                      state: addr.state,
                      zipCode: addr.postalCode,
                      country: addr.country
                    });
                  }}
                  className={`p-5 border-2 rounded-2xl cursor-pointer transition-all duration-300 relative group ${isActive ? 'border-blue-600 bg-blue-50/50 shadow-md ring-4 ring-blue-500/10 scale-[1.02]' : 'border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50'}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      <div className={`p-2 rounded-lg ${isActive ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}><MapPin className="w-5 h-5" /></div>
                      <div>
                        <p className="font-bold text-gray-900">{addr.firstName} {addr.lastName}</p>
                        <p className="text-sm text-gray-600 mt-1 capitalize">{addr.street}</p>
                        <p className="text-sm text-gray-600">{addr.city}, {addr.state} {addr.postalCode}</p>
                        <p className="text-xs text-gray-400 mt-2 flex items-center gap-1"><Phone className="w-3 h-3" /> {addr.phone}</p>
                      </div>
                    </div>
                    {isActive && (
                      <div className="absolute top-4 right-4 animate-scale-in"><CheckCircle className="w-6 h-6 text-blue-600" /></div>
                    )}
                    {addr.isDefault && !isActive && (
                      <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full uppercase">Default</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up">
          <InputField label="First Name" icon={User} type="text" name="firstName" value={shippingInfo.firstName} onChange={handleInputChange} placeholder="John" />
          <InputField label="Last Name" icon={User} type="text" name="lastName" value={shippingInfo.lastName} onChange={handleInputChange} placeholder="Doe" />
          <InputField label="Email Address" icon={Mail} type="email" name="email" value={shippingInfo.email} onChange={handleInputChange} placeholder="john@example.com" />
          <InputField label="Phone Number" icon={Phone} type="tel" name="phone" value={shippingInfo.phone} onChange={handleInputChange} placeholder="(123) 456-7890" />
          <div className="md:col-span-2">
            <InputField label="Street Address" icon={MapPin} type="text" name="address" value={shippingInfo.address} onChange={handleInputChange} placeholder="123 Main St, Apt 4B" />
          </div>
          <InputField label="City" icon={Building2} type="text" name="city" value={shippingInfo.city} onChange={handleInputChange} placeholder="New York" />
          <InputField label="State / Province" icon={Building2} type="text" name="state" value={shippingInfo.state} onChange={handleInputChange} placeholder="NY" />
          <InputField label="ZIP / Postal Code" icon={MapPin} type="text" name="zipCode" value={shippingInfo.zipCode} onChange={handleInputChange} placeholder="10001" />
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Country</label>
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
      )}

      <div className="mt-10 flex flex-col-reverse md:flex-row justify-between gap-4">
        <button
          onClick={() => navigate('/cart')}
          className="flex items-center justify-center text-gray-600 py-3 px-6 rounded-xl font-semibold hover:bg-gray-100 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="mr-2 w-5 h-5" /> Back to Cart
        </button>
        <button
          onClick={() => setStep(2)}
          disabled={!shippingInfo.address || !shippingInfo.city || !shippingInfo.state || !shippingInfo.zipCode || loading}
          className="group flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-10 rounded-xl font-bold shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : 'Continue to Payment'}<ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
