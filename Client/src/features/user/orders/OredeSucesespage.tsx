import React from 'react';
import { CheckCircle, Truck, Calendar, Clock, ArrowRight, ShoppingBag } from 'lucide-react';

interface OrderSuccessPageProps {
    orderSummary: any;
    orderId?: string;
    onContinueShopping: () => void;
    onViewDashboard: () => void;
}

const OrderSuccessPage: React.FC<OrderSuccessPageProps> = ({
    orderSummary,
    orderId = "12345",
    onContinueShopping,
    onViewDashboard
}) => {
    // Calculate estimated delivery date based on today + 3-5 days
    const today = new Date();
    const deliveryStart = new Date(today);
    deliveryStart.setDate(today.getDate() + 3);
    const deliveryEnd = new Date(today);
    deliveryEnd.setDate(today.getDate() + 5);

    return (
        <div className="max-w-2xl mx-auto soft-card p-8 md:p-12 text-center animate-fade-in relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-emerald-500"></div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-green-50 rounded-full blur-3xl -z-10"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-50 rounded-full blur-3xl -z-10"></div>

            <div className="mx-auto w-24 h-24 bg-green-100/80 rounded-full flex items-center justify-center mb-8 animate-pulse-soft shadow-[0_0_0_8px_rgba(220,252,231,0.6)]">
                <CheckCircle className="h-12 w-12 text-green-600" strokeWidth={2.5} />
            </div>

            <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Order Confirmed!</h2>
            <p className="text-lg text-gray-600 mb-10 max-w-md mx-auto leading-relaxed">
                Thank you for your purchase. We have received your order and will begin processing it right away.
            </p>

            {/* Order Info Card */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-8 text-left shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Truck className="w-24 h-24 text-blue-600" />
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-gray-100 pb-6">
                    <div>
                        <p className="text-sm text-gray-500 font-medium mb-1">Order Number</p>
                        <p className="text-xl font-mono font-bold text-gray-900">#{orderId}</p>
                    </div>
                    <div className="mt-4 md:mt-0 text-left md:text-right">
                        <p className="text-sm text-gray-500 font-medium mb-1">Total Amount</p>
                        <p className="text-2xl font-bold text-blue-600">${orderSummary?.total || "0.00"}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-xl p-4 flex items-start">
                        <div className="bg-white p-2 rounded-lg shadow-sm text-blue-600 mr-4">
                            <Calendar className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-gray-900 mb-1">Estimated Delivery</h4>
                            <p className="text-sm text-gray-600">{deliveryStart.toLocaleDateString()} - {deliveryEnd.toLocaleDateString()}</p>
                            <p className="text-xs text-gray-400 mt-1">By end of day</p>
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4 flex items-start">
                        <div className="bg-white p-2 rounded-lg shadow-sm text-blue-600 mr-4">
                            <Clock className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-gray-900 mb-1">Shipping Speed</h4>
                            <p className="text-sm text-gray-600">Standard Shipping</p>
                            <p className="text-xs text-gray-400 mt-1">3-5 Business Days</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                    onClick={onContinueShopping}
                    className="group flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-8 rounded-xl font-bold shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 hover:-translate-y-1 transition-all duration-300"
                >
                    <ShoppingBag className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                    Continue Shopping
                </button>
                <button
                    onClick={onViewDashboard}
                    className="group flex items-center justify-center bg-white border-2 border-gray-200 text-gray-700 py-4 px-8 rounded-xl font-bold hover:bg-gray-50 hover:border-gray-300 transition-all duration-300"
                >
                    View Dashboard
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            <p className="mt-8 text-sm text-gray-400">
                Need help? <a href="/contact" className="text-blue-600 hover:underline">Contact Support</a>
            </p>
        </div>
    );
};

export default OrderSuccessPage;
