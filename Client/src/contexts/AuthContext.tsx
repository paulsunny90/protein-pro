import { createContext, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loginUser, registerUser, logoutUser, checkAuth, requestOTP as requestOTPAction, verifyOTP as verifyOTPAction } from '../store/slice/authSlice';

interface AuthContextType {
  user: any;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  requestOTP: (identifier: string, name?: string) => Promise<boolean>;
  verifyOTP: (identifier: string, otp: string) => Promise<boolean>;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, loading, error } = useAppSelector((state: any) => state.auth);

  // Check auth on mount
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const resultAction = await dispatch(loginUser({ email, password }));
      if (loginUser.fulfilled.match(resultAction)) {
        return true;
      }
      return false;
    } catch (err) {
      console.error('Login dispatch error:', err);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const resultAction = await dispatch(registerUser({ name, email, password }));
      if (registerUser.fulfilled.match(resultAction)) {
        return true;
      }
      return false;
    } catch (err) {
      console.error('Registration dispatch error:', err);
      return false;
    }
  };

  const logout = () => {
    dispatch(logoutUser());
  };

  const requestOTP = async (identifier: string, name?: string): Promise<boolean> => {
    try {
      const resultAction = await dispatch(requestOTPAction({ identifier, name }));
      return requestOTPAction.fulfilled.match(resultAction);
    } catch (err) {
      return false;
    }
  };

  const verifyOTP = async (identifier: string, otp: string): Promise<boolean> => {
    try {
      const resultAction = await dispatch(verifyOTPAction({ identifier, otp }));
      return verifyOTPAction.fulfilled.match(resultAction);
    } catch (err) {
      return false;
    }
  };

  const value = {
    user,
    login,
    logout,
    register,
    requestOTP,
    verifyOTP,
    isAuthenticated,
    loading,
    error
  };


  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};