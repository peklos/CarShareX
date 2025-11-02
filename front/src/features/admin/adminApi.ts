import axios from 'axios';
import { API_URL } from '../../utils/constants';

export interface DashboardStats {
  overview: {
    total_users: number;
    total_vehicles: number;
    total_bookings: number;
    total_revenue: number;
    active_bookings: number;
    available_vehicles: number;
  };
  vehicles: {
    by_type: Array<{ vehicle_type: string; count: number }>;
    by_status: Array<{ status: string; count: number }>;
  };
  bookings: {
    by_status: Array<{ status: string; count: number }>;
    recent_count: number;
  };
  popular_vehicles: Array<{
    id: number;
    brand: string;
    model: string;
    license_plate: string;
    booking_count: number;
  }>;
  active_users: Array<{
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    booking_count: number;
  }>;
}

export const adminApi = {
  // Get dashboard statistics
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await axios.get<DashboardStats>(
      `${API_URL}/admin/stats/dashboard`
    );
    return response.data;
  },
};
