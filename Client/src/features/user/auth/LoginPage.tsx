import React, { useState } from 'react';
import { Lock, Mail, Eye, EyeOff, ArrowRight, Phone, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

const LoginPage = () => {
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: '',
    otp: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, requestOTP, verifyOTP } = useAuth();

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
      // Assuming existing login takes email, we use emailOrPhone as email
      const success = await login(formData.emailOrPhone, formData.password);

      if (success) {
        navigate('/dashboard', { replace: true });
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during login.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.emailOrPhone) {
      setError('Please enter your email or phone number');
      return;
    }
    setIsLoading(true);
    setError('');

    try {
      const success = await requestOTP(formData.emailOrPhone);
      if (success) {
        setOtpSent(true);
      } else {
        setError('Failed to send OTP. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.otp) {
      setError('Please enter the OTP');
      return;
    }
    setIsLoading(true);
    setError('');

    try {
      const success = await verifyOTP(formData.emailOrPhone, formData.otp);
      if (success) {
        navigate('/dashboard', { replace: true });
      } else {
        setError('Invalid or expired OTP.');
      }
    } catch (err: any) {
      setError(err.message || 'Verification failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-white/50 backdrop-blur-sm">
          <div className="text-center mb-8">
            <div className="mx-auto bg-gradient-to-br from-emerald-500 to-teal-600 w-20 h-20 rounded-3xl flex items-center justify-center shadow-lg transform rotate-12 transition-transform hover:rotate-0 duration-500">
              <Lock className="h-10 w-10 text-white -rotate-12" />
            </div>
            <h2 className="mt-8 text-4xl font-black text-slate-900 tracking-tight">Welcome Back</h2>
            <p className="mt-3 text-slate-500 font-medium">
              Join the elite. Sign in to your NutriFitPro account.
            </p>
          </div>

          <div className="flex p-1 bg-slate-100 rounded-2xl mb-8">
            <button
              onClick={() => { setLoginMethod('password'); setOtpSent(false); setError(''); }}
              className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${loginMethod === 'password' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Password
            </button>
            <button
              onClick={() => { setLoginMethod('otp'); setError(''); }}
              className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${loginMethod === 'otp' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              OTP Login
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-sm font-bold flex items-center animate-shake">
              <div className="bg-rose-100 p-1 rounded-lg mr-3">
                <ShieldCheck className="h-4 w-4" />
              </div>
              {error}
            </div>
          )}

          <div className="space-y-6">
            {!otpSent ? (
              <form onSubmit={loginMethod === 'password' ? handlePasswordLogin : handleRequestOTP} className="space-y-6">
                <div>
                  <label className="block text-sm font-black text-slate-700 mb-2 ml-1">
                    {loginMethod === 'password' ? 'Email Address' : 'Email or Phone Number'}
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                      {loginMethod === 'password' ? <Mail className="h-5 w-5" /> : <Phone className="h-5 w-5" />}
                    </div>
                    <input
                      name="emailOrPhone"
                      type={loginMethod === 'password' ? "email" : "text"}
                      required
                      value={formData.emailOrPhone}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-bold text-slate-800 placeholder:text-slate-400"
                      placeholder={loginMethod === 'password' ? "you@example.com" : "Email or 10-digit mobile"}
                    />
                  </div>
                </div>

                {loginMethod === 'password' && (
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
                )}

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
                      {loginMethod === 'password' ? 'Sign In' : 'Get Secure OTP'}
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </div>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOTP} className="space-y-6 animate-fade-in">
                <div>
                  <div className="bg-emerald-50 p-4 rounded-2xl mb-6">
                    <p className="text-emerald-800 text-sm font-bold flex items-center">
                      <ShieldCheck className="h-4 w-4 mr-2" />
                      Secure code sent to {formData.emailOrPhone}
                    </p>
                  </div>
                  <label className="block text-sm font-black text-slate-700 mb-2 ml-1">
                    Enter Verification Code
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <input
                      name="otp"
                      type="text"
                      maxLength={6}
                      required
                      value={formData.otp}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-black tracking-[0.5em] text-center text-2xl text-slate-800"
                      placeholder="000000"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-emerald-600 text-white py-4 px-6 rounded-2xl font-black hover:bg-emerald-700 transition-all disabled:opacity-50 flex items-center justify-center shadow-xl shadow-emerald-600/20 active:scale-95"
                  >
                    {isLoading ? 'Verifying...' : 'Complete Login'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="w-full py-4 text-sm font-black text-slate-500 hover:text-slate-700 transition-colors"
                  >
                    Change Identifier
                  </button>
                </div>
              </form>
            )}
          </div>

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
                onClick={() => window.location.href = "http://localhost:5000/auth/google"}
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