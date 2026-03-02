import { useEffect } from 'react';
import { Package, Truck, CheckCircle, Clock, Eye, ChevronRight, ShoppingBag, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchOrders } from '../../../store/slice/orderSlice';

const MyOrdersPage = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { orders, loading } = useAppSelector((state: any) => state.order);

    useEffect(() => {
        // Fetch orders when component mounts
        dispatch(fetchOrders());
    }, [dispatch]);

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'delivered':
                return <CheckCircle className="w-5 h-5 text-[#a3e635]" />;
            case 'shipped':
                return <Truck className="w-5 h-5 text-blue-400" />;
            case 'processing':
                return <Clock className="w-5 h-5 text-yellow-400" />;
            default:
                return <Package className="w-5 h-5 text-slate-400" />;
        }
    };

    const getStatusStyles = (status: string) => {
        switch (status.toLowerCase()) {
            case 'delivered':
                return 'bg-[#a3e635]/10 text-[#a3e635] border-[#a3e635]/20';
            case 'shipped':
                return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'processing':
                return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
            default:
                return 'bg-white/5 text-slate-400 border-white/10';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-20 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-[#a3e635] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                    <p className="text-slate-400 font-black tracking-widest uppercase">Fetching Orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-20 relative overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#a3e635]/5 rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] -ml-64 -mb-64 pointer-events-none"></div>

            <div className="container-max relative z-10 px-4">
                {/* Header */}
                <div className="mb-16 animate-slide-up">
                    <div className="inline-flex items-center space-x-3 text-[#a3e635] mb-6">
                        <ShoppingBag className="w-4 h-4" />
                        <span className="text-xs font-black uppercase tracking-[0.3em]">Order History</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-4">
                        MY <span className="text-[#a3e635]">ORDERS</span>
                    </h1>
                    <p className="text-xl text-slate-400 font-medium max-w-2xl leading-relaxed">
                        Track your shipments, view detailed receipts, and manage your purchase history in one place.
                    </p>
                </div>

                {/* Orders List */}
                {orders && orders.length > 0 ? (
                    <div className="space-y-8">
                        {orders.map((order: any, index: number) => (
                            <div
                                key={order._id}
                                className="soft-card p-8 group hover:border-[#a3e635]/20 transition-all duration-500 animate-slide-up bg-gradient-to-br from-[#111] to-[#0a0a0a]"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="flex flex-col lg:flex-row lg:items-center gap-10">
                                    {/* Order Visual Identification */}
                                    <div className="flex-1">
                                        <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-[#a3e635]/10 group-hover:border-[#a3e635]/20 transition-all duration-300">
                                                    <Package className="w-7 h-7 text-[#a3e635]" />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-black text-white group-hover:text-[#a3e635] transition-colors">Order #{order._id?.slice(-8).toUpperCase()}</h3>
                                                    <p className="text-sm text-slate-500 font-black uppercase tracking-widest mt-0.5">
                                                        Placed {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric'
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className={`flex items-center gap-3 px-4 py-2 rounded-xl border font-black text-xs uppercase tracking-widest ${getStatusStyles(order.status)}`}>
                                                {getStatusIcon(order.status)}
                                                {order.status}
                                            </div>
                                        </div>

                                        {/* Products Quick View */}
                                        <div className="flex flex-wrap gap-3 mb-8">
                                            {order.items?.map((item: any, idx: number) => (
                                                <div
                                                    key={idx}
                                                    className="bg-white/5 border border-white/5 px-4 py-2.5 rounded-xl text-sm text-slate-300 font-medium flex items-center gap-3 group/item hover:bg-white/10 transition-all"
                                                >
                                                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-black/40 flex-shrink-0 border border-white/5">
                                                        <img
                                                            src={item.product?.image}
                                                            alt={item.product?.name}
                                                            className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500"
                                                            onError={(e) => {
                                                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                                                            }}
                                                        />
                                                    </div>
                                                    <span>{item.product?.name || 'Product'}</span>
                                                    <span className="text-[#a3e635] font-black">x{item.quantity}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Financial Summary */}
                                        <div className="flex items-center gap-6 pt-6 border-t border-white/5">
                                            <div>
                                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Total Amount</p>
                                                <p className="text-3xl font-black text-white">${order.totalAmount?.toFixed(2)}</p>
                                            </div>
                                            <div className="h-10 w-px bg-white/5"></div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Shipping Method</p>
                                                <p className="text-white font-bold">Standard Priority</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Panel */}
                                    <div className="lg:w-72 shrink-0">
                                        <button
                                            onClick={() => navigate(`/orders/${order._id}`)}
                                            className="w-full flex items-center justify-center bg-white text-black py-5 px-8 rounded-2xl font-black text-lg hover:bg-[#a3e635] transition-all active:scale-95 group/btn shadow-2xl"
                                        >
                                            <Eye className="w-5 h-5 mr-3" />
                                            Order Details
                                            <ChevronRight className="w-6 h-6 ml-1 transition-transform group-hover/btn:translate-x-2" />
                                        </button>
                                        <p className="text-center mt-6 text-xs font-black text-slate-600 uppercase tracking-widest">
                                            Issues with order? <span className="text-[#a3e635] hover:underline cursor-pointer">Support</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="soft-card p-24 text-center animate-fade-in relative overflow-hidden bg-gradient-to-br from-[#111] to-[#0a0a0a]">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#a3e635]/5 rounded-full blur-[120px]"></div>
                        <div className="relative z-10">
                            <div className="mx-auto w-24 h-24 bg-white/5 rounded-[2.5rem] flex items-center justify-center mb-10 rotate-12 group-hover:rotate-0 transition-transform duration-500 border border-white/5">
                                <Package className="w-12 h-12 text-[#a3e635]" />
                            </div>
                            <h3 className="text-4xl font-black text-white mb-6 uppercase tracking-tighter">NO ORDERS FOUND</h3>
                            <p className="text-xl text-slate-400 font-medium mb-12 max-w-lg mx-auto leading-relaxed">
                                You haven't placed any orders yet. Explore our premium collection and start your journey today!
                            </p>
                            <button
                                onClick={() => navigate('/products')}
                                className="bg-[#a3e635] text-black py-6 px-12 rounded-[2rem] font-black text-xl shadow-xl shadow-[#a3e635]/20 hover:bg-[#b4f04a] transition-all active:scale-95 flex items-center mx-auto"
                            >
                                START SHOPPING
                                <ArrowRight className="w-6 h-6 ml-3" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrdersPage;
