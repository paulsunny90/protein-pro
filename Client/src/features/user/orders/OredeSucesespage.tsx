import React from 'react';
import { CheckCircle, Truck, Calendar, ArrowRight, ShoppingBag, Zap } from 'lucide-react';

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
    const today = new Date();
    const deliveryStart = new Date(today);
    deliveryStart.setDate(today.getDate() + 3);
    const deliveryEnd = new Date(today);
    deliveryEnd.setDate(today.getDate() + 5);

    return (
        <div className="max-w-4xl mx-auto soft-card p-6 xs:p-8 sm:p-12 md:p-20 text-center animate-fade-in relative">
            {/* Top accent line */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-[#a3e635]"></div>

            <div className="mx-auto w-20 h-20 sm:w-28 sm:h-28 bg-[#a3e635]/10 rounded-full flex items-center justify-center mb-8 sm:mb-12 border-4 border-[#a3e635]/20 animate-pulse">
                <CheckCircle className="h-10 w-10 sm:h-14 sm:h-14 text-[#a3e635]" strokeWidth={2.5} />
            </div>

            <h2 className="text-4xl sm:text-6xl md:text-7xl font-black text-white mb-6 tracking-tighter uppercase italic italic">
                MISSION <span className="text-[#a3e635]">SUCCESS</span>
            </h2>
            <p className="text-base sm:text-lg text-slate-400 mb-10 sm:mb-16 max-w-md mx-auto font-medium leading-relaxed">
                Your performance gear has been authorized and is now entering the preparation protocol.
            </p>

            {/* Order Info Card - Tactical Style */}
            <div className="glass-dark rounded-[2rem] p-6 sm:p-10 mb-10 sm:mb-16 text-left relative overflow-hidden group border border-white/5">
                <div className="absolute -top-10 -right-10 p-8 opacity-5 group-hover:opacity-20 transition-all duration-700 pointer-events-none rotate-12">
                    <Zap className="w-40 h-40 sm:w-64 sm:h-64 text-[#a3e635]" />
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8 sm:mb-12 border-b border-white/5 pb-8 sm:pb-12">
                    <div>
                        <p className="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 sm:mb-2">DEPLOYMENT ID</p>
                        <p className="text-xl sm:text-3xl font-black text-white tracking-widest">#{orderId}</p>
                    </div>
                    <div className="text-left sm:text-right">
                        <p className="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 sm:mb-2">TOTAL AUTHORIZED</p>
                        <p className="text-3xl sm:text-5xl font-black text-[#a3e635]">₹{orderSummary?.total || "0"}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
                    <div className="bg-white/5 rounded-2xl p-5 sm:p-6 flex items-start border border-white/5 hover:border-white/10 transition-colors">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#a3e635] rounded-xl flex items-center justify-center text-black mr-4 sm:offset-5 shrink-0">
                            <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                        <div>
                            <h4 className="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">ARRIVAL WINDOW</h4>
                            <p className="text-sm sm:text-base text-white font-black">{deliveryStart.toLocaleDateString()} — {deliveryEnd.toLocaleDateString()}</p>
                            <p className="text-[9px] sm:text-[10px] text-[#a3e635] font-black uppercase tracking-widest mt-1">EOD Priority</p>
                        </div>
                    </div>

                    <div className="bg-white/5 rounded-2xl p-5 sm:p-6 flex items-start border border-white/5 hover:border-white/10 transition-colors">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 rounded-xl flex items-center justify-center text-white mr-4 sm:offset-5 shrink-0">
                            <Truck className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                        <div>
                            <h4 className="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">LOGISTICS CLASS</h4>
                            <p className="text-sm sm:text-base text-white font-black">STANDARD DEPLOYMENT</p>
                            <p className="text-[9px] sm:text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">3–5 TRADING DAYS</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <button
                    onClick={onContinueShopping}
                    className="flex-1 bg-[#a3e635] text-black py-4 sm:py-6 px-8 rounded-2xl font-black uppercase tracking-widest text-xs sm:text-sm hover:bg-[#b4f04a] transition-all shadow-xl shadow-[#a3e635]/10 flex items-center justify-center group active:scale-95"
                >
                    <ShoppingBag className="w-5 h-5 mr-3 group-hover:animate-bounce" />
                    ACQUIRE MORE
                </button>
                <button
                    onClick={onViewDashboard}
                    className="flex-1 bg-white/5 border border-white/10 text-white py-4 sm:py-6 px-8 rounded-2xl font-black uppercase tracking-widest text-xs sm:text-sm hover:bg-white/10 transition-all flex items-center justify-center group active:scale-95"
                >
                    MISSION CONTROL
                    <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            <p className="mt-12 sm:mt-16 text-[9px] sm:text-[10px] font-black text-slate-600 uppercase tracking-widest">
                Encountering interference? <a href="/contact" className="text-[#a3e635] hover:underline">Contact Signal Command</a>
            </p>
        </div>
    );
};

export default OrderSuccessPage;
