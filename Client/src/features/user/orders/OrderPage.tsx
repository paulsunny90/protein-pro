import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, User, Building2, CheckCircle, ChevronRight, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { createOrder } from '../../../store/slice/orderSlice';
import { clearCart, fetchCart } from '../../../store/slice/cartSlice';
import { fetchAddresses } from '../../../store/slice/addressSlice';
import PaymentPage from './payPage';
import OrderSuccessPage from './OredeSucesespage';
import type { Address } from '../../../services/addressService';
import api from '../../../utils/api';

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
    country: 'India'
  });

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [isManualEntry, setIsManualEntry] = useState(false);

  useEffect(() => {
    dispatch(fetchAddresses());
    dispatch(fetchCart());
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

  const [orderSummary, setOrderSummary] = useState<any>(null);

  useEffect(() => {
    if (cartItems.length > 0) {
      const subtotal = cartItems.reduce(
        (sum: number, item: any) => sum + (item.product?.price || 0) * item.quantity,
        0
      );
      const shipping = subtotal > 500 ? 0 : 50;
      const tax = subtotal * 0.18;
      const total = subtotal + shipping + tax;

      setOrderSummary({
        items: cartItems.map((item: any) => ({
          ...item.product,
          quantity: item.quantity,
          size: item.size,
          product: item.product?._id
        })),
        subtotal: subtotal.toFixed(0),
        shipping: shipping.toFixed(0),
        tax: tax.toFixed(0),
        total: total.toFixed(0)
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

  const handlePlaceOrder = async (paypalDetails?: any) => {
    if (!orderSummary) return;
    const orderData = {
      orderItems: orderSummary.items.map((item: any) => ({
        product: item.product,
        quantity: item.quantity,
        size: item.size,
        price: item.price
      })),
      shippingAddress: shippingInfo,
      paymentMethod: 'ONLINE',
      itemsPrice: parseFloat(orderSummary.subtotal),
      shippingPrice: parseFloat(orderSummary.shipping),
      totalPrice: parseFloat(orderSummary.total)
    };

    const resultAction = await dispatch(createOrder(orderData));

    if (createOrder.fulfilled.match(resultAction)) {
      const createdOrder = resultAction.payload;

      if (paypalDetails && createdOrder._id) {
        await api.put(`/orders/${createdOrder._id}/pay`, paypalDetails);
      }

      orderSuccessRef.current = true;
      dispatch(clearCart());
      setStep(3);
    }
  };

  const InputField = ({ label, icon: Icon, ...props }: any) => (
    <div className="space-y-2">
      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{label}</label>
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#a3e635] transition-colors duration-200">
          <Icon className="h-4 w-4" />
        </div>
        <input
          {...props}
          className="w-full pl-12 pr-4 py-4 bg-black border border-white/5 rounded-2xl focus:border-[#a3e635]/50 transition-all duration-200 outline-none text-white placeholder-slate-700 font-bold text-sm"
        />
      </div>
    </div>
  );

  const renderShippingForm = () => (
    <div className="bg-[#0d0d0d] rounded-[3rem] border border-white/5 p-8 lg:p-12 shadow-2xl animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <h2 className="text-1xl font-black text-white tracking-tight uppercase">Mission Deployment</h2>
        <div className="flex items-center gap-4">
          {addresses.length > 0 && (
            <button
              onClick={() => {
                setIsManualEntry(!isManualEntry);
                if (!isManualEntry) setSelectedAddressId(null);
              }}
              className="text-[10px] font-black text-[#a3e635] uppercase tracking-widest bg-[#a3e635]/10 px-6 py-3 rounded-xl transition-all hover:bg-[#a3e635] hover:text-black flex items-center gap-2"
            >
              <MapPin className="w-3 h-3" />
              {isManualEntry ? "Saved Protocols" : "New Coordinate"}
            </button>
          )}
        </div>
      </div>

      {!isManualEntry && addresses.length > 0 ? (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  className={`p-8 bg-black border rounded-[2rem] cursor-pointer transition-all duration-300 relative group ${isActive ? 'border-[#a3e635] shadow-lg shadow-[#a3e635]/5 scale-[1.02]' : 'border-white/5 hover:border-white/10'}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex gap-6">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${isActive ? 'bg-[#a3e635] text-black' : 'bg-white/5 text-slate-500'}`}>
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-black text-white text-lg uppercase tracking-tight">{addr.firstName} {addr.lastName}</p>
                        <p className="text-sm text-slate-400 mt-2 font-medium">{addr.street}</p>
                        <p className="text-sm text-slate-400 font-medium">{addr.city}, {addr.state} {addr.postalCode}</p>
                        <div className="flex items-center gap-2 mt-4 text-[10px] font-black text-[#a3e635] uppercase tracking-widest">
                          <Phone className="w-3 h-3" /> {addr.phone}
                        </div>
                      </div>
                    </div>
                    {isActive && (
                      <div className="absolute top-6 right-6 animate-scale-in">
                        <CheckCircle className="w-6 h-6 text-[#a3e635]" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-slide-up">
          <InputField label="First Identification" icon={User} type="text" name="firstName" value={shippingInfo.firstName} onChange={handleInputChange} placeholder="First Name" />
          <InputField label="Last Identification" icon={User} type="text" name="lastName" value={shippingInfo.lastName} onChange={handleInputChange} placeholder="Last Name" />
          <InputField label="Signal Channel (Email)" icon={Mail} type="email" name="email" value={shippingInfo.email} onChange={handleInputChange} placeholder="email@nexus.com" />
          <InputField label="Comms Line (Phone)" icon={Phone} type="tel" name="phone" value={shippingInfo.phone} onChange={handleInputChange} placeholder="+91" />
          <div className="md:col-span-2">
            <InputField label="Primary Coordinates" icon={MapPin} type="text" name="address" value={shippingInfo.address} onChange={handleInputChange} placeholder="Street, Sector, Building" />
          </div>
          <InputField label="Sector (City)" icon={Building2} type="text" name="city" value={shippingInfo.city} onChange={handleInputChange} placeholder="City" />
          <InputField label="Zone (State)" icon={Building2} type="text" name="state" value={shippingInfo.state} onChange={handleInputChange} placeholder="State" />
          <InputField label="Tactical PIN" icon={MapPin} type="text" name="zipCode" value={shippingInfo.zipCode} onChange={handleInputChange} placeholder="Zip Code" />
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Domain (Country)</label>
            <div className="relative">
              <select
                name="country"
                value={shippingInfo.country}
                onChange={handleInputChange}
                className="w-full px-4 py-4 bg-black border border-white/5 rounded-2xl focus:border-[#a3e635]/50 transition-all duration-200 outline-none text-white font-bold text-sm appearance-none cursor-pointer"
              >
                <option>India</option>
                <option>United States</option>
                <option>United Arab Emirates</option>
                <option>Singapore</option>
              </select>
              <ChevronRight className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-slate-600 w-4 h-4 rotate-90" />
            </div>
          </div>
        </div>
      )}

      <div className="mt-16 flex flex-col-reverse md:flex-row justify-between gap-6 border-t border-white/5 pt-10">
        <button
          onClick={() => navigate('/cart')}
          className="flex items-center justify-center text-slate-500 py-4 px-8 rounded-2xl font-black uppercase tracking-widest text-xs hover:text-white transition-colors"
        >
          <ArrowLeft className="mr-3 w-4 h-4" /> REVISE INVENTORY
        </button>
        <button
          onClick={() => setStep(2)}
          disabled={!shippingInfo.address || !shippingInfo.city || !shippingInfo.state || !shippingInfo.zipCode || loading}
          className="group flex items-center justify-center bg-[#a3e635] text-black py-5 px-12 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-[#a3e635]/10 hover:bg-[#b4f04a] transition-all disabled:opacity-30"
        >
          {loading ? 'PROCESSING PROTOCOL...' : 'SECURE PAYMENT'}<ChevronRight className="ml-3 w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {step !== 3 && (
          <div className="text-center mb-20 animate-fade-in">
            <div className="inline-flex items-center space-x-2 text-[#a3e635] mb-6">
              <ShieldCheck className="h-4 w-4" />
              <span className="text-xs font-black uppercase tracking-widest">Authorized Acquisition Unit</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-normal font-black text-white mb-6 tracking-tighter uppercase leading-none">Checkout Protocol</h1>
            <div className="w-20 h-1.5 bg-[#a3e635] mx-auto rounded-full"></div>
          </div>
        )}
        <div className="transition-all duration-500 ease-in-out">
          {step === 1 && renderShippingForm()}
          {step === 2 && orderSummary && (
            <PaymentPage
              onNext={handlePlaceOrder}
              onBack={() => setStep(1)}
              totalAmount={orderSummary.total}
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
