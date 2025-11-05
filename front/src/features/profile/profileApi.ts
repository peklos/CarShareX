import axios from 'axios';
import { User } from '../../types';
import { API_URL, STORAGE_KEYS } from '../../utils/constants';

export interface UpdateProfileData {
  first_name: string;
  last_name: string;
  phone: string;
  drivers_license?: string;
}

export const profileApi = {
  // Get current user profile
  getProfile: async (): Promise<User> => {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    if (!userStr) throw new Error('User not authenticated');
    const user = JSON.parse(userStr);

    const response = await axios.get<User>(`${API_URL}/profile/${user.id}`);
    return response.data;
  },

  // Update user profile
  updateProfile: async (data: UpdateProfileData): Promise<User> => {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    if (!userStr) throw new Error('User not authenticated');
    const user = JSON.parse(userStr);

    const response = await axios.patch<User>(`${API_URL}/profile/${user.id}`, data);
    return response.data;
  },

  // Top up balance
  topUpBalance: async (amount: number): Promise<User> => {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    if (!userStr) throw new Error('User not authenticated');
    const user = JSON.parse(userStr);

    const response = await axios.post<User>(`${API_URL}/profile/${user.id}/top-up`, {
      amount: amount,
    });
    return response.data;
  },
};
