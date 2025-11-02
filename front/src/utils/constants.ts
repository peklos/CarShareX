// API Base URL
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Local Storage Keys
export const STORAGE_KEYS = {
  USER: 'carsharex_user',
  TOKEN: 'carsharex_token',
  ROLE: 'carsharex_role',
} as const;

// Vehicle Types
export const VEHICLE_TYPES = [
  { value: 'sedan', label: 'Седан' },
  { value: 'suv', label: 'Кроссовер' },
  { value: 'electric', label: 'Электромобиль' },
  { value: 'hybrid', label: 'Гибрид' },
] as const;

// Vehicle Status
export const VEHICLE_STATUS = {
  available: 'Доступен',
  in_use: 'Используется',
  maintenance: 'На обслуживании',
} as const;

// Booking Status
export const BOOKING_STATUS = {
  pending: 'Ожидает',
  active: 'Активно',
  completed: 'Завершено',
} as const;

// Transaction Types
export const TRANSACTION_TYPES = {
  payment: 'Оплата',
  deposit: 'Пополнение',
  penalty: 'Штраф',
} as const;

// Incident Status
export const INCIDENT_STATUS = {
  reported: 'Сообщено',
  in_progress: 'В работе',
  resolved: 'Решено',
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  VEHICLES: '/vehicles',
  VEHICLE_DETAIL: '/vehicles/:id',
  PROFILE: '/profile',
  BOOKINGS: '/bookings',
  BOOKING_NEW: '/bookings/new',
  BOOKING_DETAIL: '/bookings/:id',
  TRANSACTIONS: '/transactions',
  ADMIN: '/admin',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USERS: '/admin/users',
  ADMIN_VEHICLES: '/admin/vehicles',
  ADMIN_BOOKINGS: '/admin/bookings',
  ADMIN_INCIDENTS: '/admin/incidents',
  ADMIN_EMPLOYEES: '/admin/employees',
  ADMIN_TARIFFS: '/admin/tariffs',
  ADMIN_PARKING: '/admin/parking',
  ADMIN_BRANCHES: '/admin/branches',
} as const;

// Colors for status badges
export const STATUS_COLORS = {
  available: 'green',
  in_use: 'orange',
  maintenance: 'red',
  pending: 'yellow',
  active: 'blue',
  completed: 'green',
  reported: 'red',
  in_progress: 'yellow',
  resolved: 'green',
} as const;
