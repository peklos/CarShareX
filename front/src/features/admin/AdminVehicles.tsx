import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import {
  TruckIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { API_URL } from '../../utils/constants';
import { Vehicle } from '../../types';

interface VehicleFormData {
  license_plate: string;
  brand: string;
  model: string;
  vehicle_type: string;
  year: number;
  color: string;
  image_url: string;
  description: string;
  status: string;
  parking_zone_id: number;
  tariff_id: number;
}

const AdminVehicles: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [formData, setFormData] = useState<VehicleFormData>({
    license_plate: '',
    brand: '',
    model: '',
    vehicle_type: 'sedan',
    year: new Date().getFullYear(),
    color: '',
    image_url: '',
    description: '',
    status: 'available',
    parking_zone_id: 1,
    tariff_id: 1,
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response = await axios.get<Vehicle[]>(`${API_URL}/admin/vehicles/`);
      setVehicles(response.data);
    } catch (error) {
      toast.error('Ошибка загрузки автомобилей');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingVehicle) {
        // Обновление
        await axios.put(`${API_URL}/admin/vehicles/${editingVehicle.id}`, formData);
        toast.success('Автомобиль обновлен');
      } else {
        // Создание
        await axios.post(`${API_URL}/admin/vehicles/`, formData);
        toast.success('Автомобиль добавлен');
      }
      setShowModal(false);
      setEditingVehicle(null);
      resetForm();
      fetchVehicles();
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Ошибка сохранения';
      toast.error(message);
    }
  };

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      license_plate: vehicle.license_plate,
      brand: vehicle.brand,
      model: vehicle.model,
      vehicle_type: vehicle.vehicle_type,
      year: vehicle.year || new Date().getFullYear(),
      color: vehicle.color || '',
      image_url: vehicle.image_url || '',
      description: vehicle.description || '',
      status: vehicle.status,
      parking_zone_id: vehicle.parking_zone_id || 1,
      tariff_id: vehicle.tariff_id || 1,
    });
    setShowModal(true);
  };

  const handleDelete = async (vehicleId: number) => {
    if (!confirm('Вы уверены, что хотите удалить этот автомобиль?')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/admin/vehicles/${vehicleId}`);
      toast.success('Автомобиль удален');
      fetchVehicles();
    } catch (error) {
      toast.error('Ошибка удаления автомобиля');
    }
  };

  const resetForm = () => {
    setFormData({
      license_plate: '',
      brand: '',
      model: '',
      vehicle_type: 'sedan',
      year: new Date().getFullYear(),
      color: '',
      image_url: '',
      description: '',
      status: 'available',
      parking_zone_id: 1,
      tariff_id: 1,
    });
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

  const filteredVehicles = vehicles.filter(
    (vehicle) =>
      vehicle.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.license_plate.toLowerCase().includes(searchQuery.toLowerCase())
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
              <TruckIcon className="h-8 w-8 text-primary-500" />
              <h1 className="text-3xl md:text-4xl font-bold text-gradient">
                Управление автомобилями
              </h1>
            </div>
            <Button
              variant="primary"
              onClick={() => {
                setEditingVehicle(null);
                resetForm();
                setShowModal(true);
              }}
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Добавить автомобиль
            </Button>
          </div>
          <p className="text-neutral-400">
            Всего автомобилей: <span className="font-semibold">{vehicles.length}</span>
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
              placeholder="Поиск по марке, модели или номеру..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-neutral-800 text-neutral-50 border border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                      Автомобиль
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-neutral-300">
                      Номер
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-neutral-300">
                      Тип
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-neutral-300">
                      Статус
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-neutral-300">
                      Год
                    </th>
                    <th className="text-right py-4 px-6 text-sm font-semibold text-neutral-300">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {filteredVehicles.map((vehicle) => (
                    <tr key={vehicle.id} className="hover:bg-neutral-900 transition-colors">
                      <td className="py-4 px-6 text-sm text-neutral-50">
                        #{vehicle.id}
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-medium text-neutral-50">
                          {vehicle.brand} {vehicle.model}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-mono text-sm text-neutral-400">
                          {vehicle.license_plate}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-neutral-400 capitalize">
                        {vehicle.vehicle_type}
                      </td>
                      <td className="py-4 px-6">{getStatusBadge(vehicle.status)}</td>
                      <td className="py-4 px-6 text-sm text-neutral-400">
                        {vehicle.year || '—'}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(vehicle)}
                            className="p-2 text-primary-600 hover:bg-primary-900 rounded-lg transition-colors"
                            title="Редактировать"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(vehicle.id)}
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

              {filteredVehicles.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-neutral-400">Автомобили не найдены</p>
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Модалка добавления/редактирования */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-neutral-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-neutral-800 border-b border-neutral-700 px-6 py-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-neutral-50">
                  {editingVehicle ? 'Редактировать автомобиль' : 'Добавить автомобиль'}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingVehicle(null);
                    resetForm();
                  }}
                  className="p-2 hover:bg-neutral-700 rounded-lg transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Марка"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    required
                    placeholder="Toyota"
                  />

                  <Input
                    label="Модель"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    required
                    placeholder="Camry"
                  />
                </div>

                <Input
                  label="Гос. номер"
                  value={formData.license_plate}
                  onChange={(e) => setFormData({ ...formData, license_plate: e.target.value })}
                  required
                  placeholder="А123БВ777"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                      Тип автомобиля
                    </label>
                    <select
                      value={formData.vehicle_type}
                      onChange={(e) => setFormData({ ...formData, vehicle_type: e.target.value })}
                      className="w-full px-4 py-2 bg-neutral-800 text-neutral-50 border border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    >
                      <option value="sedan">Седан</option>
                      <option value="suv">Внедорожник</option>
                      <option value="crossover">Кроссовер</option>
                      <option value="electric">Электро</option>
                      <option value="hybrid">Гибрид</option>
                      <option value="premium">Премиум</option>
                      <option value="economy">Эконом</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                      Статус
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-2 bg-neutral-800 text-neutral-50 border border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    >
                      <option value="available">Доступен</option>
                      <option value="in_use">Занят</option>
                      <option value="maintenance">Обслуживание</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Год выпуска"
                    type="number"
                    value={formData.year.toString()}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                    required
                    min="1990"
                    max={new Date().getFullYear() + 1}
                  />

                  <Input
                    label="Цвет"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    placeholder="Черный"
                  />
                </div>

                <Input
                  label="URL изображения"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                />

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Описание
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 bg-neutral-800 text-neutral-50 border border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Описание автомобиля..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="ID парковки"
                    type="number"
                    value={formData.parking_zone_id.toString()}
                    onChange={(e) =>
                      setFormData({ ...formData, parking_zone_id: parseInt(e.target.value) })
                    }
                    required
                    min="1"
                  />

                  <Input
                    label="ID тарифа"
                    type="number"
                    value={formData.tariff_id.toString()}
                    onChange={(e) =>
                      setFormData({ ...formData, tariff_id: parseInt(e.target.value) })
                    }
                    required
                    min="1"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button type="submit" variant="primary" className="flex-1">
                    {editingVehicle ? 'Сохранить' : 'Добавить'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setShowModal(false);
                      setEditingVehicle(null);
                      resetForm();
                    }}
                  >
                    Отмена
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminVehicles;
