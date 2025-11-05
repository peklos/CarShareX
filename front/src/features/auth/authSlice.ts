import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, Employee } from '../../types';
import { STORAGE_KEYS } from '../../utils/constants';
import { profileApi } from '../profile/profileApi';

interface AuthState {
  user: User | Employee | null;
  isAuthenticated: boolean;
  role: 'client' | 'admin' | null;
  loading: boolean;
  error: string | null;
}

// Load initial state from localStorage
const loadInitialState = (): AuthState => {
  try {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    const role = localStorage.getItem(STORAGE_KEYS.ROLE) as 'client' | 'admin' | null;

    if (userStr && role) {
      return {
        user: JSON.parse(userStr),
        isAuthenticated: true,
        role,
        loading: false,
        error: null,
      };
    }
  } catch (error) {
    console.error('Failed to load auth state from localStorage:', error);
  }

  return {
    user: null,
    isAuthenticated: false,
    role: null,
    loading: false,
    error: null,
  };
};

const initialState: AuthState = loadInitialState();

// Async thunks
export const refreshUserProfile = createAsyncThunk(
  'auth/refreshUserProfile',
  async (_, { rejectWithValue }) => {
    const { data, error } = await profileApi.getProfile();
    if (error) return rejectWithValue(error);
    return data!;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{ user: User | Employee; role: 'client' | 'admin' }>) => {
      state.user = action.payload.user;
      state.role = action.payload.role;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;

      // Save to localStorage
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(action.payload.user));
      localStorage.setItem(STORAGE_KEYS.ROLE, action.payload.role);
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.role = null;
      state.loading = false;
      state.error = null;

      // Clear localStorage
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.ROLE);
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload } as User;
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(state.user));
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Refresh user profile
      .addCase(refreshUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(action.payload));
      })
      .addCase(refreshUserProfile.rejected, (_state, action) => {
        console.error('Failed to refresh user profile:', action.error);
      });
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  updateUser,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;
