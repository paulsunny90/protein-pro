import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// Types
export interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    authProvider?: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

// Initial State
const initialState: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
};

// Async Thunks

// Register
export const registerUser = createAsyncThunk(
    'auth/register',
    async (userData: any, { rejectWithValue }) => {
        try {
            const response = await api.post('/auth/register', userData); // Updated endpoint to match backend route
            // Backend: router.post("/register", registerUser); in user.routes.ts mounted at /user ?? 
            // Wait, app.ts says: app.use("/api/auth", authRoutes); app.use("/api/user", userRoutes);
            // auth.routes.ts has /register. So it should be /auth/register
            // Corrected below in implementation
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Registration failed');
        }
    }
);

// Login
export const loginUser = createAsyncThunk(
    'auth/login',
    async (userData: any, { rejectWithValue }) => {
        try {
            const response = await api.post('/auth/login', userData);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Login failed');
        }
    }
);

// OTP Request
export const requestOTP = createAsyncThunk(
    'auth/requestOTP',
    async (data: { identifier: string; name?: string }, { rejectWithValue }) => {
        try {
            const response = await api.post('/auth/request-otp', data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to send OTP');
        }
    }
);

// OTP Verification
export const verifyOTP = createAsyncThunk(
    'auth/verifyOTP',
    async (otpData: { identifier: string; otp: string }, { rejectWithValue }) => {
        try {
            const response = await api.post('/auth/verify-otp', otpData);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Verification failed');
        }
    }
);

// Logout
export const logoutUser = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            await api.post('/auth/logout');
            return true;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Logout failed');
        }
    }
);

// Check Auth / Load User (Profile)
export const checkAuth = createAsyncThunk(
    'auth/checkAuth',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/user/profile'); // user.routes.ts: router.get("/profile", authMiddleware, getProfile);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch user');
        }
    }
);


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Register
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                // If your backend returns token in body, save it? Code said cookies.
                // Assuming cookies for now.
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Login
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.token = action.payload.token; // Optional if using local storage
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // OTP Verification
            .addCase(verifyOTP.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyOTP.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(verifyOTP.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Logout
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
            })

            // Check Auth
            .addCase(checkAuth.pending, (state) => {
                state.loading = true;
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
            })
            .addCase(checkAuth.rejected, (state) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.user = null;
            });
    },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
