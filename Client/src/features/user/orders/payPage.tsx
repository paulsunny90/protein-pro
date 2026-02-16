import React from 'react';
import { CheckCircle, ArrowLeft } from 'lucide-react';
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
        <div className="soft-card p-8 animate-fade-in max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Payment Method</h2>
                <span className="text-sm text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-full">Step 2 of 2</span>
            </div>

            {/* PayPal Option Only */}
            <div className="mb-8">
                <div className="relative overflow-hidden border-2 border-blue-500 bg-blue-50/50 shadow-md rounded-2xl p-6">
                    <div className="absolute -right-4 -top-4 w-12 h-12 bg-blue-500 rounded-full flex items-end justify-start p-2">
                        <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex items-center">
                        <div className="p-3 rounded-xl mr-4 bg-blue-100 text-blue-600">
                            <span className="font-black text-lg">P</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">PayPal</h3>
                            <p className="text-sm text-gray-500 mt-0.5">Quick & Secure Checkout</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* PayPal Payment */}
            <div className="animate-fade-in bg-white p-8 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
                <div className="mb-6">
                    <PayPalButtons
                        key={totalAmount}
                        style={{ layout: "vertical" }}
                        createOrder={(_, actions) => {
                            console.log("Creating PayPal order with amount:", totalAmount);
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
                <p className="text-sm text-gray-500">You will be redirected to PayPal's secure site to complete your payment.</p>
            </div>

            <div className="mt-10 flex flex-col-reverse md:flex-row justify-between gap-4">
                <button
                    onClick={onBack}
                    className="flex items-center justify-center text-gray-600 py-3 px-6 rounded-xl font-semibold hover:bg-gray-100 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeft className="mr-2 w-5 h-5" />
                    Back to Shipping
                </button>
            </div>
        </div>
    );
};

export default PaymentPage;
