import React from 'react';
import { CreditCard, CheckCircle, ArrowLeft, ShieldCheck } from 'lucide-react';

interface PaymentPageProps {
    paymentMethod: string;
    setPaymentMethod: (method: string) => void;
    onNext: () => void;
    onBack: () => void;
    loading?: boolean;
}

const PaymentPage: React.FC<PaymentPageProps> = ({
    paymentMethod,
    setPaymentMethod,
    onNext,
    onBack,
    loading = false
}) => {
    return (
        <div className="soft-card p-8 animate-fade-in max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Payment Method</h2>
                <span className="text-sm text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-full">Step 2 of 2</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div
                    className={`relative overflow-hidden border-2 rounded-2xl p-5 cursor-pointer transition-all duration-300 ${paymentMethod === 'credit-card'
                            ? 'border-blue-500 bg-blue-50/50 shadow-md transform scale-[1.02]'
                            : 'border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50'
                        }`}
                    onClick={() => setPaymentMethod('credit-card')}
                >
                    {paymentMethod === 'credit-card' && (
                        <div className="absolute -right-4 -top-4 w-12 h-12 bg-blue-500 rounded-full flex items-end justify-start p-2">
                            <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                    )}
                    <div className="flex items-center">
                        <div className={`p-3 rounded-xl mr-4 ${paymentMethod === 'credit-card' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                            <CreditCard className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">Credit Card</h3>
                            <p className="text-sm text-gray-500 mt-0.5">Visa, Mastercard, Amex</p>
                        </div>
                    </div>
                </div>

                <div
                    className={`relative overflow-hidden border-2 rounded-2xl p-5 cursor-pointer transition-all duration-300 ${paymentMethod === 'paypal'
                            ? 'border-blue-500 bg-blue-50/50 shadow-md transform scale-[1.02]'
                            : 'border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50'
                        }`}
                    onClick={() => setPaymentMethod('paypal')}
                >
                    {paymentMethod === 'paypal' && (
                        <div className="absolute -right-4 -top-4 w-12 h-12 bg-blue-500 rounded-full flex items-end justify-start p-2">
                            <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                    )}
                    <div className="flex items-center">
                        <div className={`p-3 rounded-xl mr-4 ${paymentMethod === 'paypal' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                            <span className="font-black text-lg">P</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">PayPal</h3>
                            <p className="text-sm text-gray-500 mt-0.5">Quick & Secure Checkhout</p>
                        </div>
                    </div>
                </div>
            </div>

            {paymentMethod === 'credit-card' && (
                <div className="space-y-6 animate-fade-in bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">Card Details</h3>
                        <div className="flex space-x-2">
                            <div className="w-10 h-6 bg-white border border-gray-200 rounded flex items-center justify-center text-xs font-bold text-gray-600">VISA</div>
                            <div className="w-10 h-6 bg-white border border-gray-200 rounded flex items-center justify-center text-xs font-bold text-gray-600">MC</div>
                        </div>
                    </div>

                    <div className="relative">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Card Number</label>
                        <input
                            type="text"
                            placeholder="0000 0000 0000 0000"
                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-mono text-lg"
                        />
                        <CreditCard className="absolute right-4 top-9 text-gray-400 w-5 h-5" />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Expiration</label>
                            <input
                                type="text"
                                placeholder="MM/YY"
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-mono text-lg text-center"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">CVV / CVC</label>
                            <input
                                type="text"
                                placeholder="123"
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-mono text-lg text-center"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Cardholder Name</label>
                        <input
                            type="text"
                            placeholder="John Doe"
                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none uppercase"
                        />
                    </div>
                </div>
            )}

            <div className="mt-10 flex flex-col-reverse md:flex-row justify-between gap-4">
                <button
                    onClick={onBack}
                    className="flex items-center justify-center text-gray-600 py-3 px-6 rounded-xl font-semibold hover:bg-gray-100 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeft className="mr-2 w-5 h-5" />
                    Back to Shipping
                </button>
                <button
                    onClick={onNext}
                    disabled={loading}
                    className="group flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-10 rounded-xl font-bold shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                            Processing...
                        </>
                    ) : (
                        <>
                            Place Order
                            <ShieldCheck className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default PaymentPage;
