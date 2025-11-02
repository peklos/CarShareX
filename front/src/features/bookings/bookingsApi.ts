import axios from 'axios';
import { Booking } from '../../types';
import { API_URL, STORAGE_KEYS } from '../../utils/constants';

export interface CreateBookingData {
  vehicle_id: number;
  start_datetime: string; // ISO format
  end_datetime: string; // ISO format
}

export const bookingsApi = {
  // Get all user bookings
  getUserBookings: async (): Promise<Booking[]> => {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    if (!userStr) throw new Error('User not authenticated');
    const user = JSON.parse(userStr);

    const response = await axios.get<Booking[]>(
      `${API_URL}/bookings/user/${user.id}`
    );
    return response.data;
  },

  // Get booking by ID
  getBookingById: async (id: number): Promise<Booking> => {
    const response = await axios.get<Booking>(`${API_URL}/bookings/${id}`);
    return response.data;
  },

  // Create new booking
  createBooking: async (data: CreateBookingData): Promise<Booking> => {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    if (!userStr) throw new Error('User not authenticated');
    const user = JSON.parse(userStr);

    const response = await axios.post<Booking>(`${API_URL}/bookings/`, {
      user_id: user.id,
      ...data,
    });
    return response.data;
  },

  // Complete booking
  completeBooking: async (id: number): Promise<Booking> => {
    const response = await axios.put<Booking>(
      `${API_URL}/bookings/${id}/complete`
    );
    return response.data;
  },
};
