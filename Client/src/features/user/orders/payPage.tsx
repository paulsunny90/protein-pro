import React from 'react';
import { CheckCircle, ArrowLeft, ShieldCheck, Zap } from 'lucide-react';
import { PayPalButtons } from "@paypal/react-paypal-js";

interface PaymentPageProps {
    onNext: (details?: any) => void;
    onBack: () => void;
    totalAmount: string;
}

const PaymentPage: React.FC<PaymentPageProps> = ({
    onNext,
    onBack,
    totalAmount
}) => {
    const handlePayPalSuccess = (details: any) => {
        onNext(details);
    };

    return (
        <div className="bg-[#0d0d0d] rounded-[3rem] p-8 lg:p-12 shadow-2xl animate-fade-in max-w-4xl mx-auto border border-white/5">
            <div className="flex items-center justify-between mb-10">
                <h2 className="text-2xl font-normal font-black text-white tracking-tight uppercase">Payment Protocol</h2>
                <span className="text-[10px] font-black text-[#a3e635] uppercase tracking-widest bg-[#a3e635]/10 px-4 py-2 rounded-full border border-[#a3e635]/20">Stage 02/02</span>
            </div>

            {/* PayPal Option Display */}
            <div className="mb-10">
                <div className="relative overflow-hidden border border-[#a3e635]/50 bg-[#a3e635]/5 shadow-lg shadow-[#a3e635]/5 rounded-[2rem] p-8">
                    <div className="absolute -right-4 -top-4 w-12 h-12 bg-[#a3e635] rounded-full flex items-end justify-start p-3">
                        <CheckCircle className="w-5 h-5 text-black" />
                    </div>
                    <div className="flex items-center">
                        <div className="w-14 h-14 rounded-2xl mr-6 bg-[#a3e635] text-black flex items-center justify-center">
                            <Zap className="w-8 h-8 font-black" />
                        </div>
                        <div>
                            <h3 className="font-black text-white text-xl uppercase tracking-tight">PayPal Express</h3>
                            <p className="text-xs text-slate-500 mt-1 font-black uppercase tracking-widest">Global Encrypted Gateway</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* PayPal Payment Integration Area */}
            <div className="animate-fade-in bg-black p-10 rounded-[2.5rem] border border-white/5 flex flex-col items-center justify-center text-center">
                <div className="mb-8 w-full max-w-md">
                    <PayPalButtons
                        key={totalAmount}
                        style={{
                            layout: "vertical",
                            color: "blue",
                            shape: "rect",
                            label: "pay"
                        }}
                        createOrder={(_, actions) => {
                            return actions.order.create({
                                intent: "CAPTURE",
                                purchase_units: [
                                    {
                                        amount: {
                                            currency_code: "INR",
                                            value: totalAmount,
                                        },
                                    },
                                ],
                            });
                        }}
                        onApprove={async (_, actions) => {
                            if (actions.order) {
                                const details = await actions.order.capture();
                                handlePayPalSuccess(details);
                            }
                        }}
                    />
                </div>
                <div className="flex items-center text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
                    <ShieldCheck className="w-4 h-4 mr-3 text-[#a3e635]" />
                    AUTHORIZED TRANSACTION ENVIRONMENT
                </div>
            </div>

            <div className="mt-12 flex flex-col-reverse md:flex-row justify-between gap-6 pt-10 border-t border-white/5">
                <button
                    onClick={onBack}
                    className="flex items-center justify-center text-slate-500 py-4 px-8 rounded-2xl font-black uppercase tracking-widest text-xs hover:text-white transition-colors"
                >
                    <ArrowLeft className="mr-3 w-4 h-4" />
                    RECOORD PROTOCOL
                </button>
                <div className="text-right">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Authorization</p>
                    <p className="text-3xl font-black text-[#a3e635] tracking-tighter">₹{totalAmount}</p>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
