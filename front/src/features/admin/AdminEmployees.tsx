import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import {
  UserGroupIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { API_URL } from '../../utils/constants';
import { useAppSelector } from '../../app/hooks';
import { Employee } from '../../types';

interface EmployeeForm {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role_id: string;
  branch_id: string;
}

interface Role {
  id: number;
  name: string;
}

interface Branch {
  id: number;
  name: string;
}

const AdminEmployees: React.FC = () => {
  const currentUser = useAppSelector((state) => state.auth.user) as Employee | null;
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState<EmployeeForm>({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    role_id: '2',
    branch_id: '1',
  });

  useEffect(() => {
    if (currentUser?.id) {
      fetchEmployees();
      fetchBranches();
      // Hardcoded roles
      setRoles([
        { id: 1, name: 'SuperAdmin' },
        { id: 2, name: 'Admin' },
        { id: 3, name: 'Mechanic' },
      ]);
    }
  }, [currentUser]);

  const fetchEmployees = async () => {
    if (!currentUser?.id) return;

    try {
      setLoading(true);
      const response = await axios.get<Employee[]>(
        `${API_URL}/admin/employees/?employee_id=${currentUser.id}`
      );
      setEmployees(response.data);
    } catch (error: any) {
      if (error.response?.status === 403) {
        toast.error('Доступ запрещен. Требуется роль SuperAdmin');
      } else {
        toast.error('Ошибка загрузки сотрудников');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchBranches = async () => {
    try {
      const response = await axios.get<Branch[]>(`${API_URL}/admin/branches/`);
      setBranches(response.data);
    } catch (error) {
      console.error('Failed to fetch branches');
    }
  };

  const handleOpenModal = (employee?: Employee) => {
    if (employee) {
      setEditingEmployee(employee);
      setFormData({
        first_name: employee.first_name,
        last_name: employee.last_name,
        email: employee.email,
        password: '',
        role_id: employee.role_id.toString(),
        branch_id: employee.branch_id?.toString() || '1',
      });
    } else {
      setEditingEmployee(null);
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        role_id: '2',
        branch_id: '1',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingEmployee(null);
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      role_id: '2',
      branch_id: '1',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser?.id) return;

    const data = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      password: formData.password || undefined,
      role_id: parseInt(formData.role_id),
      branch_id: formData.branch_id ? parseInt(formData.branch_id) : null,
    };

    try {
      if (editingEmployee) {
        await axios.patch(
          `${API_URL}/admin/employees/${editingEmployee.id}?admin_id=${currentUser.id}`,
          data
        );
        toast.success('Сотрудник обновлен');
      } else {
        await axios.post(
          `${API_URL}/admin/employees/?admin_id=${currentUser.id}`,
          data
        );
        toast.success('Сотрудник создан');
      }
      handleCloseModal();
      fetchEmployees();
    } catch (error: any) {
      if (error.response?.status === 403) {
        toast.error('Доступ запрещен');
      } else {
        toast.error(error.response?.data?.detail || 'Ошибка сохранения сотрудника');
      }
    }
  };

  const handleDelete = async (employeeId: number) => {
    if (!currentUser?.id) return;

    if (!confirm('Вы уверены, что хотите удалить этого сотрудника?')) {
      return;
    }

    try {
      await axios.delete(
        `${API_URL}/admin/employees/${employeeId}?admin_id=${currentUser.id}`
      );
      toast.success('Сотрудник удален');
      fetchEmployees();
    } catch (error: any) {
      if (error.response?.status === 403) {
        toast.error('Доступ запрещен');
      } else {
        toast.error('Ошибка удаления сотрудника');
      }
    }
  };

  const getRoleName = (roleId: number) => {
    const role = roles.find((r) => r.id === roleId);
    return role?.name || 'Неизвестно';
  };

  const getBranchName = (branchId: number | null | undefined) => {
    if (!branchId) return '-';
    const branch = branches.find((b) => b.id === branchId);
    return branch?.name || '-';
  };

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase())
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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
              <UserGroupIcon className="h-8 w-8 text-primary-500" />
              <h1 className="text-3xl md:text-4xl font-bold text-gradient">
                Сотрудники
              </h1>
            </div>
            <Button variant="primary" onClick={() => handleOpenModal()}>
              <PlusIcon className="h-5 w-5 mr-2" />
              Добавить сотрудника
            </Button>
          </div>
          <p className="text-neutral-600">
            Управление сотрудниками (только SuperAdmin)
          </p>
        </motion.div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Поиск по имени или email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-2 border-neutral-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
            />
          </div>
        </div>

        {/* Employees Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">
                    ID
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">
                    Имя
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">
                    Email
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">
                    Роль
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">
                    Офис
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-neutral-700">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-neutral-500">
                      Сотрудники не найдены
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((emp) => (
                    <tr key={emp.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                      <td className="py-3 px-4 text-sm font-mono text-neutral-900">
                        #{emp.id}
                      </td>
                      <td className="py-3 px-4 text-sm font-semibold text-neutral-900">
                        {emp.first_name} {emp.last_name}
                      </td>
                      <td className="py-3 px-4 text-sm text-neutral-600">{emp.email}</td>
                      <td className="py-3 px-4">
                        <Badge
                          color={
                            emp.role_id === 1
                              ? 'red'
                              : emp.role_id === 2
                              ? 'blue'
                              : 'gray'
                          }
                        >
                          {getRoleName(emp.role_id)}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-neutral-600">
                        {getBranchName(emp.branch_id)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => handleOpenModal(emp)}
                            className="p-2 text-neutral-600 hover:text-primary-500 transition-colors"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(emp.id)}
                            className="p-2 text-neutral-600 hover:text-red-500 transition-colors"
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
              className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-neutral-900">
                    {editingEmployee ? 'Редактировать сотрудника' : 'Новый сотрудник'}
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
                    label="Имя"
                    type="text"
                    value={formData.first_name}
                    onChange={(e) =>
                      setFormData({ ...formData, first_name: e.target.value })
                    }
                    required
                    placeholder="Иван"
                  />

                  <Input
                    label="Фамилия"
                    type="text"
                    value={formData.last_name}
                    onChange={(e) =>
                      setFormData({ ...formData, last_name: e.target.value })
                    }
                    required
                    placeholder="Иванов"
                  />

                  <Input
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    placeholder="ivanov@carsharex.ru"
                  />

                  <Input
                    label={editingEmployee ? 'Новый пароль (оставьте пустым, если не нужно менять)' : 'Пароль'}
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required={!editingEmployee}
                    placeholder="••••••••"
                  />

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Роль
                    </label>
                    <select
                      value={formData.role_id}
                      onChange={(e) =>
                        setFormData({ ...formData, role_id: e.target.value })
                      }
                      className="w-full px-4 py-2 border-2 border-neutral-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                      required
                    >
                      {roles.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Офис
                    </label>
                    <select
                      value={formData.branch_id}
                      onChange={(e) =>
                        setFormData({ ...formData, branch_id: e.target.value })
                      }
                      className="w-full px-4 py-2 border-2 border-neutral-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                    >
                      <option value="">Не назначен</option>
                      {branches.map((branch) => (
                        <option key={branch.id} value={branch.id}>
                          {branch.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button type="button" variant="secondary" onClick={handleCloseModal}>
                      Отмена
                    </Button>
                    <Button type="submit" variant="primary" className="flex-1">
                      {editingEmployee ? 'Сохранить' : 'Создать'}
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

export default AdminEmployees;
