import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import api from '../utils/api';
import { AppDispatch } from '../types';

interface AuthState {
  user: any;
  isAuthenticated: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
});

export const { loginSuccess, loginFailure, logout } = authSlice.actions;

export const loginUser = (credentials: any) => async (dispatch: AppDispatch) => {
  try {
    console.log('Sending login request with credentials:', credentials);

    const response = await api.post('/auth/login', credentials);
    console.log('Login response:', response.data);
    const token = response.data.token;
    localStorage.setItem('authToken', token);
    dispatch(loginSuccess(response.data));
  } catch (error: any) {
    dispatch(loginFailure(error.response?.data.message || 'Login failed.'));
  }
};

export default authSlice.reducer;
