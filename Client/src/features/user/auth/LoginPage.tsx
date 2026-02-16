import React, { useState } from 'react';
import { Lock, Mail, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

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
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 font-sans selection:bg-[#a3e635] selection:text-black">
      <div className="w-full max-w-md space-y-12 animate-fade-in">
        {/* Logo Section */}
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-[#a3e635] rounded-2xl flex items-center justify-center mb-10 shadow-lg shadow-[#a3e635]/20">
            <span className="text-black font-black text-2xl tracking-tighter">PP</span>
          </div>
          <h1 className="text-5xl font-black text-white tracking-[calc(-0.04em)] uppercase leading-none mb-4 text-center">
            WELCOME BACK
          </h1>
          <p className="text-slate-500 font-medium tracking-tight text-center">
            Sign in to your account
          </p>
        </div>

        <div className="space-y-8">
          {error && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center">
              <ShieldCheck className="h-4 w-4 mr-3" />
              {error}
            </div>
          )}

          <form onSubmit={handlePasswordLogin} className="space-y-6">
            <div className="space-y-2">
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
            </div>

            <div className="space-y-2">
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
                  className="w-full pl-16 pr-16 py-6 bg-[#0d0d0d] border border-white/5 rounded-2xl focus:outline-none focus:border-[#a3e635]/30 transition-all font-bold text-white placeholder:text-slate-700"
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-6 flex items-center text-slate-600 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
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
                  Logging in...
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-sm font-bold text-slate-500">
              Don't have an account?{' '}
              <Link to="/signup" className="text-[#a3e635] hover:underline decoration-2 underline-offset-8">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;