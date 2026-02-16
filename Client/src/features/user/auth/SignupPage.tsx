import React, { useState } from 'react';
import { Lock, Mail, Eye, EyeOff, User, Check, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePasswordSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }
    if (!formData.acceptTerms) {
      setError('Please accept the terms and conditions.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const success = await register(formData.name, formData.email, formData.password);
      if (success) {
        setSuccess(true);
        setTimeout(() => navigate('/dashboard', { replace: true }), 2000);
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="max-w-md w-full animate-fade-in text-center">
          <div className="w-24 h-24 bg-[#a3e635]/10 rounded-3xl flex items-center justify-center mx-auto mb-10 border border-[#a3e635]/20">
            <Check className="h-12 w-12 text-[#a3e635]" />
          </div>
          <h2 className="text-5xl font-black text-white mb-6 uppercase tracking-tighter leading-none">YOU'RE IN!</h2>
          <p className="text-slate-500 font-medium text-lg leading-relaxed mb-10">
            Welcome to the Protein Pro elite community.
          </p>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-[#a3e635] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-[#a3e635] font-black text-xs uppercase tracking-[0.2em]">INITIALIZING DASHBOARD...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 font-sans selection:bg-[#a3e635] selection:text-black">
      <div className="w-full max-w-md space-y-12 animate-fade-in">
        {/* Logo Section */}
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-[#a3e635] rounded-2xl flex items-center justify-center mb-10 shadow-lg shadow-[#a3e635]/20">
            <span className="text-black font-black text-2xl tracking-tighter">PP</span>
          </div>
          <h1 className="text-5xl font-black text-white tracking-[calc(-0.04em)] uppercase leading-none mb-4">
            CREATE ACCOUNT
          </h1>
          <p className="text-slate-500 font-medium tracking-tight">
            Start your peak performance journey today
          </p>
        </div>

        <div className="space-y-8">
          {error && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center">
              <ShieldCheck className="h-4 w-4 mr-3" />
              {error}
            </div>
          )}

          <form onSubmit={handlePasswordSignup} className="space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-slate-600 group-focus-within:text-[#a3e635] transition-colors">
                  <User className="h-5 w-5" />
                </div>
                <input
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-16 pr-6 py-6 bg-[#0d0d0d] border border-white/5 rounded-2xl focus:outline-none focus:border-[#a3e635]/30 transition-all font-bold text-white placeholder:text-slate-700"
                  placeholder="Full Name"
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-slate-600 group-focus-within:text-[#a3e635] transition-colors">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-16 pr-6 py-6 bg-[#0d0d0d] border border-white/5 rounded-2xl focus:outline-none focus:border-[#a3e635]/30 transition-all font-bold text-white placeholder:text-slate-700"
                  placeholder="Email Address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-slate-600 group-focus-within:text-[#a3e635] transition-colors">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-16 pr-12 py-6 bg-[#0d0d0d] border border-white/5 rounded-2xl focus:outline-none focus:border-[#a3e635]/30 transition-all font-bold text-white placeholder:text-slate-700 text-sm"
                    placeholder="Password"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-4 flex items-center text-slate-600 hover:text-white transition-colors">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                <div className="relative group">
                  <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-slate-600 group-focus-within:text-[#a3e635] transition-colors">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-16 pr-12 py-6 bg-[#0d0d0d] border border-white/5 rounded-2xl focus:outline-none focus:border-[#a3e635]/30 transition-all font-bold text-white placeholder:text-slate-700 text-sm"
                    placeholder="Confirm"
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-4 flex items-center text-slate-600 hover:text-white transition-colors">
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-start bg-[#0d0d0d] p-5 rounded-2xl border border-white/5">
              <div className="flex items-center h-5 pt-1">
                <input
                  id="acceptTerms"
                  name="acceptTerms"
                  type="checkbox"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  className="h-5 w-5 accent-[#a3e635] cursor-pointer"
                />
              </div>
              <div className="ml-4 text-xs font-bold text-slate-500 leading-relaxed">
                I agree to the <a href="#" className="text-[#a3e635] hover:underline">Terms of Service</a> and <a href="#" className="text-[#a3e635] hover:underline">Privacy Policy</a>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#a3e635] text-black py-6 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-sm hover:translate-y-[-2px] hover:shadow-2xl hover:shadow-[#a3e635]/20 transition-all active:scale-[0.98] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-black/20 border-t-black mr-3"></div>
                  JOINING...
                </div>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-sm font-bold text-slate-500">
              Already elite?{' '}
              <Link to="/login" className="text-[#a3e635] hover:underline decoration-2 underline-offset-8">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;