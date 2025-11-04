import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  UserGroupIcon,
  TruckIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { adminApi, DashboardStats } from './adminApi';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';
import StatCard from './StatCard';
import { formatCurrency } from '../../utils/helpers';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getDashboardStats();
      setStats(data);
    } catch (err: any) {
      setError('Ошибка загрузки статистики');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center py-20">
          <Spinner size="lg" />
        </div>
      </Layout>
    );
  }

  if (error || !stats) {
    return (
      <Layout>
        <div className="text-center py-20">
          <p className="text-red-600">{error || 'Не удалось загрузить статистику'}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-3 mb-2">
            <ChartBarIcon className="h-8 w-8 text-primary-500" />
            <h1 className="text-3xl md:text-4xl font-bold text-gradient">
              Панель управления
            </h1>
          </div>
          <p className="text-neutral-400">Обзор статистики и аналитика</p>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Всего пользователей"
            value={stats.overview.total_users}
            icon={<UserGroupIcon className="h-6 w-6" />}
            color="blue"
          />
          <StatCard
            title="Всего автомобилей"
            value={stats.overview.total_vehicles}
            icon={<TruckIcon className="h-6 w-6" />}
            color="primary"
          />
          <StatCard
            title="Всего бронирований"
            value={stats.overview.total_bookings}
            icon={<CalendarIcon className="h-6 w-6" />}
            color="green"
          />
          <StatCard
            title="Активные бронирования"
            value={stats.overview.active_bookings}
            icon={<CheckCircleIcon className="h-6 w-6" />}
            color="orange"
          />
          <StatCard
            title="Доступные автомобили"
            value={stats.overview.available_vehicles}
            icon={<TruckIcon className="h-6 w-6" />}
            color="green"
          />
          <StatCard
            title="Общий доход"
            value={formatCurrency(stats.overview.total_revenue)}
            icon={<CurrencyDollarIcon className="h-6 w-6" />}
            color="primary"
          />
        </div>

        {/* Charts and Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Vehicles by Type */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-bold text-neutral-50 mb-4">
                  Автомобили по типам
                </h3>
                <div className="space-y-3">
                  {stats.vehicles.by_type.map((item) => (
                    <div key={item.vehicle_type} className="flex items-center justify-between">
                      <span className="text-sm text-neutral-400 capitalize">
                        {item.vehicle_type}
                      </span>
                      <span className="text-sm font-bold text-neutral-50">
                        {item.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Vehicles by Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-bold text-neutral-50 mb-4">
                  Статус автомобилей
                </h3>
                <div className="space-y-3">
                  {stats.vehicles.by_status.map((item) => (
                    <div key={item.status} className="flex items-center justify-between">
                      <span className="text-sm text-neutral-400 capitalize">
                        {item.status === 'available' ? 'Доступен' :
                         item.status === 'in_use' ? 'Используется' :
                         item.status === 'maintenance' ? 'Обслуживание' : item.status}
                      </span>
                      <span className="text-sm font-bold text-neutral-50">
                        {item.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Popular Vehicles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-bold text-neutral-50 mb-4">
                Популярные автомобили
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-neutral-700">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-300">
                        Автомобиль
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-300">
                        Номер
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-neutral-300">
                        Бронирований
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.popular_vehicles.map((vehicle) => (
                      <tr key={vehicle.id} className="border-b border-neutral-800">
                        <td className="py-3 px-4 text-sm text-neutral-50">
                          {vehicle.brand} {vehicle.model}
                        </td>
                        <td className="py-3 px-4 text-sm text-neutral-400 font-mono">
                          {vehicle.license_plate}
                        </td>
                        <td className="py-3 px-4 text-sm text-neutral-50 text-right font-semibold">
                          {vehicle.booking_count}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Active Users */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-bold text-neutral-50 mb-4">
                Активные пользователи
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-neutral-700">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-300">
                        Имя
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-300">
                        Email
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-neutral-300">
                        Бронирований
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.active_users.map((user) => (
                      <tr key={user.id} className="border-b border-neutral-800">
                        <td className="py-3 px-4 text-sm text-neutral-50">
                          {user.first_name} {user.last_name}
                        </td>
                        <td className="py-3 px-4 text-sm text-neutral-400">
                          {user.email}
                        </td>
                        <td className="py-3 px-4 text-sm text-neutral-50 text-right font-semibold">
                          {user.booking_count}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
