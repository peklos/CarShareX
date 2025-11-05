import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import {
  ArrowLeftIcon,
  MapPinIcon,
  BoltIcon,
  TruckIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchVehicleById } from './vehiclesSlice';
import { createBooking } from '../bookings/bookingsSlice';
import { refreshUserProfile } from '../auth/authSlice';
import Layout from '../../components/layout/Layout';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';
import { ROUTES, API_URL } from '../../utils/constants';
import { Tariff } from '../../types';

const VehicleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { selectedVehicle: vehicle, loading } = useAppSelector((state) => state.vehicles);
  const { createLoading, createError } = useAppSelector((state) => state.bookings);
  const { isAuthenticated, role } = useAppSelector((state) => state.auth);

  // Tariffs state
  const [tariffs, setTariffs] = useState<Tariff[]>([]);
  const [selectedTariffId, setSelectedTariffId] = useState<number | null>(null);
  const [loadingTariffs, setLoadingTariffs] = useState(false);

  // Поля для даты начала
  const [startDay, setStartDay] = useState('');
  const [startMonth, setStartMonth] = useState('');
  const [startYear, setStartYear] = useState('2025');

  // Поля для даты окончания
  const [endDay, setEndDay] = useState('');
  const [endMonth, setEndMonth] = useState('');
  const [endYear, setEndYear] = useState('2025');

  // Calculated cost
  const [estimatedCost, setEstimatedCost] = useState(0);
  const [calculatingCost, setCalculatingCost] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchVehicleById(Number(id)));
    }
  }, [dispatch, id]);

  // Load tariffs
  useEffect(() => {
    const loadTariffs = async () => {
      setLoadingTariffs(true);
      try {
        const response = await axios.get<Tariff[]>(`${API_URL}/tariffs/`);
        setTariffs(response.data);

        // Set default tariff to vehicle's tariff or first tariff
        if (vehicle?.tariff_id) {
          setSelectedTariffId(vehicle.tariff_id);
        } else if (response.data.length > 0) {
          setSelectedTariffId(response.data[0].id);
        }
      } catch (error) {
        console.error('Failed to load tariffs:', error);
        toast.error('Не удалось загрузить тарифы');
      } finally {
        setLoadingTariffs(false);
      }
    };

    loadTariffs();
  }, [vehicle?.tariff_id]);

  // Calculate estimated cost using API
  useEffect(() => {
    if (!selectedTariffId) return;

    // Проверяем, что все поля дат заполнены
    if (!startDay || !startMonth || !startYear || !endDay || !endMonth || !endYear) {
      setEstimatedCost(0);
      return;
    }

    // Создаем строки дат в формате YYYY-MM-DD
    const startDate = `${startYear}-${startMonth.padStart(2, '0')}-${startDay.padStart(2, '0')}`;
    const endDate = `${endYear}-${endMonth.padStart(2, '0')}-${endDay.padStart(2, '0')}`;

    // Проверяем валидность дат
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
      setEstimatedCost(0);
      return;
    }

    const calculateCost = async () => {
      setCalculatingCost(true);
      try {
        const response = await axios.post(`${API_URL}/bookings/calculate-cost`, {
          tariff_id: selectedTariffId,
          start_date: startDate,
          end_date: endDate,
        });
        setEstimatedCost(response.data.total_cost);
      } catch (error) {
        console.error('Failed to calculate cost:', error);
        setEstimatedCost(0);
      } finally {
        setCalculatingCost(false);
      }
    };

    const debounceTimer = setTimeout(calculateCost, 300);
    return () => clearTimeout(debounceTimer);
  }, [startDay, startMonth, startYear, endDay, endMonth, endYear, selectedTariffId]);

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

    if (!selectedTariffId) {
      toast.error('Выберите тариф');
      return;
    }

    // Validate all fields are filled
    if (!startDay || !startMonth || !startYear || !endDay || !endMonth || !endYear) {
      toast.error('Заполните все поля дат начала и окончания');
      return;
    }

    // Validate ranges
    const sDay = parseInt(startDay);
    const sMonth = parseInt(startMonth);
    const sYear = parseInt(startYear);
    const eDay = parseInt(endDay);
    const eMonth = parseInt(endMonth);
    const eYear = parseInt(endYear);

    if (sDay < 1 || sDay > 31 || eDay < 1 || eDay > 31) {
      toast.error('День должен быть от 1 до 31');
      return;
    }

    if (sMonth < 1 || sMonth > 12 || eMonth < 1 || eMonth > 12) {
      toast.error('Месяц должен быть от 1 до 12');
      return;
    }

    if (sYear < 2025 || sYear > 2030 || eYear < 2025 || eYear > 2030) {
      toast.error('Год должен быть от 2025 до 2030');
      return;
    }

    // Create date strings in YYYY-MM-DD format
    const startDate = `${sYear}-${sMonth.toString().padStart(2, '0')}-${sDay.toString().padStart(2, '0')}`;
    const endDate = `${eYear}-${eMonth.toString().padStart(2, '0')}-${eDay.toString().padStart(2, '0')}`;

    // Check if dates are valid
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      toast.error('Неверная дата');
      return;
    }

    // Validate end date is after start date
    if (end <= start) {
      toast.error('Дата окончания должна быть позже даты начала');
      return;
    }

    // Validate start date is in the future
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (start < today) {
      toast.error('Дата начала должна быть не раньше сегодняшнего дня');
      return;
    }

    try {
      await dispatch(
        createBooking({
          vehicle_id: vehicle.id,
          tariff_id: selectedTariffId,
          start_date: startDate,
          end_date: endDate,
        })
      ).unwrap();

      // Обновляем данные пользователя с сервера (включая баланс)
      await dispatch(refreshUserProfile()).unwrap();

      toast.success(`Бронирование создано! Списано ${estimatedCost.toFixed(2)} ₽`);
      navigate(ROUTES.BOOKINGS);
    } catch (error: any) {
      // Ошибка уже обработана в slice и доступна через createError
      console.error('Booking error:', error);
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
                <img
                  src="/car.png"
                  alt={`${vehicle.brand} ${vehicle.model}`}
                  className="w-full h-full object-cover"
                  loading="eager"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
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
                    {/* Tariff Selection */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-3">
                        Выберите тариф
                      </label>
                      {loadingTariffs ? (
                        <div className="text-center py-4">
                          <span className="text-neutral-400">Загрузка тарифов...</span>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-2">
                          {tariffs.map((tariff) => (
                            <label
                              key={tariff.id}
                              className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                                selectedTariffId === tariff.id
                                  ? 'border-primary-500 bg-primary-500/10'
                                  : 'border-neutral-600 hover:border-neutral-500'
                              }`}
                            >
                              <div className="flex items-center space-x-3">
                                <input
                                  type="radio"
                                  name="tariff"
                                  value={tariff.id}
                                  checked={selectedTariffId === tariff.id}
                                  onChange={() => setSelectedTariffId(tariff.id)}
                                  className="w-4 h-4 text-primary-500 focus:ring-primary-500"
                                />
                                <div>
                                  <p className="font-medium text-neutral-50">{tariff.name}</p>
                                  <p className="text-xs text-neutral-400">
                                    {tariff.price_per_hour
                                      ? `${tariff.price_per_hour} ₽/час`
                                      : tariff.price_per_minute
                                        ? `${tariff.price_per_minute} ₽/мин`
                                        : 'Цена не указана'}
                                  </p>
                                </div>
                              </div>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Дата начала */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-3">
                        <div className="flex items-center space-x-2">
                          <CalendarIcon className="h-5 w-5 text-primary-500" />
                          <span>Дата начала</span>
                        </div>
                      </label>
                      <div className="grid grid-cols-3 gap-2">
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
                          placeholder="Год"
                          min="2025"
                          max="2030"
                          maxLength={4}
                          value={startYear}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === '' || (parseInt(val) >= 2025 && parseInt(val) <= 2030 && val.length <= 4)) {
                              setStartYear(val);
                            }
                          }}
                          required
                          className="px-3 py-2 bg-neutral-800 text-neutral-50 border border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-center"
                        />
                      </div>
                      <div className="mt-1 text-xs text-neutral-500">
                        День / Месяц / Год
                      </div>
                    </div>

                    {/* Дата окончания */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-3">
                        <div className="flex items-center space-x-2">
                          <CalendarIcon className="h-5 w-5 text-primary-500" />
                          <span>Дата окончания</span>
                        </div>
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="number"
                          placeholder="День"
                          min="1"
                          max="31"
                          maxLength={2}
                          value={endDay}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === '' || (parseInt(val) >= 1 && parseInt(val) <= 31 && val.length <= 2)) {
                              setEndDay(val);
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
                          value={endMonth}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === '' || (parseInt(val) >= 1 && parseInt(val) <= 12 && val.length <= 2)) {
                              setEndMonth(val);
                            }
                          }}
                          required
                          className="px-3 py-2 bg-neutral-800 text-neutral-50 border border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-center"
                        />
                        <input
                          type="number"
                          placeholder="Год"
                          min="2025"
                          max="2030"
                          maxLength={4}
                          value={endYear}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === '' || (parseInt(val) >= 2025 && parseInt(val) <= 2030 && val.length <= 4)) {
                              setEndYear(val);
                            }
                          }}
                          required
                          className="px-3 py-2 bg-neutral-800 text-neutral-50 border border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-center"
                        />
                      </div>
                      <div className="mt-1 text-xs text-neutral-500">
                        День / Месяц / Год
                      </div>
                    </div>

                    {/* Estimated Cost */}
                    {selectedTariffId && (
                      <div className="bg-primary-500/10 border border-primary-500/30 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-neutral-300">Стоимость бронирования:</span>
                          {calculatingCost ? (
                            <span className="text-lg text-neutral-400">Расчет...</span>
                          ) : (
                            <span className="text-2xl font-bold text-primary-500">
                              {estimatedCost.toFixed(2)} ₽
                            </span>
                          )}
                        </div>
                        {tariffs.find(t => t.id === selectedTariffId)?.price_per_hour && (
                          <p className="text-xs text-neutral-400 mt-1">
                            Тариф: {(tariffs.find(t => t.id === selectedTariffId)?.price_per_hour! * 24).toFixed(2)} ₽/день (посуточная аренда)
                          </p>
                        )}
                        {tariffs.find(t => t.id === selectedTariffId)?.price_per_minute && !tariffs.find(t => t.id === selectedTariffId)?.price_per_hour && (
                          <p className="text-xs text-neutral-400 mt-1">
                            Тариф: {(tariffs.find(t => t.id === selectedTariffId)?.price_per_minute! * 1440).toFixed(2)} ₽/день (посуточная аренда)
                          </p>
                        )}
                      </div>
                    )}

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
