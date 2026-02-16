import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useAppDispatch } from '../../../store/hooks';
import { checkAuth } from '../../../store/slice/authSlice';
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react';

const LoginSuccess = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { isAuthenticated, loading, user } = useAuth();
    const [checked, setChecked] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [retryCount, setRetryCount] = useState(0);
    const maxRetries = 3;

    useEffect(() => {
        // Wait a bit for cookies to be set after redirect, then check auth
        const checkAuthentication = async () => {
            try {
                // Small delay to ensure cookies are available
                await new Promise(resolve => setTimeout(resolve, 500));

                const result = await dispatch(checkAuth()).unwrap();
                console.log('Auth check successful:', result);
                setChecked(true);
                setError(null);
            } catch (error: any) {
                console.error('Authentication check failed:', error);
                setError(error || 'Authentication failed');

                // Retry logic
                if (retryCount < maxRetries) {
                    setTimeout(() => {
                        setRetryCount(prev => prev + 1);
                        setChecked(false);
                    }, 1000 * (retryCount + 1));
                } else {
                    setChecked(true);
                }
            }
        };

        checkAuthentication();
    }, [dispatch, retryCount]);

    useEffect(() => {
        if (checked && !loading) {
            if (isAuthenticated && user) {
                // Successfully authenticated, redirect to dashboard
                setTimeout(() => {
                    navigate('/dashboard', { replace: true });
                }, 1000);
            } else if (checked && retryCount >= maxRetries) {
                // Failed after retries, redirect to login
                setTimeout(() => {
                    navigate('/login', { replace: true });
                }, 3000);
            }
        }
    }, [isAuthenticated, loading, checked, navigate, user, retryCount]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-black font-sans">
            <div className="glass p-12 rounded-[2rem] border border-white/5 text-center max-w-md w-full mx-4 relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#a3e635]/10 rounded-full blur-3xl"></div>

                {loading || !checked ? (
                    <div className="relative z-10 space-y-8 animate-fade-in">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-[#a3e635]/20 border-t-[#a3e635] rounded-full animate-spin mx-auto"></div>
                            <Loader2 className="w-6 h-6 text-[#a3e635] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter italic">Initializing Protocol</h2>
                            <p className="text-slate-500 font-bold text-xs uppercase tracking-widest leading-loose">
                                {retryCount > 0 ? `Retry Sequence ${retryCount}/${maxRetries}` : 'Establishing secure authentication link'}
                            </p>
                        </div>
                    </div>
                ) : isAuthenticated && user ? (
                    <div className="relative z-10 space-y-8 animate-scale-in">
                        <div className="w-20 h-20 bg-[#a3e635]/10 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-[#a3e635]/20">
                            <CheckCircle className="w-10 h-10 text-[#a3e635]" strokeWidth={2.5} />
                        </div>
                        <div>
                            <h2 className="text-4xl font-black text-white mb-2 uppercase tracking-tighter italic">Mission Authorized</h2>
                            <p className="text-slate-400 font-bold mb-6">Welcome back, {user.name.split(' ')[0]}</p>
                            <div className="flex flex-col items-center gap-4">
                                <div className="h-1 w-32 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-[#a3e635] animate-[shimmer_2s_infinite]"></div>
                                </div>
                                <p className="text-[10px] text-[#a3e635] font-black uppercase tracking-[0.3em]">Entering Dashboard</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="relative z-10 space-y-8 animate-fade-in">
                        <div className="w-20 h-20 bg-rose-500/10 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-rose-500/20">
                            <AlertCircle className="w-10 h-10 text-rose-500" strokeWidth={2.5} />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter italic">Authorization Denied</h2>
                            <p className="text-slate-500 font-bold text-sm mb-8 leading-relaxed max-w-[250px] mx-auto">
                                {error || 'Security protocol failed to verify user identity.'}
                            </p>
                            <button
                                onClick={() => navigate('/login', { replace: true })}
                                className="w-full bg-white/5 border border-white/10 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all active:scale-95"
                            >
                                Return to Terminal
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LoginSuccess;
