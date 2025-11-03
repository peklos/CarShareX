import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import {
  UserGroupIcon,
  MagnifyingGlassIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';
import { API_URL } from '../../utils/constants';
import { formatCurrency } from '../../utils/helpers';
import { User } from '../../types';

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get<User[]>(`${API_URL}/admin/users/`);
      setUsers(response.data);
    } catch (error) {
      toast.error('Ошибка загрузки пользователей');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/admin/users/${userId}`);
      toast.success('Пользователь удален');
      fetchUsers();
    } catch (error) {
      toast.error('Ошибка удаления пользователя');
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery)
  );

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center py-20">
          <Spinner size="lg" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Заголовок */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <UserGroupIcon className="h-8 w-8 text-primary-500" />
              <h1 className="text-3xl md:text-4xl font-bold text-gradient">
                Управление пользователями
              </h1>
            </div>
          </div>
          <p className="text-neutral-400">
            Всего пользователей: <span className="font-semibold">{users.length}</span>
          </p>
        </motion.div>

        {/* Поиск */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Поиск по имени, email или телефону..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </motion.div>

        {/* Таблица пользователей */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-neutral-900">
                  <tr>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-neutral-300">
                      ID
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-neutral-300">
                      Имя
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-neutral-300">
                      Email
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-neutral-300">
                      Телефон
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-neutral-300">
                      Баланс
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-neutral-300">
                      Вод. удостоверение
                    </th>
                    <th className="text-right py-4 px-6 text-sm font-semibold text-neutral-300">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-neutral-900 transition-colors"
                    >
                      <td className="py-4 px-6 text-sm text-neutral-50">
                        #{user.id}
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-medium text-neutral-50">
                          {user.first_name} {user.last_name}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-neutral-400">
                        {user.email}
                      </td>
                      <td className="py-4 px-6 text-sm text-neutral-400">
                        {user.phone}
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm font-semibold text-green-600">
                          {formatCurrency(user.balance)}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-neutral-400">
                        {user.drivers_license || (
                          <span className="text-neutral-400">Не указано</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Удалить"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredUsers.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-neutral-400">Пользователи не найдены</p>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default AdminUsers;
