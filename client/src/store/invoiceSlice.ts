import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import api from '../utils/api';
import { AppDispatch } from '../types';

interface InvoiceState {
  invoices: any[];
  error: string | null;
}

const initialState: InvoiceState = {
  invoices: [],
  error: null,
};

const invoiceSlice = createSlice({
  name: 'invoice',
  initialState,
  reducers: {
    fetchInvoicesSuccess: (state, action: PayloadAction<any[]>) => {
      state.invoices = action.payload;
      state.error = null;
    },
    fetchInvoicesFailure: (state, action: PayloadAction<string>) => {
      state.invoices = [];
      state.error = action.payload;
    },
    addProductSuccess: (state, action: PayloadAction<any>) => {
      // Optionally update state if needed after adding product
    },
    addProductFailure: (state, action: PayloadAction<string>) => {
      // Optionally handle error
    },
  },
});

export const { fetchInvoicesSuccess, fetchInvoicesFailure, addProductSuccess, addProductFailure } = invoiceSlice.actions;

export const fetchInvoices = () => async (dispatch: AppDispatch) => {
  try {
    const response = await api.get('/invoices');
    dispatch(fetchInvoicesSuccess(response.data));
  } catch (error: any) {
    dispatch(fetchInvoicesFailure(error.response?.data.message || 'Failed to fetch invoices.'));
  }
};

export const addProduct = (productData: any) => async (dispatch: AppDispatch) => {
  try {
    const response = await api.post('/invoices/add-product', productData);
    dispatch(addProductSuccess(response.data));
  } catch (error: any) {
    dispatch(addProductFailure(error.response?.data.message || 'Failed to add product.'));
  }
};

export default invoiceSlice.reducer;
