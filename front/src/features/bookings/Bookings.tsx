import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarIcon, TruckIcon, ClockIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchUserBookings } from './bookingsSlice';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';
import { formatCurrency } from '../../utils/helpers';
import { ROUTES } from '../../utils/constants';

const Bookings: React.FC = () => {
  const dispatch = useAppDispatch();
  const { bookings, loading, error } = useAppSelector((state) => state.bookings);

  useEffect(() => {
    dispatch(fetchUserBookings());
  }, [dispatch]);

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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const calculateDuration = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const hours = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60));
    return hours;
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

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-3 mb-2">
            <CalendarIcon className="h-8 w-8 text-primary-500" />
            <h1 className="text-3xl md:text-4xl font-bold text-gradient">
              Мои бронирования
            </h1>
          </div>
          <p className="text-neutral-400">
            История и активные бронирования автомобилей
          </p>
        </motion.div>

        {/* Error state */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Bookings count */}
        {!loading && bookings.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-neutral-400">
              Всего бронирований: <span className="font-semibold">{bookings.length}</span>
            </p>
          </div>
        )}

        {/* Bookings list */}
        {!loading && bookings.length > 0 && (
          <div className="space-y-4">
            {bookings.map((booking, index) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                      {/* Main info */}
                      <div className="flex-1 mb-4 lg:mb-0">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center space-x-2 mb-2">
                              <TruckIcon className="h-5 w-5 text-primary-500" />
                              <h3 className="text-lg font-bold text-neutral-50">
                                Бронирование #{booking.id}
                              </h3>
                            </div>
                            {getStatusBadge(booking.status)}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          {/* Start date */}
                          <div className="flex items-start space-x-2">
                            <CalendarIcon className="h-5 w-5 text-neutral-400 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-neutral-400">Начало:</p>
                              <p className="text-neutral-50 font-medium">
                                {formatDateTime(booking.start_time)}
                              </p>
                            </div>
                          </div>

                          {/* End date */}
                          <div className="flex items-start space-x-2">
                            <ClockIcon className="h-5 w-5 text-neutral-400 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-neutral-400">Окончание:</p>
                              <p className="text-neutral-50 font-medium">
                                {booking.end_time
                                  ? formatDateTime(booking.end_time)
                                  : booking.duration_hours
                                    ? (() => {
                                        const startDate = new Date(booking.start_time);
                                        const estimatedEnd = new Date(startDate.getTime() + booking.duration_hours * 60 * 60 * 1000);
                                        return `${formatDateTime(estimatedEnd)} (ожидается)`;
                                      })()
                                    : 'В процессе'}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center space-x-4 text-sm">
                          {booking.end_time && (
                            <div className="flex items-center space-x-1 text-neutral-400">
                              <ClockIcon className="h-4 w-4" />
                              <span>
                                Длительность: {calculateDuration(booking.start_time, booking.end_time)} ч.
                              </span>
                            </div>
                          )}
                          {booking.total_cost !== undefined && (
                            <div className="flex items-center space-x-1 text-neutral-400">
                              <CurrencyDollarIcon className="h-4 w-4" />
                              <span className="font-semibold">
                                {formatCurrency(booking.total_cost)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col space-y-2 lg:ml-6">
                        <Link
                          to={`${ROUTES.VEHICLES}/${booking.vehicle_id}`}
                          className="px-4 py-2 bg-primary-900 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors text-center text-sm font-medium"
                        >
                          Посмотреть автомобиль
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && bookings.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <CalendarIcon className="h-24 w-24 text-neutral-300 mb-4" />
            <h3 className="text-xl font-semibold text-neutral-300 mb-2">
              У вас пока нет бронирований
            </h3>
            <p className="text-neutral-400 mb-6">
              Выберите автомобиль из каталога и забронируйте его
            </p>
            <Link to={ROUTES.VEHICLES}>
              <button className="px-6 py-3 bg-primary-9000 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium">
                Посмотреть автомобили
              </button>
            </Link>
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

export default Bookings;
