import axios from 'axios';
import { API_URL } from '../../utils/constants';

// Backend response type
interface BackendDashboardStats {
  overview: {
    total_users: number;
    total_vehicles: number;
    total_bookings: number;
    total_revenue: number;
    monthly_revenue: number;
  };
  vehicles: {
    available: number;
    in_use: number;
    maintenance: number;
    by_type: {
      [key: string]: number;
    };
  };
  bookings: {
    active: number;
    completed: number;
    pending: number;
  };
  incidents: {
    total: number;
    reported: number;
    in_progress: number;
    resolved: number;
  };
  popular_vehicles: Array<{
    id: number;
    brand: string;
    model: string;
    license_plate: string;
    bookings_count: number;
  }>;
  active_users: Array<{
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    bookings_count: number;
  }>;
}

// Frontend expected type
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
    const response = await axios.get<BackendDashboardStats>(
      `${API_URL}/admin/stats/dashboard`
    );

    const data = response.data;

    // Transform backend data to frontend format
    return {
      overview: {
        total_users: data.overview.total_users,
        total_vehicles: data.overview.total_vehicles,
        total_bookings: data.overview.total_bookings,
        total_revenue: data.overview.total_revenue,
        active_bookings: data.bookings.active,
        available_vehicles: data.vehicles.available,
      },
      vehicles: {
        by_type: Object.entries(data.vehicles.by_type).map(([type, count]) => ({
          vehicle_type: type,
          count: count,
        })),
        by_status: [
          { status: 'available', count: data.vehicles.available },
          { status: 'in_use', count: data.vehicles.in_use },
          { status: 'maintenance', count: data.vehicles.maintenance },
        ],
      },
      bookings: {
        by_status: [
          { status: 'active', count: data.bookings.active },
          { status: 'completed', count: data.bookings.completed },
          { status: 'pending', count: data.bookings.pending },
        ],
        recent_count: data.bookings.active + data.bookings.pending,
      },
      popular_vehicles: data.popular_vehicles.map(v => ({
        id: v.id,
        brand: v.brand,
        model: v.model,
        license_plate: v.license_plate,
        booking_count: v.bookings_count,
      })),
      active_users: data.active_users.map(u => ({
        id: u.id,
        first_name: u.first_name,
        last_name: u.last_name,
        email: u.email,
        booking_count: u.bookings_count,
      })),
    };
  },
};
