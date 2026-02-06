import React, { useState, useEffect } from 'react';
import { CreditCard, MapPin, Phone, Mail, User, Building2, CheckCircle } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

const OrderPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Review, 4: Confirmation
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

  // Get order details from location state (passed from product page or cart)
  useEffect(() => {
    if (location.state) {
      const { product, quantity, size } = location.state;
      if (product) {
        setOrderSummary({
          items: [{
            ...product,
            quantity: quantity || 1,
            size: size || 'Medium'
          }],
          subtotal: (product.price * (quantity || 1)).toFixed(2),
          shipping: 0,
          tax: ((product.price * (quantity || 1)) * 0.08).toFixed(2),
          total: ((product.price * (quantity || 1)) * 1.08).toFixed(2)
        });
      }
    } else {
      // If no product passed, redirect to cart
      navigate('/cart');
    }
  }, [location.state, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePlaceOrder = () => {
    // In a real app, this would send the order to the backend
    console.log('Placing order:', { shippingInfo, paymentMethod, orderSummary });
    
    // Move to confirmation step
    setStep(4);
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-between mb-8">
      {[1, 2, 3].map((num) => (
        <div key={num} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= num ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}
          >
            {step > num ? <CheckCircle className="w-5 h-5" /> : num}
          </div>
          {num < 3 && (
            <div
              className={`w-16 h-1 ${
                step > num ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            ></div>
          )}
        </div>
      ))}
    </div>
  );

  const renderShippingForm = () => (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Information</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              name="firstName"
              value={shippingInfo.firstName}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="John"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              name="lastName"
              value={shippingInfo.lastName}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Doe"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="email"
              name="email"
              value={shippingInfo.email}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="john@example.com"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="tel"
              name="phone"
              value={shippingInfo.phone}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="(123) 456-7890"
            />
          </div>
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              name="address"
              value={shippingInfo.address}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="123 Main St"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City
          </label>
          <div className="relative">
            <Building2 className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              name="city"
              value={shippingInfo.city}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="New York"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            State
          </label>
          <div className="relative">
            <Building2 className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              name="state"
              value={shippingInfo.state}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="NY"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ZIP Code
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              name="zipCode"
              value={shippingInfo.zipCode}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="10001"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Country
          </label>
          <select
            name="country"
            value={shippingInfo.country}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option>United States</option>
            <option>Canada</option>
            <option>United Kingdom</option>
            <option>Australia</option>
            <option>Germany</option>
          </select>
        </div>
      </div>
      
      <div className="mt-8 flex justify-end">
        <button
          onClick={() => setStep(2)}
          disabled={!shippingInfo.address || !shippingInfo.city || !shippingInfo.state || !shippingInfo.zipCode}
          className="bg-blue-600 text-white py-3 px-8 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );

  const renderPaymentForm = () => (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Method</h2>
      
      <div className="space-y-4 mb-8">
        <div 
          className={`border-2 rounded-lg p-4 cursor-pointer ${
            paymentMethod === 'credit-card' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
          }`}
          onClick={() => setPaymentMethod('credit-card')}
        >
          <div className="flex items-center">
            <div className="mr-4">
              <CreditCard className="h-6 w-6 text-gray-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Credit Card</h3>
              <p className="text-sm text-gray-600">Pay with Visa, Mastercard, or American Express</p>
            </div>
          </div>
        </div>
        
        <div 
          className={`border-2 rounded-lg p-4 cursor-pointer ${
            paymentMethod === 'paypal' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
          }`}
          onClick={() => setPaymentMethod('paypal')}
        >
          <div className="flex items-center">
            <div className="mr-4">
              <div className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">PP</div>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">PayPal</h3>
              <p className="text-sm text-gray-600">Pay with your PayPal account</p>
            </div>
          </div>
        </div>
      </div>
      
      {paymentMethod === 'credit-card' && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Card Number
            </label>
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expiration Date
              </label>
              <input
                type="text"
                placeholder="MM/YY"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CVV
              </label>
              <input
                type="text"
                placeholder="123"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cardholder Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      )}
      
      <div className="mt-8 flex justify-between">
        <button
          onClick={() => setStep(1)}
          className="text-gray-600 py-3 px-6 rounded-lg font-medium hover:bg-gray-100 transition-colors"
        >
          Back to Shipping
        </button>
        <button
          onClick={() => setStep(3)}
          className="bg-blue-600 text-white py-3 px-8 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Review Order
        </button>
      </div>
    </div>
  );

  const renderReviewOrder = () => (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Review Your Order</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping Address</h3>
            <p className="text-gray-700">{`${shippingInfo.firstName} ${shippingInfo.lastName}`}</p>
            <p className="text-gray-700">{shippingInfo.address}</p>
            <p className="text-gray-700">{`${shippingInfo.city}, ${shippingInfo.state} ${shippingInfo.zipCode}`}</p>
            <p className="text-gray-700">{shippingInfo.country}</p>
            <p className="text-gray-700 mt-2">{shippingInfo.phone}</p>
            <p className="text-gray-700">{shippingInfo.email}</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h3>
            <p className="text-gray-700 capitalize">{paymentMethod.replace('-', ' ')}</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Items</h3>
            {orderSummary?.items.map((item: any, index: number) => (
              <div key={index} className="flex items-center py-4 border-b border-gray-200 last:border-b-0">
                <img 
                  src={item.images?.[0] || 'https://via.placeholder.com/80x80'} 
                  alt={item.name} 
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="ml-4 flex-1">
                  <h4 className="font-medium text-gray-900">{item.name}</h4>
                  <p className="text-gray-600">Size: {item.size}</p>
                  <p className="text-gray-600">Qty: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-6 h-fit">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-gray-900">${orderSummary?.subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="text-gray-900">${orderSummary?.shipping}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax</span>
              <span className="text-gray-900">${orderSummary?.tax}</span>
            </div>
            <div className="border-t border-gray-200 pt-3 flex justify-between font-bold">
              <span>Total</span>
              <span>${orderSummary?.total}</span>
            </div>
          </div>
          
          <button
            onClick={handlePlaceOrder}
            className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
          >
            Place Order
          </button>
        </div>
      </div>
      
      <div className="mt-8 flex justify-between">
        <button
          onClick={() => setStep(2)}
          className="text-gray-600 py-3 px-6 rounded-lg font-medium hover:bg-gray-100 transition-colors"
        >
          Back to Payment
        </button>
      </div>
    </div>
  );

  const renderConfirmation = () => (
    <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
      <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
        <CheckCircle className="h-8 w-8 text-green-600" />
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Confirmed!</h2>
      <p className="text-gray-600 mb-8">
        Thank you for your purchase. Your order has been placed successfully.
      </p>
      
      <div className="bg-gray-50 rounded-lg p-6 max-w-md mx-auto mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Order Details</h3>
        <p className="text-gray-600">Order #12345</p>
        <p className="text-gray-600">Total: ${orderSummary?.total}</p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => navigate('/')}
          className="bg-blue-600 text-white py-3 px-8 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Continue Shopping
        </button>
        <button
          onClick={() => navigate('/dashboard')}
          className="border border-gray-300 text-gray-700 py-3 px-8 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          View Dashboard
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">Complete your purchase securely</p>
        </div>
        
        {renderStepIndicator()}
        
        {step === 1 && renderShippingForm()}
        {step === 2 && renderPaymentForm()}
        {step === 3 && renderReviewOrder()}
        {step === 4 && renderConfirmation()}
      </div>
    </div>
  );
};

export default OrderPage;