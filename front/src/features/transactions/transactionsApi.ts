import axios from 'axios';
import { Transaction } from '../../types';
import { API_URL, STORAGE_KEYS } from '../../utils/constants';

export interface CreateTransactionData {
  transaction_type: 'deposit' | 'payment' | 'penalty';
  amount: number;
  description?: string;
}

export const transactionsApi = {
  // Get all user transactions
  getUserTransactions: async (): Promise<Transaction[]> => {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    if (!userStr) throw new Error('User not authenticated');
    const user = JSON.parse(userStr);

    const response = await axios.get<Transaction[]>(
      `${API_URL}/transactions/user/${user.id}`
    );
    return response.data;
  },

  // Create new transaction (deposit)
  createTransaction: async (data: CreateTransactionData): Promise<Transaction> => {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    if (!userStr) throw new Error('User not authenticated');
    const user = JSON.parse(userStr);

    const response = await axios.post<Transaction>(`${API_URL}/transactions/`, {
      user_id: user.id,
      ...data,
    });
    return response.data;
  },
};
