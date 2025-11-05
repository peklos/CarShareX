import { User } from '../../types';
import { API_URL, STORAGE_KEYS } from '../../utils/constants';
import { apiGet, apiPost, apiPatch, ApiResponse } from '../../utils/apiWrapper';

export interface UpdateProfileData {
  first_name: string;
  last_name: string;
  phone: string;
  drivers_license?: string;
}

export const profileApi = {
  // Get current user profile
  getProfile: async (): Promise<ApiResponse<User>> => {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    if (!userStr) return { data: null, error: 'User not authenticated' };
    const user = JSON.parse(userStr);

    return apiGet<User>(`${API_URL}/profile/${user.id}`);
  },

  // Update user profile
  updateProfile: async (data: UpdateProfileData): Promise<ApiResponse<User>> => {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    if (!userStr) return { data: null, error: 'User not authenticated' };
    const user = JSON.parse(userStr);

    return apiPatch<User>(`${API_URL}/profile/${user.id}`, data);
  },

  // Top up balance
  topUpBalance: async (amount: number): Promise<ApiResponse<User>> => {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    if (!userStr) return { data: null, error: 'User not authenticated' };
    const user = JSON.parse(userStr);

    return apiPost<User>(`${API_URL}/profile/${user.id}/top-up`, {
      amount: amount,
    });
  },
};
