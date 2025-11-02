import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import {
  BuildingOfficeIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  PhoneIcon,
} from '@heroicons/react/24/outline';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { API_URL } from '../../utils/constants';

interface Branch {
  id: number;
  name: string;
  address: string;
  phone: string | null;
}

interface BranchForm {
  name: string;
  address: string;
  phone: string;
}

const AdminBranches: React.FC = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [formData, setFormData] = useState<BranchForm>({
    name: '',
    address: '',
    phone: '',
  });

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      setLoading(true);
      const response = await axios.get<Branch[]>(`${API_URL}/admin/branches/`);
      setBranches(response.data);
    } catch (error) {
      toast.error('Ошибка загрузки офисов');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (branch?: Branch) => {
    if (branch) {
      setEditingBranch(branch);
      setFormData({
        name: branch.name,
        address: branch.address,
        phone: branch.phone || '',
      });
    } else {
      setEditingBranch(null);
      setFormData({
        name: '',
        address: '',
        phone: '',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingBranch(null);
    setFormData({
      name: '',
      address: '',
      phone: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      name: formData.name,
      address: formData.address,
      phone: formData.phone || null,
    };

    try {
      if (editingBranch) {
        await axios.patch(`${API_URL}/admin/branches/${editingBranch.id}`, data);
        toast.success('Офис обновлен');
      } else {
        await axios.post(`${API_URL}/admin/branches/`, data);
        toast.success('Офис создан');
      }
      handleCloseModal();
      fetchBranches();
    } catch (error) {
      toast.error('Ошибка сохранения офиса');
    }
  };

  const handleDelete = async (branchId: number) => {
    if (!confirm('Вы уверены, что хотите удалить этот офис?')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/admin/branches/${branchId}`);
      toast.success('Офис удален');
      fetchBranches();
    } catch (error) {
      toast.error('Ошибка удаления офиса');
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
              <BuildingOfficeIcon className="h-8 w-8 text-primary-500" />
              <h1 className="text-3xl md:text-4xl font-bold text-gradient">
                Офисы и отделения
              </h1>
            </div>
            <Button variant="primary" onClick={() => handleOpenModal()}>
              <PlusIcon className="h-5 w-5 mr-2" />
              Добавить офис
            </Button>
          </div>
          <p className="text-neutral-600">Управление офисами компании</p>
        </motion.div>

        {/* Branches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {branches.map((branch) => (
            <motion.div
              key={branch.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <Card hover>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-neutral-900 mb-2">
                        {branch.name}
                      </h3>
                      <p className="text-sm text-neutral-600 mb-2">{branch.address}</p>
                      {branch.phone && (
                        <div className="flex items-center text-sm text-neutral-600">
                          <PhoneIcon className="h-4 w-4 mr-2" />
                          {branch.phone}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 pt-4 border-t border-neutral-200">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenModal(branch)}
                      className="flex-1"
                    >
                      <PencilIcon className="h-4 w-4 mr-1" />
                      Изменить
                    </Button>
                    <button
                      onClick={() => handleDelete(branch.id)}
                      className="p-2 text-neutral-600 hover:text-red-500 transition-colors"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {branches.length === 0 && (
          <Card>
            <div className="text-center py-12">
              <BuildingOfficeIcon className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
              <p className="text-neutral-500">Офисы не найдены</p>
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
                    {editingBranch ? 'Редактировать офис' : 'Новый офис'}
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
                    label="Название офиса"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="Например: Центральный офис"
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
                    label="Телефон"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+7 (495) 123-45-67"
                  />

                  <div className="flex gap-3 pt-4">
                    <Button type="button" variant="secondary" onClick={handleCloseModal}>
                      Отмена
                    </Button>
                    <Button type="submit" variant="primary" className="flex-1">
                      {editingBranch ? 'Сохранить' : 'Создать'}
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

export default AdminBranches;
