import { useState } from 'react';
import { Gift, Plus, Copy, Check, DollarSign, Calendar, CreditCard, ArrowRight, Zap } from 'lucide-react';

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
        <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-20 relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] -ml-64 -mt-64 pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#a3e635]/5 rounded-full blur-[120px] -mr-64 -mb-64 pointer-events-none"></div>

            <div className="container-max relative z-10 px-4">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8 animate-slide-up">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center space-x-3 text-[#a3e635] mb-6">
                            <Gift className="w-4 h-4" />
                            <span className="text-xs font-black uppercase tracking-[0.3em]">Member Rewards</span>
                        </div>
                        <h1 className="text-2xl font-normal md:text-4xl font-black text-white tracking-tighter mb-6 leading-none">
                            MY <span className="text-[#a3e635]">GIFT CARDS</span>
                        </h1>
                        <p className="text-xl text-slate-400 font-medium leading-relaxed">
                            Manage your credits, redeem new cards, and share the gift of peak performance.
                        </p>
                    </div>
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="flex items-center justify-center bg-[#a3e635] text-black py-5 px-10 rounded-2xl font-black text-xl shadow-xl shadow-[#a3e635]/20 hover:bg-[#b4f04a] transition-all active:scale-95 group"
                    >
                        <Plus className="w-6 h-6 mr-3 transition-transform group-hover:rotate-90" />
                        Redeem New Card
                    </button>
                </div>

                {/* Gift Cards Grid */}
                {giftCards.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                        {giftCards.map((card, index) => (
                            <div
                                key={card.id}
                                className="soft-card soft-card-hover p-8 relative overflow-hidden group animate-slide-up bg-gradient-to-br from-[#111] to-[#0a0a0a]"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                {/* Holographic Effect Over */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/0 via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

                                <div className="flex justify-between items-start mb-10 relative z-10">
                                    <div className="w-14 h-14 rounded-2xl bg-[#a3e635] flex items-center justify-center text-black shadow-lg shadow-[#a3e635]/20">
                                        <Gift className="w-7 h-7 font-black" />
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#a3e635] bg-[#a3e635]/10 px-3 py-1 rounded-full border border-[#a3e635]/20">
                                            {card.isActive ? 'Active' : 'Expired'}
                                        </span>
                                    </div>
                                </div>

                                {/* Balance Display */}
                                <div className="mb-8 relative z-10">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2 block">Available Balance</label>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-5xl font-black text-white">${card.balance.toFixed(2)}</span>
                                        <span className="text-slate-500 font-bold ml-1">USD</span>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-2 font-medium">Original amount: ${card.originalAmount.toFixed(2)}</p>
                                </div>

                                {/* Modern Progress Bar */}
                                <div className="mb-10 relative z-10">
                                    <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden border border-white/5">
                                        <div
                                            className="bg-gradient-to-r from-[#a3e635] to-emerald-400 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(163,230,53,0.3)]"
                                            style={{ width: `${(card.balance / card.originalAmount) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Code Reducer */}
                                <div className="mb-8 relative z-10">
                                    <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl px-6 py-4 group/code hover:bg-white/[0.08] transition-all">
                                        <code className="text-sm font-black text-white tracking-widest">{card.code}</code>
                                        <button
                                            onClick={() => handleCopyCode(card.code)}
                                            className="p-2.5 rounded-xl hover:bg-[#a3e635]/10 transition-colors group/btn"
                                        >
                                            {copiedCode === card.code ? (
                                                <Check className="w-5 h-5 text-[#a3e635]" />
                                            ) : (
                                                <Copy className="w-5 h-5 text-slate-500 group-hover/btn:text-[#a3e635]" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Footer Info */}
                                <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-slate-500 relative z-10 pt-6 border-t border-white/5">
                                    <div className="flex items-center">
                                        <Calendar className="w-4 h-4 mr-2 text-[#a3e635]" />
                                        EXP: {new Date(card.expiryDate).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center">
                                        <Zap className="w-3.5 h-3.5 mr-1 text-purple-400" />
                                        Reward Card
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="soft-card p-24 text-center mb-20 relative overflow-hidden bg-gradient-to-br from-[#111] to-[#0a0a0a]">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px]"></div>
                        <div className="relative z-10">
                            <div className="mx-auto w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center mb-8 rotate-12 hover:rotate-0 transition-transform duration-500">
                                <Gift className="w-12 h-12 text-[#a3e635]" />
                            </div>
                            <h3 className="text-4xl font-black text-white mb-6">NO GIFT CARDS FOUND</h3>
                            <p className="text-xl text-slate-400 font-medium mb-12 max-w-lg mx-auto leading-relaxed">
                                Redeem a gift card code to add credits to your account and shop our premium collection.
                            </p>
                            <button
                                onClick={() => setShowAddForm(true)}
                                className="bg-[#a3e635] text-black py-5 px-12 rounded-2xl font-black text-xl shadow-xl shadow-[#a3e635]/20 hover:bg-[#b4f04a] transition-all active:scale-95"
                            >
                                <Plus className="w-6 h-6 inline mr-3" />
                                Redeem Your First Card
                            </button>
                        </div>
                    </div>
                )}

                {/* Purchase Gift Card CTA */}
                <div className="soft-card p-10 sm:p-16 relative overflow-hidden bg-gradient-to-br from-[#111] to-[#0d0d0d] border border-white/5 hover:border-[#a3e635]/20 transition-all duration-500">
                    <div className="absolute top-0 right-0 w-[400px] h-full bg-[#a3e635]/5 rounded-full blur-[120px] -mr-32 pointer-events-none"></div>
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
                        <div className="flex-1 text-center lg:text-left">
                            <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 justify-center lg:justify-start">
                                <div className="bg-[#a3e635]/10 p-5 rounded-3xl border border-[#a3e635]/20 rotate-6 group-hover:rotate-0 transition-transform">
                                    <CreditCard className="w-10 h-10 text-[#a3e635]" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-normal md:text-4xl font-black text-white tracking-tight mb-2 uppercase">GIVE THE GIFT OF POWER</h3>
                                    <p className="text-lg text-slate-400 font-medium">Surprise your workout partners with Protein Pro credits.</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                                {['₹25', '₹50', '₹100', '₹250'].map(val => (
                                    <span key={val} className="px-6 py-2 rounded-full bg-white/5 border border-white/10 text-white font-black text-sm tracking-widest">{val}</span>
                                ))}
                            </div>
                        </div>
                        <button className="w-full lg:w-auto bg-white text-black py-6 px-12 rounded-[2rem] font-black text-2xl hover:bg-[#a3e635] transition-all duration-500 active:scale-95 shadow-2xl flex items-center justify-center group/buy">
                            <DollarSign className="w-7 h-7 mr-2" />
                            BUY GIFT CARD
                            <ArrowRight className="w-7 h-7 ml-3 transition-transform group-hover/buy:translate-x-2" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GiftCardsPage;
