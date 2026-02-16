import React, { useState } from 'react';
import { Lock, Mail, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { API_URL } from '../../../utils/api';

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
          <h1 className="text-2xl  font-normal font-black text-white tracking-[calc(-0.04em)] uppercase leading-none mb-4 text-center">
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

          <div className="relative flex items-center py-4">
            <div className="flex-grow border-t border-white/5"></div>
            <span className="flex-shrink mx-4 text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">OR CONTINUE WITH</span>
            <div className="flex-grow border-t border-white/5"></div>
          </div>

          <button
            onClick={() => window.location.href = `${API_URL.replace('/api', '')}/auth/google`}
            className="w-full bg-white/5 border border-white/10 text-white py-6 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs hover:bg-white/10 transition-all active:scale-[0.95] flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            GOOGLE ACCOUNT
          </button>

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