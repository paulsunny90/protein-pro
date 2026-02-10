
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext'; // Updated path

const LoginSuccess = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth(); // AuthProvider will checkAuth on mount

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard'); // Or wherever appropriate
        } else {
            // If not authenticated yet but we are on this page, it might be checking.
            // Or if failed, we might want to redirect to login after a timeout.
            const timeout = setTimeout(() => {
                if (!isAuthenticated) navigate('/login');
            }, 3000); // 3s timeout
            return () => clearTimeout(timeout);
        }
    }, [isAuthenticated, navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <h2 className="text-2xl font-bold mb-4">Login Successful!</h2>
                <p className="text-gray-600">Redirecting you to the dashboard...</p>
                <div className="mt-4 animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            </div>
        </div>
    );
};

export default LoginSuccess;
