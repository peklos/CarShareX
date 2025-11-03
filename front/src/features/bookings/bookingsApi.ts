import axios from 'axios';
import { Booking } from '../../types';
import { API_URL, STORAGE_KEYS } from '../../utils/constants';

export interface CreateBookingData {
  vehicle_id: number;
  tariff_id: number;
  start_time: string; // ISO datetime format
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

    // Backend expects user_id as query param, booking data in body
    const response = await axios.post<Booking>(
      `${API_URL}/bookings/?user_id=${user.id}`,
      data
    );
    return response.data;
  },

  // Complete booking
  completeBooking: async (id: number, end_time: string, total_cost: number): Promise<Booking> => {
    // Backend expects PATCH with complete_data in body
    const response = await axios.patch<Booking>(
      `${API_URL}/bookings/${id}/complete`,
      {
        end_time,
        total_cost,
      }
    );
    return response.data;
  },
};
