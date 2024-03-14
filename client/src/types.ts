import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './store/authSlice';

const rootReducer = combineReducers({
  auth: authReducer, // Add other reducers here if needed
});

const store = configureStore({
  reducer: rootReducer // Add your reducers here if needed
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;