import { useState } from 'react';
import { Gift, Plus, Copy, Check, DollarSign, Calendar, CreditCard } from 'lucide-react';

interface GiftCard {
    id: string;
    code: string;
    balance: number;
    originalAmount: number;
    expiryDate: string;
    isActive: boolean;
}

const GiftCardsPage = () => {
    const [giftCards] = useState<GiftCard[]>([
        {
            id: '1',
            code: 'GIFT-2024-ABCD1234',
            balance: 50.00,
            originalAmount: 100.00,
            expiryDate: '2024-12-31',
            isActive: true
        }
    ]);

    const [copiedCode, setCopiedCode] = useState<string | null>(null);
    const [, setShowAddForm] = useState(false);

    const handleCopyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/30 py-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-12 animate-fade-in flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-3">Gift Cards</h1>
                        <p className="text-lg text-gray-500">Manage and redeem your gift cards</p>
                    </div>
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-bold shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 hover:-translate-y-0.5 transition-all duration-300"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Redeem Card
                    </button>
                </div>

                {/* Gift Cards Grid */}
                {giftCards.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {giftCards.map((card) => (
                            <div key={card.id} className="soft-card p-6 relative overflow-hidden group hover:shadow-xl transition-all duration-300 animate-fade-in">
                                {/* Background Decoration */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>

                                {/* Card Icon */}
                                <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-3 rounded-2xl w-fit mb-4 relative z-10">
                                    <Gift className="w-8 h-8 text-white" />
                                </div>

                                {/* Balance */}
                                <div className="mb-4 relative z-10">
                                    <p className="text-sm text-gray-500 font-medium mb-1">Current Balance</p>
                                    <p className="text-3xl font-extrabold text-gray-900">${card.balance.toFixed(2)}</p>
                                    <p className="text-xs text-gray-400 mt-1">of ${card.originalAmount.toFixed(2)}</p>
                                </div>

                                {/* Progress Bar */}
                                <div className="mb-4 relative z-10">
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${(card.balance / card.originalAmount) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Card Code */}
                                <div className="mb-4 relative z-10">
                                    <div className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
                                        <code className="text-sm font-mono font-bold text-gray-700">{card.code}</code>
                                        <button
                                            onClick={() => handleCopyCode(card.code)}
                                            className="p-2 hover:bg-white rounded-lg transition-colors"
                                        >
                                            {copiedCode === card.code ? (
                                                <Check className="w-4 h-4 text-green-600" />
                                            ) : (
                                                <Copy className="w-4 h-4 text-gray-600" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Expiry Date */}
                                <div className="flex items-center text-sm text-gray-500 relative z-10">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    Expires: {new Date(card.expiryDate).toLocaleDateString()}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="soft-card p-12 text-center mb-8">
                        <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-6">
                            <Gift className="w-12 h-12 text-blue-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">No Gift Cards Yet</h3>
                        <p className="text-gray-600 mb-8">Redeem a gift card to start saving on your purchases!</p>
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-8 rounded-xl font-bold shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 hover:-translate-y-0.5 transition-all duration-300"
                        >
                            <Plus className="w-5 h-5 inline mr-2" />
                            Redeem Gift Card
                        </button>
                    </div>
                )}

                {/* Purchase Gift Card Section */}
                <div className="soft-card p-8 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-100">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="bg-blue-600 p-2 rounded-xl">
                                    <CreditCard className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">Purchase a Gift Card</h3>
                            </div>
                            <p className="text-gray-600">Give the gift of health and fitness to your loved ones!</p>
                        </div>
                        <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-8 rounded-xl font-bold shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 hover:-translate-y-0.5 transition-all duration-300 whitespace-nowrap">
                            <DollarSign className="w-5 h-5 inline mr-2" />
                            Buy Gift Card
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GiftCardsPage;
