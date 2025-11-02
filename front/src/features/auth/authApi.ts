import api from '../../utils/api';
import { UserCreate, UserLogin, LoginResponse, EmployeeLogin, EmployeeLoginResponse } from '../../types';

// Client Auth API
export const authApi = {
  register: async (userData: UserCreate): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/register', userData);
    return response.data;
  },

  login: async (credentials: UserLogin): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  },

  getMe: async (userId: number) => {
    const response = await api.get(`/auth/me/${userId}`);
    return response.data;
  },
};

// Employee Auth API
export const employeeAuthApi = {
  login: async (credentials: EmployeeLogin): Promise<EmployeeLoginResponse> => {
    const response = await api.post<EmployeeLoginResponse>('/admin/auth/login', credentials);
    return response.data;
  },

  getMe: async (employeeId: number) => {
    const response = await api.get(`/admin/auth/me/${employeeId}`);
    return response.data;
  },
};
