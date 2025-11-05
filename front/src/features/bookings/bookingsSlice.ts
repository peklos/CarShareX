import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Booking } from '../../types';
import { bookingsApi, CreateBookingData } from './bookingsApi';

interface BookingsState {
  bookings: Booking[];
  selectedBooking: Booking | null;
  loading: boolean;
  error: string | null;
  createLoading: boolean;
  createError: string | null;
}

const initialState: BookingsState = {
  bookings: [],
  selectedBooking: null,
  loading: false,
  error: null,
  createLoading: false,
  createError: null,
};

// Async thunks
export const fetchUserBookings = createAsyncThunk(
  'bookings/fetchUserBookings',
  async () => {
    const bookings = await bookingsApi.getUserBookings();
    return bookings;
  }
);

export const fetchBookingById = createAsyncThunk(
  'bookings/fetchBookingById',
  async (id: number) => {
    const booking = await bookingsApi.getBookingById(id);
    return booking;
  }
);

export const createBooking = createAsyncThunk(
  'bookings/createBooking',
  async (data: CreateBookingData, { rejectWithValue }) => {
    try {
      const booking = await bookingsApi.createBooking(data);
      return booking;
    } catch (error: any) {
      // Получаем детальную ошибку от сервера
      if (error.response?.data?.detail) {
        return rejectWithValue(error.response.data.detail);
      }
      return rejectWithValue(error.message || 'Ошибка создания бронирования');
    }
  }
);

export const completeBooking = createAsyncThunk(
  'bookings/completeBooking',
  async (data: { id: number; end_time: string; total_cost: number }) => {
    const booking = await bookingsApi.completeBooking(data.id, data.end_time, data.total_cost);
    return booking;
  }
);

const bookingsSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    clearSelectedBooking: (state) => {
      state.selectedBooking = null;
    },
    clearError: (state) => {
      state.error = null;
      state.createError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch user bookings
      .addCase(fetchUserBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchUserBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки бронирований';
      })
      // Fetch booking by ID
      .addCase(fetchBookingById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookingById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedBooking = action.payload;
      })
      .addCase(fetchBookingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки бронирования';
      })
      // Create booking
      .addCase(createBooking.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.createLoading = false;
        state.bookings.unshift(action.payload);
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = (action.payload as string) || action.error.message || 'Ошибка создания бронирования';
      })
      // Complete booking
      .addCase(completeBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completeBooking.fulfilled, (state, action) => {
        state.loading = false;
        // Update the booking in the list
        const index = state.bookings.findIndex((b) => b.id === action.payload.id);
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
        if (state.selectedBooking?.id === action.payload.id) {
          state.selectedBooking = action.payload;
        }
      })
      .addCase(completeBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка завершения бронирования';
      });
  },
});

export const { clearSelectedBooking, clearError } = bookingsSlice.actions;
export default bookingsSlice.reducer;
