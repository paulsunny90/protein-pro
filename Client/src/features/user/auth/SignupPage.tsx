import React, { useState } from 'react';
import { Lock, Mail, Eye, EyeOff, User, Check, ShieldCheck, ArrowRight, Phone } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

const SignupPage = () => {
  const [signupMethod, setSignupMethod] = useState<'password' | 'otp'>('password');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    emailOrPhone: '',
    password: '',
    confirmPassword: '',
    otp: '',
    acceptTerms: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { register, requestOTP, verifyOTP } = useAuth();

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
      const success = await register(formData.name, formData.emailOrPhone, formData.password);
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

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.emailOrPhone) {
      setError('Please fill in all required fields');
      return;
    }
    if (!formData.acceptTerms) {
      setError('Please accept the terms and conditions.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const success = await requestOTP(formData.emailOrPhone, formData.name);
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
        setSuccess(true);
        setTimeout(() => navigate('/dashboard', { replace: true }), 2000);
      } else {
        setError('Invalid or expired OTP.');
      }
    } catch (err: any) {
      setError(err.message || 'Verification failed.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center border border-emerald-100 shadow-emerald-500/10">
            <div className="mx-auto bg-emerald-100 w-24 h-24 rounded-full flex items-center justify-center mb-8 animate-bounce">
              <Check className="h-12 w-12 text-emerald-600" />
            </div>
            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">You're In!</h2>
            <p className="text-slate-600 font-medium text-lg">
              Welcome to the NutriFitPro elite community.
            </p>
            <div className="mt-8">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-emerald-500 border-t-transparent mx-auto"></div>
              <p className="mt-4 text-emerald-600 font-black text-sm uppercase tracking-widest">Entering Dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-white/50 backdrop-blur-sm">
          <div className="text-center mb-8">
            <div className="mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 w-20 h-20 rounded-3xl flex items-center justify-center shadow-lg transform rotate-12 transition-transform hover:rotate-0 duration-500">
              <User className="h-10 w-10 text-white -rotate-12" />
            </div>
            <h2 className="mt-8 text-4xl font-black text-slate-900 tracking-tight">Join Elite</h2>
            <p className="mt-3 text-slate-500 font-medium">
              Start your peak performance journey today.
            </p>
          </div>

          <div className="flex p-1 bg-slate-100 rounded-2xl mb-8">
            <button
              onClick={() => { setSignupMethod('password'); setOtpSent(false); setError(''); }}
              className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${signupMethod === 'password' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Password
            </button>
            <button
              onClick={() => { setSignupMethod('otp'); setError(''); }}
              className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${signupMethod === 'otp' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              OTP Account
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
              <form onSubmit={signupMethod === 'password' ? handlePasswordSignup : handleRequestOTP} className="space-y-6">
                <div>
                  <label className="block text-sm font-black text-slate-700 mb-2 ml-1">Full Name</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                      <User className="h-5 w-5" />
                    </div>
                    <input
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-bold text-slate-800 placeholder:text-slate-400"
                      placeholder="Enter your name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-black text-slate-700 mb-2 ml-1">
                    {signupMethod === 'password' ? 'Email Address' : 'Email or Phone Number'}
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                      {signupMethod === 'password' ? <Mail className="h-5 w-5" /> : <Phone className="h-5 w-5" />}
                    </div>
                    <input
                      name="emailOrPhone"
                      type={signupMethod === 'password' ? "email" : "text"}
                      required
                      value={formData.emailOrPhone}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-bold text-slate-800 placeholder:text-slate-400"
                      placeholder={signupMethod === 'password' ? "you@example.com" : "Email or 10-digit mobile"}
                    />
                  </div>
                </div>

                {signupMethod === 'password' && (
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-sm font-black text-slate-700 mb-2 ml-1">Password</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                          <Lock className="h-5 w-5" />
                        </div>
                        <input
                          name="password"
                          type={showPassword ? "text" : "password"}
                          required
                          value={formData.password}
                          onChange={handleChange}
                          className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-bold text-slate-800 placeholder:text-slate-400"
                          placeholder="••••••••"
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-indigo-500 transition-colors">
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-black text-slate-700 mb-2 ml-1">Confirm Password</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                          <Lock className="h-5 w-5" />
                        </div>
                        <input
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          required
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-bold text-slate-800 placeholder:text-slate-400"
                          placeholder="••••••••"
                        />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-indigo-500 transition-colors">
                          {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-start bg-slate-50 p-4 rounded-2xl">
                  <div className="flex items-center h-5">
                    <input
                      id="acceptTerms"
                      name="acceptTerms"
                      type="checkbox"
                      checked={formData.acceptTerms}
                      onChange={handleChange}
                      className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded-lg cursor-pointer"
                    />
                  </div>
                  <div className="ml-3 text-xs font-bold text-slate-500 leading-tight">
                    I agree to the <a href="#" className="text-indigo-600 hover:text-indigo-700 underline">Terms of Service</a> and <a href="#" className="text-indigo-600 hover:text-indigo-700 underline">Privacy Policy</a>
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
                      {signupMethod === 'password' ? 'Create Account' : 'Secure OTP Signup'}
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
                      Verification code sent to {formData.emailOrPhone}
                    </p>
                  </div>
                  <label className="block text-sm font-black text-slate-700 mb-2 ml-1">
                    Verify Your Code
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
                    {isLoading ? 'Verifying...' : 'Complete Registration'}
                  </button>
                  <button type="button" onClick={() => setOtpSent(false)} className="w-full py-2 text-sm font-black text-slate-400 hover:text-slate-600 transition-colors">
                    Back to Signup
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm font-bold text-slate-500">
              Already elite?{' '}
              <Link to="/login" className="text-indigo-600 hover:text-indigo-700 underline decoration-2 underline-offset-4">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;