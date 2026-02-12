import { useEffect } from 'react';
import { Package, Truck, CheckCircle, Clock, Eye, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';

const MyOrdersPage = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { orders, loading } = useAppSelector((state: any) => state.order);

    useEffect(() => {
        // Fetch orders when component mounts
        // dispatch(fetchOrders());
    }, [dispatch]);

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'delivered':
                return <CheckCircle className="w-5 h-5 text-green-600" />;
            case 'shipped':
                return <Truck className="w-5 h-5 text-blue-600" />;
            case 'processing':
                return <Clock className="w-5 h-5 text-yellow-600" />;
            default:
                return <Package className="w-5 h-5 text-gray-600" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'delivered':
                return 'bg-green-50 text-green-700 border-green-200';
            case 'shipped':
                return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'processing':
                return 'bg-yellow-50 text-yellow-700 border-yellow-200';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/30 py-16">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-center py-20">
                        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/30 py-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-12 animate-fade-in">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-3">My Orders</h1>
                    <p className="text-lg text-gray-500">Track and manage your orders</p>
                </div>

                {/* Orders List */}
                {orders && orders.length > 0 ? (
                    <div className="space-y-6">
                        {orders.map((order: any) => (
                            <div key={order._id} className="soft-card p-6 hover:shadow-xl transition-all duration-300 animate-fade-in">
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                                    {/* Order Info */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="bg-blue-100 p-2 rounded-xl">
                                                <Package className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900">Order #{order._id?.slice(-8)}</h3>
                                                <p className="text-sm text-gray-500">
                                                    Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Items Preview */}
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {order.items?.slice(0, 3).map((item: any, idx: number) => (
                                                <div key={idx} className="bg-gray-50 px-3 py-1.5 rounded-lg text-sm text-gray-700">
                                                    {item.product?.name || 'Product'} x{item.quantity}
                                                </div>
                                            ))}
                                            {order.items?.length > 3 && (
                                                <div className="bg-gray-100 px-3 py-1.5 rounded-lg text-sm text-gray-600 font-semibold">
                                                    +{order.items.length - 3} more
                                                </div>
                                            )}
                                        </div>

                                        {/* Status and Total */}
                                        <div className="flex flex-wrap items-center gap-4">
                                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${getStatusColor(order.status)}`}>
                                                {getStatusIcon(order.status)}
                                                <span className="text-sm font-bold capitalize">{order.status}</span>
                                            </div>
                                            <div className="text-lg font-bold text-gray-900">
                                                ${order.totalAmount?.toFixed(2)}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <div>
                                        <button
                                            onClick={() => navigate(`/orders/${order._id}`)}
                                            className="group flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-bold shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 hover:-translate-y-0.5 transition-all duration-300"
                                        >
                                            <Eye className="w-5 h-5 mr-2" />
                                            View Details
                                            <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="soft-card p-12 text-center">
                        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                            <Package className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">No Orders Yet</h3>
                        <p className="text-gray-600 mb-8">Start shopping to see your orders here!</p>
                        <button
                            onClick={() => navigate('/products')}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-8 rounded-xl font-bold shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 hover:-translate-y-0.5 transition-all duration-300"
                        >
                            Browse Products
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrdersPage;
