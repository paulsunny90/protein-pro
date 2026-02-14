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
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full mx-4">
                {loading || !checked ? (
                    <>
                        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying Login...</h2>
                        <p className="text-gray-600">
                            {retryCount > 0 ? `Retrying... (${retryCount}/${maxRetries})` : 'Please wait while we verify your account'}
                        </p>
                    </>
                ) : isAuthenticated && user ? (
                    <>
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-10 h-10 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Successful!</h2>
                        <p className="text-gray-600 mb-4">Welcome back, {user.name}!</p>
                        <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
                    </>
                ) : (
                    <>
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="w-10 h-10 text-red-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Failed</h2>
                        <p className="text-gray-600 mb-4">
                            {error || 'Unable to verify your login. Please try again.'}
                        </p>
                        <p className="text-sm text-gray-500">Redirecting to login page...</p>
                        <button
                            onClick={() => navigate('/login', { replace: true })}
                            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                            Go to Login
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default LoginSuccess;
