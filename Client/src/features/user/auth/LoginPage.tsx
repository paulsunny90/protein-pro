import React, { useState } from 'react';
import { Lock, Mail, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { BASE_URL } from '../../../utils/imageUtils';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { login, user, isAuthenticated } = useAuth();

  // Smart Redirection: Redirect based on user role once authenticated
  React.useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const success = await login(formData.email, formData.password);
      if (!success) {
        setError('Invalid credentials. Please try again.');
        setIsLoading(false);
      }
      // Success redirection is handled by the useEffect above
    } catch (err: any) {
      setError(err.message || 'An error occurred during login.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center py-12 px-4 font-sans">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-white/50 backdrop-blur-sm shadow-emerald-900/5">
          <div className="text-center mb-8">
            <div className="mx-auto bg-gradient-to-br from-emerald-500 to-teal-600 w-20 h-20 rounded-3xl flex items-center justify-center shadow-lg transform rotate-12 transition-transform hover:rotate-0 duration-500">
              <Lock className="h-10 w-10 text-white -rotate-12" />
            </div>
            <h2 className="mt-8 text-4xl font-black text-slate-900 tracking-tight">Welcome Back</h2>
            <p className="mt-3 text-slate-500 font-medium">
              Join the elite. Sign in to your NutriFitPro account.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-sm font-bold flex items-center animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="bg-rose-100 p-1 rounded-lg mr-3">
                <ShieldCheck className="h-4 w-4" />
              </div>
              {error}
            </div>
          )}

          <form onSubmit={handlePasswordLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-black text-slate-700 mb-2 ml-1">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-bold text-slate-800 placeholder:text-slate-400"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-black text-slate-700 mb-2 ml-1">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-bold text-slate-800 placeholder:text-slate-400"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-emerald-500 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <div className="flex justify-end mt-2">
                <a href="#" className="text-xs font-bold text-emerald-600 hover:text-emerald-700">Forgot Password?</a>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-900 text-white py-4 px-6 rounded-2xl font-black hover:bg-slate-800 focus:ring-4 focus:ring-slate-900/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-xl shadow-slate-900/20 active:scale-95"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/20 border-t-white mr-3"></div>
                  Processing...
                </div>
              ) : (
                <div className="flex items-center">
                  Sign In
                  <ArrowRight className="h-5 w-5 ml-2" />
                </div>
              )}
            </button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100" />
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-widest font-black text-slate-400">
                <span className="px-4 bg-white">Ultra Secure Auth</span>
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <button
                type="button"
                onClick={() => window.location.href = `${BASE_URL}/auth/google`}
                className="flex-1 flex justify-center items-center py-4 px-4 border border-slate-100 rounded-2xl bg-white hover:bg-slate-50 transition-all shadow-sm active:scale-95 group"
              >
                <img className="h-5 w-5 group-hover:scale-110 transition-transform" src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" />
                <span className="ml-3 font-bold text-slate-700">Google</span>
              </button>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm font-bold text-slate-500">
              New to NutriFitPro?{' '}
              <Link to="/signup" className="text-emerald-600 hover:text-emerald-700 underline decoration-2 underline-offset-4">
                Create elite account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;