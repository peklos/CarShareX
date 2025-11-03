import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  ArrowLeftIcon,
  MapPinIcon,
  BoltIcon,
  TruckIcon,
  CalendarIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchVehicleById } from './vehiclesSlice';
import { createBooking } from '../bookings/bookingsSlice';
import Layout from '../../components/layout/Layout';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';
import { ROUTES } from '../../utils/constants';

const VehicleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { selectedVehicle: vehicle, loading } = useAppSelector((state) => state.vehicles);
  const { createLoading, createError } = useAppSelector((state) => state.bookings);
  const { isAuthenticated, role } = useAppSelector((state) => state.auth);

  // Separate fields for start date and time
  const [startDay, setStartDay] = useState('');
  const [startMonth, setStartMonth] = useState('');
  const [startHour, setStartHour] = useState('');
  const [startMinute, setStartMinute] = useState('');

  // Duration fields
  const [durationDays, setDurationDays] = useState('0');
  const [durationHours, setDurationHours] = useState('1');
  const [durationMinutes, setDurationMinutes] = useState('0');

  useEffect(() => {
    if (id) {
      dispatch(fetchVehicleById(Number(id)));
    }
  }, [dispatch, id]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error('Войдите в систему для бронирования');
      navigate(ROUTES.LOGIN);
      return;
    }

    if (role !== 'client') {
      toast.error('Только клиенты могут бронировать автомобили');
      return;
    }

    if (!vehicle) return;

    if (!vehicle.tariff_id) {
      toast.error('У автомобиля не установлен тариф');
      return;
    }

    // Validate all fields are filled
    if (!startDay || !startMonth || !startHour || !startMinute) {
      toast.error('Заполните все поля даты и времени начала');
      return;
    }

    // Validate ranges
    const day = parseInt(startDay);
    const month = parseInt(startMonth);
    const hour = parseInt(startHour);
    const minute = parseInt(startMinute);

    if (day < 1 || day > 31) {
      toast.error('День должен быть от 1 до 31');
      return;
    }

    if (month < 1 || month > 12) {
      toast.error('Месяц должен быть от 1 до 12');
      return;
    }

    if (hour < 0 || hour > 23) {
      toast.error('Часы должны быть от 0 до 23');
      return;
    }

    if (minute < 0 || minute > 59) {
      toast.error('Минуты должны быть от 0 до 59');
      return;
    }

    // Create start date from separate fields (auto-set year to 2025)
    const startDateTime = new Date(
      2025,
      month - 1, // Month is 0-indexed
      day,
      hour,
      minute
    );

    // Check if date is valid
    if (isNaN(startDateTime.getTime())) {
      toast.error('Неверная дата');
      return;
    }

    // Validate date is in the future
    if (startDateTime < new Date()) {
      toast.error('Дата начала должна быть в будущем');
      return;
    }

    try {
      await dispatch(
        createBooking({
          vehicle_id: vehicle.id,
          tariff_id: vehicle.tariff_id,
          start_time: startDateTime.toISOString(),
        })
      ).unwrap();

      toast.success('Бронирование создано успешно!');
      navigate(ROUTES.BOOKINGS);
    } catch (error: any) {
      toast.error(createError || 'Ошибка создания бронирования');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge variant="green">Доступен</Badge>;
      case 'in_use':
        return <Badge variant="orange">Занят</Badge>;
      case 'maintenance':
        return <Badge variant="red">Обслуживание</Badge>;
      default:
        return <Badge variant="gray">{status}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'electric':
        return <BoltIcon className="h-6 w-6" />;
      case 'hybrid':
        return <BoltIcon className="h-6 w-6 text-green-500" />;
      default:
        return <TruckIcon className="h-6 w-6" />;
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      sedan: 'Седан',
      suv: 'Внедорожник',
      electric: 'Электромобиль',
      hybrid: 'Гибрид',
      premium: 'Премиум',
      economy: 'Эконом',
      crossover: 'Кроссовер',
    };
    return labels[type] || type;
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

  if (!vehicle) {
    return (
      <Layout>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-neutral-300 mb-4">
            Автомобиль не найден
          </h2>
          <Link to={ROUTES.VEHICLES}>
            <Button variant="primary">Вернуться к каталогу</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        {/* Back button */}
        <Link
          to={ROUTES.VEHICLES}
          className="inline-flex items-center space-x-2 text-neutral-400 hover:text-primary-500 mb-6 transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          <span>Назад к каталогу</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Vehicle Image and Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="overflow-hidden">
              {/* Image */}
              <div className="relative h-64 lg:h-96 bg-neutral-800">
                {vehicle.image_url ? (
                  <img
                    src={vehicle.image_url}
                    alt={`${vehicle.brand} ${vehicle.model}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gradient-to-br from-neutral-100 to-neutral-200">
                    <TruckIcon className="h-24 w-24 text-neutral-400" />
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  {getStatusBadge(vehicle.status)}
                </div>
              </div>

              {/* Details */}
              <div className="p-6">
                <h1 className="text-3xl font-bold text-neutral-50 mb-2">
                  {vehicle.brand} {vehicle.model}
                </h1>

                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-2 text-neutral-400">
                    {getTypeIcon(vehicle.vehicle_type)}
                    <span className="font-medium">{getTypeLabel(vehicle.vehicle_type)}</span>
                  </div>
                  {vehicle.year && (
                    <span className="text-neutral-400">{vehicle.year} г.</span>
                  )}
                </div>

                {vehicle.description && (
                  <p className="text-neutral-400 mb-6">{vehicle.description}</p>
                )}

                <div className="space-y-3">
                  {vehicle.color && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-neutral-300">Цвет:</span>
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-6 h-6 rounded-full border-2 border-neutral-600"
                          style={{ backgroundColor: vehicle.color.toLowerCase() }}
                        />
                        <span className="text-sm text-neutral-400 capitalize">
                          {vehicle.color}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-neutral-300">Номер:</span>
                    <span className="text-sm font-mono font-bold text-neutral-50">
                      {vehicle.license_plate}
                    </span>
                  </div>

                  {vehicle.parking_zone_id && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-neutral-300">Парковка:</span>
                      <div className="flex items-center space-x-1 text-sm text-neutral-400">
                        <MapPinIcon className="h-4 w-4" />
                        <span>Зона {vehicle.parking_zone_id}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Booking Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-neutral-50 mb-6">
                  Забронировать автомобиль
                </h2>

                {vehicle.status !== 'available' ? (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <p className="text-yellow-800">
                      Этот автомобиль в данный момент недоступен для бронирования
                    </p>
                  </div>
                ) : !isAuthenticated ? (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <p className="text-blue-800 mb-4">
                      Войдите в систему, чтобы забронировать автомобиль
                    </p>
                    <Link to={ROUTES.LOGIN}>
                      <Button variant="primary" className="w-full">
                        Войти
                      </Button>
                    </Link>
                  </div>
                ) : role !== 'client' ? (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800">
                      Только клиенты могут бронировать автомобили
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleBooking} className="space-y-6">
                    {/* Start Date */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-3">
                        <div className="flex items-center space-x-2">
                          <CalendarIcon className="h-5 w-5 text-primary-500" />
                          <span>Дата и время начала</span>
                        </div>
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        <input
                          type="number"
                          placeholder="День"
                          min="1"
                          max="31"
                          maxLength={2}
                          value={startDay}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === '' || (parseInt(val) >= 1 && parseInt(val) <= 31 && val.length <= 2)) {
                              setStartDay(val);
                            }
                          }}
                          required
                          className="px-3 py-2 bg-neutral-800 text-neutral-50 border border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-center"
                        />
                        <input
                          type="number"
                          placeholder="Месяц"
                          min="1"
                          max="12"
                          maxLength={2}
                          value={startMonth}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === '' || (parseInt(val) >= 1 && parseInt(val) <= 12 && val.length <= 2)) {
                              setStartMonth(val);
                            }
                          }}
                          required
                          className="px-3 py-2 bg-neutral-800 text-neutral-50 border border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-center"
                        />
                        <input
                          type="number"
                          placeholder="Часы"
                          min="0"
                          max="23"
                          maxLength={2}
                          value={startHour}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === '' || (parseInt(val) >= 0 && parseInt(val) <= 23 && val.length <= 2)) {
                              setStartHour(val);
                            }
                          }}
                          required
                          className="px-3 py-2 bg-neutral-800 text-neutral-50 border border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-center"
                        />
                        <input
                          type="number"
                          placeholder="Минуты"
                          min="0"
                          max="59"
                          maxLength={2}
                          value={startMinute}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === '' || (parseInt(val) >= 0 && parseInt(val) <= 59 && val.length <= 2)) {
                              setStartMinute(val);
                            }
                          }}
                          required
                          className="px-3 py-2 bg-neutral-800 text-neutral-50 border border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-center"
                        />
                      </div>
                      <div className="mt-1 text-xs text-neutral-500">
                        День / Месяц / Часы / Минуты (год: 2025)
                      </div>
                    </div>

                    {/* Duration */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-3">
                        <div className="flex items-center space-x-2">
                          <ClockIcon className="h-5 w-5 text-primary-500" />
                          <span>Длительность бронирования</span>
                        </div>
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <input
                            type="number"
                            placeholder="Дни"
                            min="0"
                            max="30"
                            maxLength={2}
                            value={durationDays}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === '' || (parseInt(val) >= 0 && parseInt(val) <= 30 && val.length <= 2)) {
                                setDurationDays(val);
                              }
                            }}
                            className="w-full px-3 py-2 bg-neutral-800 text-neutral-50 border border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-center"
                          />
                          <div className="mt-1 text-xs text-neutral-500 text-center">дней</div>
                        </div>
                        <div>
                          <input
                            type="number"
                            placeholder="Часы"
                            min="0"
                            max="23"
                            maxLength={2}
                            value={durationHours}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === '' || (parseInt(val) >= 0 && parseInt(val) <= 23 && val.length <= 2)) {
                                setDurationHours(val);
                              }
                            }}
                            className="w-full px-3 py-2 bg-neutral-800 text-neutral-50 border border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-center"
                          />
                          <div className="mt-1 text-xs text-neutral-500 text-center">часов</div>
                        </div>
                        <div>
                          <input
                            type="number"
                            placeholder="Минуты"
                            min="0"
                            max="59"
                            maxLength={2}
                            value={durationMinutes}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === '' || (parseInt(val) >= 0 && parseInt(val) <= 59 && val.length <= 2)) {
                                setDurationMinutes(val);
                              }
                            }}
                            className="w-full px-3 py-2 bg-neutral-800 text-neutral-50 border border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-center"
                          />
                          <div className="mt-1 text-xs text-neutral-500 text-center">минут</div>
                        </div>
                      </div>
                    </div>

                    {createError && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-sm text-red-600">{createError}</p>
                      </div>
                    )}

                    <Button
                      type="submit"
                      variant="primary"
                      className="w-full"
                      loading={createLoading}
                    >
                      Забронировать
                    </Button>
                  </form>
                )}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default VehicleDetail;
