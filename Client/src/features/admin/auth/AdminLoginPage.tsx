import React, { useState } from 'react';
import { Lock, Mail, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

const AdminLoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login, error: authError } = useAuth();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const success = await login(formData.email, formData.password);

            if (success) {
                navigate('/admin', { replace: true });
            } else {
                setError(authError || 'Invalid admin credentials. Access Denied.');
            }
        } catch (err) {
            setError('An error occurred during authentication.');
            console.error('Admin Login error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center py-12 px-4 selection:bg-emerald-100 selection:text-emerald-900 overflow-hidden relative">
            {/* Background decoration */}
            <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-emerald-200/20 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-emerald-100/30 rounded-full blur-[120px]"></div>

            <div className="max-w-md w-full relative z-10">
                <div className="soft-card p-10 bg-white shadow-2xl shadow-emerald-900/5">
                    <div className="text-center mb-10">
                        <div className="mx-auto bg-emerald-600 w-20 h-20 rounded-3xl flex items-center justify-center shadow-xl shadow-emerald-600/20 rotate-3 transition-transform hover:rotate-0 duration-500">
                            <ShieldCheck className="h-10 w-10 text-white" />
                        </div>
                        <h2 className="mt-8 text-4xl font-black text-slate-900 tracking-tighter">Admin Access</h2>
                        <p className="mt-3 text-slate-500 font-medium">
                            Secure management portal for Pure Fitness
                        </p>
                    </div>

                    {(error || authError) && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-2xl text-sm font-bold flex items-center animate-in fade-in slide-in-from-top-4 duration-300">
                            <span className="w-2 h-2 bg-red-500 rounded-full mr-3 animate-pulse"></span>
                            {error || authError}
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-5">
                            <div>
                                <label htmlFor="email" className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">
                                    Administrator Email
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:border-transparent transition-all outline-none font-medium text-slate-900 placeholder:text-slate-300"
                                        placeholder="admin@purefitness.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">
                                    Secure Passkey
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="current-password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:border-transparent transition-all outline-none font-medium text-slate-900 placeholder:text-slate-300"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-300 hover:text-emerald-600 transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-emerald-600 text-white py-5 px-6 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-xl shadow-emerald-600/20 group active:scale-[0.98]"
                            >
                                {isLoading ? (
                                    <div className="flex items-center">
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/20 border-t-white mr-3"></div>
                                        Authenticating...
                                    </div>
                                ) : (
                                    <div className="flex items-center">
                                        Access Portal
                                        <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                )}
                            </button>
                        </div>
                    </form>

                    <footer className="mt-10 text-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                            Authorized Personnel Only
                        </p>
                    </footer>
                </div>

                <p className="text-center mt-8 text-slate-400 text-sm font-medium">
                    Protected by AES-256 Encryption
                </p>
            </div>
        </div>
    );
};

export default AdminLoginPage;
