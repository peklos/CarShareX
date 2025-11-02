import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Transaction } from '../../types';
import { transactionsApi, CreateTransactionData } from './transactionsApi';

interface TransactionsState {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  createLoading: boolean;
  createError: string | null;
}

const initialState: TransactionsState = {
  transactions: [],
  loading: false,
  error: null,
  createLoading: false,
  createError: null,
};

// Async thunks
export const fetchUserTransactions = createAsyncThunk(
  'transactions/fetchUserTransactions',
  async () => {
    const transactions = await transactionsApi.getUserTransactions();
    return transactions;
  }
);

export const createTransaction = createAsyncThunk(
  'transactions/createTransaction',
  async (data: CreateTransactionData) => {
    const transaction = await transactionsApi.createTransaction(data);
    return transaction;
  }
);

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.createError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch user transactions
      .addCase(fetchUserTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchUserTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки транзакций';
      })
      // Create transaction
      .addCase(createTransaction.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.createLoading = false;
        state.transactions.unshift(action.payload);
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.error.message || 'Ошибка создания транзакции';
      });
  },
});

export const { clearError } = transactionsSlice.actions;
export default transactionsSlice.reducer;
