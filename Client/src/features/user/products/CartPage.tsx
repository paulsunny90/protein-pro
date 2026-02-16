import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchCart, updateCartItem, removeFromCart } from '../../../store/slice/cartSlice';
import { ShoppingCart, Plus, Minus, Trash2, ArrowRight, Package, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const CartPage = () => {
  const dispatch = useAppDispatch();
  const { items: cartItems } = useAppSelector((state: any) => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const updateQuantity = (productId: string, newQuantity: number, size: string) => {
    if (newQuantity < 1) return;
    dispatch(updateCartItem({ productId, quantity: newQuantity, size }));
  };

  const removeItem = (productId: string) => {
    dispatch(removeFromCart(productId));
  };

  const subtotal = cartItems.reduce(
    (sum: number, item: any) => sum + (item.product?.price || 0) * item.quantity,
    0
  );
  const shipping = subtotal > 0 ? (subtotal > 500 ? 0 : 50) : 0;
  const tax = subtotal * 0.18; // GST
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Header Section */}
        <div className="text-center mb-12 sm:mb-20 animate-fade-in">
          <div className="inline-flex items-center space-x-2 text-[#a3e635] mb-4 sm:mb-6">
            <ShoppingCart className="h-4 w-4" />
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest">Secure Checkout System</span>
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white mb-6 tracking-tighter uppercase leading-[0.9]">
            YOUR <span className="text-[#a3e635]">TACTICAL</span> GEAR
          </h1>
          <div className="w-16 sm:w-20 h-1.5 bg-[#a3e635] mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <div className="bg-[#0d0d0d] rounded-[2rem] sm:rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
              {cartItems.length === 0 ? (
                <div className="p-12 sm:p-24 text-center">
                  <Package className="mx-auto h-16 w-16 sm:h-20 sm:w-20 text-[#a3e635]/10 mb-6 sm:mb-8" />
                  <h3 className="text-2xl sm:text-3xl font-black text-white mb-4 uppercase tracking-tighter">Inventory Empty</h3>
                  <p className="text-sm sm:text-base text-slate-500 mb-8 sm:mb-10 font-medium">Ready to load up on premium performance fuel?</p>
                  <Link
                    to="/products"
                    className="inline-flex items-center bg-[#a3e635] text-black px-8 py-4 rounded-xl sm:rounded-2xl font-black uppercase tracking-widest text-[10px] sm:text-xs hover:bg-[#b4f04a] transition-all active:scale-95 shadow-lg shadow-[#a3e635]/10"
                  >
                    DEPLOY COLLECTION
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {cartItems.map((item: any) => (
                    <div key={item._id} className="p-5 sm:p-8 group hover:bg-white/[0.02] transition-colors flex flex-row sm:flex-row gap-4 sm:gap-8 items-start sm:items-center">
                      <div className="flex-shrink-0 bg-black border border-white/5 rounded-xl sm:rounded-2xl p-1.5 w-20 h-20 sm:w-28 sm:h-28 overflow-hidden">
                        <img
                          src={item.product?.image || 'placeholder.jpg'}
                          alt={item.product?.name}
                          className="w-full h-full object-cover rounded-lg sm:rounded-xl"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col gap-3">
                          <div className="flex justify-between items-start gap-2">
                            <h3 className="text-base sm:text-xl font-black text-white leading-tight uppercase truncate">{item.product?.name}</h3>
                            <button
                              onClick={() => removeItem(item.product?._id)}
                              className="text-slate-600 hover:text-rose-500 transition-all p-1"
                            >
                              <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                            </button>
                          </div>

                          <div className="flex items-center space-x-3 mb-2">
                            <span className="text-[8px] sm:text-[10px] font-black text-[#a3e635] uppercase tracking-widest bg-[#a3e635]/10 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">SIZE: {item.size}</span>
                            <span className="text-[8px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest">STOCK: OK</span>
                          </div>

                          <div className="flex items-center justify-between mt-auto">
                            <div className="flex items-center bg-black border border-white/10 rounded-lg sm:rounded-xl overflow-hidden scale-90 sm:scale-100 origin-left">
                              <button
                                onClick={() => updateQuantity(item.product?._id, item.quantity - 1, item.size)}
                                className="p-2 sm:p-3 text-slate-500 hover:text-[#a3e635] hover:bg-white/5 transition-colors"
                              >
                                <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                              </button>
                              <span className="px-3 sm:px-5 text-white font-black text-xs sm:text-sm">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.product?._id, item.quantity + 1, item.size)}
                                className="p-2 sm:p-3 text-slate-500 hover:text-[#a3e635] hover:bg-white/5 transition-colors"
                              >
                                <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                              </button>
                            </div>
                            <span className="text-xl sm:text-2xl font-black text-white">₹{(item.product?.price * item.quantity).toFixed(0)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Trust badge */}
            <div className="flex items-center justify-center space-x-6 sm:space-x-8 py-4 sm:py-6 opacity-30">
              <div className="flex items-center text-white text-[8px] sm:text-[10px] font-black tracking-widest">
                <ShieldCheck className="w-3 h-3 mr-2" /> ENCRYPTED TRANSIT
              </div>
              <div className="flex items-center text-white text-[8px] sm:text-[10px] font-black tracking-widest">
                <Trash2 className="w-3 h-3 mr-2" /> CLEAN PROTOCOL
              </div>
            </div>
          </div>

          {/* Order Summary Module */}
          <div className="lg:col-span-1">
            <div className="bg-[#0d0d0d] rounded-[2rem] sm:rounded-[2.5rem] border border-white/5 p-6 sm:p-10 sticky top-32 shadow-2xl">
              <h2 className="text-xl sm:text-2xl font-black text-white mb-8 sm:mb-10 tracking-tight uppercase">Order Protocol</h2>

              <div className="space-y-4 sm:space-y-6">
                <div className="flex justify-between items-center bg-white/5 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-white/5">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Subtotal</span>
                  <span className="text-lg sm:text-xl font-black text-white">₹{subtotal.toFixed(0)}</span>
                </div>

                <div className="flex justify-between items-center px-4">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Logistics</span>
                  <span className={`text-[10px] sm:text-sm font-black ${shipping === 0 ? 'text-[#a3e635]' : 'text-white'}`}>
                    {shipping === 0 ? 'FREE DEPLOYMENT' : `₹${shipping.toFixed(0)}`}
                  </span>
                </div>

                <div className="flex justify-between items-center px-4">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Gov Tax (GST)</span>
                  <span className="text-[10px] sm:text-sm font-black text-white">₹{tax.toFixed(0)}</span>
                </div>

                <div className="h-px bg-white/5 my-6 sm:my-8 text-black"></div>

                <div className="flex justify-between items-center px-4">
                  <span className="text-base sm:text-lg font-black text-white uppercase tracking-tighter">Mission Total</span>
                  <span className="text-3xl sm:text-4xl font-black text-[#a3e635]">₹{total.toFixed(0)}</span>
                </div>
              </div>

              <Link
                to="/order"
                className="mt-8 sm:mt-12 w-full bg-[#a3e635] text-black py-5 sm:py-6 rounded-xl sm:rounded-2xl font-black text-base sm:text-lg hover:bg-[#b4f04a] transition-all active:scale-95 shadow-xl shadow-[#a3e635]/10 flex items-center justify-center uppercase tracking-widest group"
              >
                AUTHORIZE CHECKOUT
                <ArrowRight className="ml-2 sm:ml-3 h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                to="/products"
                className="mt-4 sm:mt-6 w-full bg-white/5 text-slate-400 py-4 sm:py-6 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm hover:text-white hover:bg-white/10 transition-all flex items-center justify-center uppercase tracking-widest"
              >
                CONTINUE ACQUISITION
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;