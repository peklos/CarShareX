// User types
export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  drivers_license?: string;
  balance: number;
}

export interface UserCreate {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  drivers_license?: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

// Employee types
export interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role_id: number;
  branch_id?: number;
}

export interface EmployeeLogin {
  email: string;
  password: string;
}

// Vehicle types
export interface Vehicle {
  id: number;
  license_plate: string;
  brand: string;
  model: string;
  vehicle_type: 'sedan' | 'suv' | 'electric' | 'hybrid';
  year?: number;
  color?: string;
  image_url?: string;
  description?: string;
  status: 'available' | 'in_use' | 'maintenance';
  parking_zone_id?: number;
  tariff_id?: number;
  tariff?: Tariff;
}

export interface VehicleFilters {
  type?: string;
  brand?: string;
  status?: string;
  tariff_id?: number;
  parking_zone_id?: number;
}

// Booking types
export interface Booking {
  id: number;
  user_id: number;
  vehicle_id: number;
  tariff_id: number;
  start_time: string;
  end_time?: string;
  duration_hours?: number;
  total_cost: number;
  status: 'pending' | 'active' | 'completed';
}

export interface BookingCreate {
  vehicle_id: number;
  tariff_id: number;
  start_time: string;
}

// Transaction types
export interface Transaction {
  id: number;
  user_id: number;
  booking_id?: number;
  transaction_type: 'payment' | 'deposit' | 'penalty';
  amount: number;
  description?: string;
  created_at?: string;
  status: 'completed' | 'pending' | 'failed';
}

// Tariff types
export interface Tariff {
  id: number;
  name: string;
  price_per_minute?: number;
  price_per_hour?: number;
}

// ParkingZone types
export interface ParkingZone {
  id: number;
  name: string;
  address: string;
  capacity: number;
}

// Incident types
export interface Incident {
  id: number;
  booking_id?: number;
  vehicle_id: number;
  user_id?: number;
  incident_type: string;
  description: string;
  status: 'reported' | 'in_progress' | 'resolved';
}

// Branch types
export interface Branch {
  id: number;
  name: string;
  address: string;
  phone?: string;
}

// Role types
export interface Role {
  id: number;
  name: string;
}

// API Response types
export interface ApiError {
  detail: string;
}

export interface LoginResponse {
  message: string;
  user: User;
}

export interface EmployeeLoginResponse {
  message: string;
  employee: Employee & { role?: string };
}

// Dashboard Stats types
export interface DashboardStats {
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
    by_type: Record<string, number>;
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
    name: string;
    email: string;
    trips_count: number;
    total_spent: number;
  }>;
}

export interface RevenueStats {
  daily_revenue_last_30_days: Array<{
    date: string;
    revenue: number;
  }>;
  revenue_by_tariff: Array<{
    tariff: string;
    revenue: number;
    bookings: number;
  }>;
}
