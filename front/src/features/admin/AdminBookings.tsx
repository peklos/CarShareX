import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import {
  CalendarIcon,
  MagnifyingGlassIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';
import { API_URL } from '../../utils/constants';
import { formatCurrency } from '../../utils/helpers';
import { Booking } from '../../types';

const AdminBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get<Booking[]>(`${API_URL}/admin/bookings/`);
      setBookings(response.data);
    } catch (error) {
      toast.error('Ошибка загрузки бронирований');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bookingId: number) => {
    if (!confirm('Вы уверены, что хотите удалить это бронирование?')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/admin/bookings/${bookingId}`);
      toast.success('Бронирование удалено');
      fetchBookings();
    } catch (error) {
      toast.error('Ошибка удаления бронирования');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="green">Активно</Badge>;
      case 'completed':
        return <Badge variant="gray">Завершено</Badge>;
      case 'pending':
        return <Badge variant="yellow">Ожидает</Badge>;
      default:
        return <Badge variant="gray">{status}</Badge>;
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredBookings = bookings.filter(
    (booking) =>
      booking.id.toString().includes(searchQuery) ||
      booking.user_id.toString().includes(searchQuery) ||
      booking.vehicle_id.toString().includes(searchQuery)
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
          <div className="flex items-center space-x-3 mb-4">
            <CalendarIcon className="h-8 w-8 text-primary-500" />
            <h1 className="text-3xl md:text-4xl font-bold text-gradient">
              Управление бронированиями
            </h1>
          </div>
          <p className="text-neutral-400">
            Всего бронирований: <span className="font-semibold">{bookings.length}</span>
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
              placeholder="Поиск по ID бронирования, пользователя или автомобиля..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </motion.div>

        {/* Таблица */}
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
                      ID пользователя
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-neutral-300">
                      ID автомобиля
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-neutral-300">
                      Начало
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-neutral-300">
                      Окончание
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-neutral-300">
                      Статус
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-neutral-300">
                      Стоимость
                    </th>
                    <th className="text-right py-4 px-6 text-sm font-semibold text-neutral-300">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-neutral-900 transition-colors">
                      <td className="py-4 px-6 text-sm text-neutral-50">
                        #{booking.id}
                      </td>
                      <td className="py-4 px-6 text-sm text-neutral-400">
                        #{booking.user_id}
                      </td>
                      <td className="py-4 px-6 text-sm text-neutral-400">
                        #{booking.vehicle_id}
                      </td>
                      <td className="py-4 px-6 text-sm text-neutral-400">
                        {formatDateTime(booking.start_datetime)}
                      </td>
                      <td className="py-4 px-6 text-sm text-neutral-400">
                        {booking.end_datetime ? formatDateTime(booking.end_datetime) : '—'}
                      </td>
                      <td className="py-4 px-6">{getStatusBadge(booking.status)}</td>
                      <td className="py-4 px-6">
                        {booking.total_cost !== undefined ? (
                          <span className="text-sm font-semibold text-green-600">
                            {formatCurrency(booking.total_cost)}
                          </span>
                        ) : (
                          <span className="text-sm text-neutral-400">—</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleDelete(booking.id)}
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

              {filteredBookings.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-neutral-400">Бронирования не найдены</p>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default AdminBookings;
