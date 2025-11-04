import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import {
  MapPinIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { API_URL } from '../../utils/constants';

interface ParkingZone {
  id: number;
  name: string;
  address: string;
  capacity: number;
}

interface ParkingForm {
  name: string;
  address: string;
  capacity: string;
}

const AdminParking: React.FC = () => {
  const [parkingZones, setParkingZones] = useState<ParkingZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingZone, setEditingZone] = useState<ParkingZone | null>(null);
  const [formData, setFormData] = useState<ParkingForm>({
    name: '',
    address: '',
    capacity: '10',
  });

  useEffect(() => {
    fetchParkingZones();
  }, []);

  const fetchParkingZones = async () => {
    try {
      setLoading(true);
      const response = await axios.get<ParkingZone[]>(`${API_URL}/admin/parking/`);
      setParkingZones(response.data);
    } catch (error) {
      toast.error('Ошибка загрузки парковочных зон');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (zone?: ParkingZone) => {
    if (zone) {
      setEditingZone(zone);
      setFormData({
        name: zone.name,
        address: zone.address,
        capacity: zone.capacity.toString(),
      });
    } else {
      setEditingZone(null);
      setFormData({
        name: '',
        address: '',
        capacity: '10',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingZone(null);
    setFormData({
      name: '',
      address: '',
      capacity: '10',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      name: formData.name,
      address: formData.address,
      capacity: parseInt(formData.capacity),
    };

    try {
      if (editingZone) {
        await axios.patch(`${API_URL}/admin/parking/${editingZone.id}`, data);
        toast.success('Парковочная зона обновлена');
      } else {
        await axios.post(`${API_URL}/admin/parking/`, data);
        toast.success('Парковочная зона создана');
      }
      handleCloseModal();
      fetchParkingZones();
    } catch (error) {
      toast.error('Ошибка сохранения парковочной зоны');
    }
  };

  const handleDelete = async (zoneId: number) => {
    if (!confirm('Вы уверены, что хотите удалить эту парковочную зону?')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/admin/parking/${zoneId}`);
      toast.success('Парковочная зона удалена');
      fetchParkingZones();
    } catch (error) {
      toast.error('Ошибка удаления парковочной зоны');
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

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
              <MapPinIcon className="h-8 w-8 text-primary-500" />
              <h1 className="text-3xl md:text-4xl font-bold text-gradient">
                Парковочные зоны
              </h1>
            </div>
            <Button variant="primary" onClick={() => handleOpenModal()}>
              <PlusIcon className="h-5 w-5 mr-2" />
              Добавить зону
            </Button>
          </div>
          <p className="text-neutral-400">Управление парковочными зонами</p>
        </motion.div>

        {/* Parking Zones Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-neutral-700">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-300">
                    ID
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-300">
                    Название
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-300">
                    Адрес
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-300">
                    Вместимость
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-neutral-300">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody>
                {parkingZones.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-neutral-400">
                      Парковочные зоны не найдены
                    </td>
                  </tr>
                ) : (
                  parkingZones.map((zone) => (
                    <tr key={zone.id} className="border-b border-neutral-800 hover:bg-neutral-800">
                      <td className="py-3 px-4 text-sm font-mono text-neutral-50">
                        #{zone.id}
                      </td>
                      <td className="py-3 px-4 text-sm font-semibold text-neutral-50">
                        {zone.name}
                      </td>
                      <td className="py-3 px-4 text-sm text-neutral-400">
                        {zone.address}
                      </td>
                      <td className="py-3 px-4 text-sm text-neutral-50">
                        {zone.capacity} мест
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => handleOpenModal(zone)}
                            className="p-2 text-neutral-400 hover:text-primary-500 transition-colors"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(zone.id)}
                            className="p-2 text-neutral-400 hover:text-red-500 transition-colors"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-neutral-800 rounded-lg shadow-xl max-w-md w-full"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-neutral-50">
                    {editingZone ? 'Редактировать зону' : 'Новая парковочная зона'}
                  </h2>
                  <button
                    onClick={handleCloseModal}
                    className="text-neutral-400 hover:text-neutral-400"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    label="Название"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="Например: Парковка Центр"
                  />

                  <Input
                    label="Адрес"
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                    placeholder="Москва, ул. Тверская, 10"
                  />

                  <Input
                    label="Вместимость (мест)"
                    type="number"
                    min="1"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    required
                    placeholder="10"
                  />

                  <div className="flex gap-3 pt-4">
                    <Button type="button" variant="secondary" onClick={handleCloseModal}>
                      Отмена
                    </Button>
                    <Button type="submit" variant="primary" className="flex-1">
                      {editingZone ? 'Сохранить' : 'Создать'}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminParking;
