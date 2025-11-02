import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import {
  CurrencyDollarIcon,
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
import { formatCurrency } from '../../utils/helpers';

interface Tariff {
  id: number;
  name: string;
  price_per_minute: number | null;
  price_per_hour: number | null;
}

interface TariffForm {
  name: string;
  price_per_minute: string;
  price_per_hour: string;
}

const AdminTariffs: React.FC = () => {
  const [tariffs, setTariffs] = useState<Tariff[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTariff, setEditingTariff] = useState<Tariff | null>(null);
  const [formData, setFormData] = useState<TariffForm>({
    name: '',
    price_per_minute: '',
    price_per_hour: '',
  });

  useEffect(() => {
    fetchTariffs();
  }, []);

  const fetchTariffs = async () => {
    try {
      setLoading(true);
      const response = await axios.get<Tariff[]>(`${API_URL}/admin/tariffs/`);
      setTariffs(response.data);
    } catch (error) {
      toast.error('Ошибка загрузки тарифов');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (tariff?: Tariff) => {
    if (tariff) {
      setEditingTariff(tariff);
      setFormData({
        name: tariff.name,
        price_per_minute: tariff.price_per_minute?.toString() || '',
        price_per_hour: tariff.price_per_hour?.toString() || '',
      });
    } else {
      setEditingTariff(null);
      setFormData({
        name: '',
        price_per_minute: '',
        price_per_hour: '',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTariff(null);
    setFormData({
      name: '',
      price_per_minute: '',
      price_per_hour: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      name: formData.name,
      price_per_minute: formData.price_per_minute ? parseFloat(formData.price_per_minute) : null,
      price_per_hour: formData.price_per_hour ? parseFloat(formData.price_per_hour) : null,
    };

    try {
      if (editingTariff) {
        await axios.patch(`${API_URL}/admin/tariffs/${editingTariff.id}`, data);
        toast.success('Тариф обновлен');
      } else {
        await axios.post(`${API_URL}/admin/tariffs/`, data);
        toast.success('Тариф создан');
      }
      handleCloseModal();
      fetchTariffs();
    } catch (error) {
      toast.error('Ошибка сохранения тарифа');
    }
  };

  const handleDelete = async (tariffId: number) => {
    if (!confirm('Вы уверены, что хотите удалить этот тариф?')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/admin/tariffs/${tariffId}`);
      toast.success('Тариф удален');
      fetchTariffs();
    } catch (error) {
      toast.error('Ошибка удаления тарифа');
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
              <CurrencyDollarIcon className="h-8 w-8 text-primary-500" />
              <h1 className="text-3xl md:text-4xl font-bold text-gradient">
                Тарифы
              </h1>
            </div>
            <Button variant="primary" onClick={() => handleOpenModal()}>
              <PlusIcon className="h-5 w-5 mr-2" />
              Добавить тариф
            </Button>
          </div>
          <p className="text-neutral-600">Управление тарифами аренды</p>
        </motion.div>

        {/* Tariffs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tariffs.map((tariff) => (
            <motion.div
              key={tariff.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <Card hover>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-neutral-900">{tariff.name}</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenModal(tariff)}
                        className="p-2 text-neutral-600 hover:text-primary-500 transition-colors"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(tariff.id)}
                        className="p-2 text-neutral-600 hover:text-red-500 transition-colors"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {tariff.price_per_minute && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-neutral-600">За минуту:</span>
                        <span className="text-lg font-semibold text-primary-600">
                          {formatCurrency(tariff.price_per_minute)}
                        </span>
                      </div>
                    )}
                    {tariff.price_per_hour && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-neutral-600">За час:</span>
                        <span className="text-lg font-semibold text-primary-600">
                          {formatCurrency(tariff.price_per_hour)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {tariffs.length === 0 && (
          <Card>
            <div className="text-center py-12">
              <CurrencyDollarIcon className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
              <p className="text-neutral-500">Тарифы не найдены</p>
            </div>
          </Card>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-neutral-900">
                    {editingTariff ? 'Редактировать тариф' : 'Новый тариф'}
                  </h2>
                  <button
                    onClick={handleCloseModal}
                    className="text-neutral-400 hover:text-neutral-600"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    label="Название тарифа"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="Например: Поминутный"
                  />

                  <Input
                    label="Цена за минуту (₽)"
                    type="number"
                    step="0.01"
                    value={formData.price_per_minute}
                    onChange={(e) =>
                      setFormData({ ...formData, price_per_minute: e.target.value })
                    }
                    placeholder="8.00"
                  />

                  <Input
                    label="Цена за час (₽)"
                    type="number"
                    step="0.01"
                    value={formData.price_per_hour}
                    onChange={(e) =>
                      setFormData({ ...formData, price_per_hour: e.target.value })
                    }
                    placeholder="350.00"
                  />

                  <p className="text-sm text-neutral-600">
                    Можно указать либо цену за минуту, либо за час, либо обе
                  </p>

                  <div className="flex gap-3 pt-4">
                    <Button type="button" variant="secondary" onClick={handleCloseModal}>
                      Отмена
                    </Button>
                    <Button type="submit" variant="primary" className="flex-1">
                      {editingTariff ? 'Сохранить' : 'Создать'}
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

export default AdminTariffs;
