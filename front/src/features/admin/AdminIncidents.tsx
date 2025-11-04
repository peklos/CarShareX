import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import {
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';
import Button from '../../components/ui/Button';
import { API_URL, INCIDENT_STATUS, STATUS_COLORS } from '../../utils/constants';

interface Incident {
  id: number;
  booking_id: number | null;
  vehicle_id: number;
  user_id: number | null;
  incident_type: string;
  description: string;
  status: string;
}

const incidentTypes = {
  damage: 'Повреждение',
  technical_issue: 'Техническая проблема',
  violation: 'Нарушение',
  accident: 'ДТП',
  other: 'Другое',
};

const AdminIncidents: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
    try {
      setLoading(true);
      const response = await axios.get<Incident[]>(`${API_URL}/admin/incidents/`);
      setIncidents(response.data);
    } catch (error) {
      toast.error('Ошибка загрузки инцидентов');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (incidentId: number, newStatus: string) => {
    try {
      await axios.patch(`${API_URL}/admin/incidents/${incidentId}`, {
        status: newStatus,
      });
      toast.success('Статус обновлен');
      fetchIncidents();
    } catch (error) {
      toast.error('Ошибка обновления статуса');
    }
  };

  const filteredIncidents = incidents.filter(
    (incident) =>
      incident.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.id.toString().includes(searchQuery)
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
          <div className="flex items-center space-x-3 mb-2">
            <ExclamationTriangleIcon className="h-8 w-8 text-primary-500" />
            <h1 className="text-3xl md:text-4xl font-bold text-gradient">
              Инциденты
            </h1>
          </div>
          <p className="text-neutral-400">Управление инцидентами и происшествиями</p>
        </motion.div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Поиск по описанию или ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-neutral-800 text-neutral-50 border-2 border-neutral-600 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <div className="text-center">
              <p className="text-sm text-neutral-400">Всего инцидентов</p>
              <p className="text-2xl font-bold text-neutral-50">{incidents.length}</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-sm text-neutral-400">В обработке</p>
              <p className="text-2xl font-bold text-yellow-600">
                {incidents.filter((i) => i.status === 'in_progress').length}
              </p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-sm text-neutral-400">Решено</p>
              <p className="text-2xl font-bold text-green-600">
                {incidents.filter((i) => i.status === 'resolved').length}
              </p>
            </div>
          </Card>
        </div>

        {/* Incidents List */}
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-neutral-700">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-300">
                    ID
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-300">
                    Тип
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-300">
                    Описание
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-300">
                    Автомобиль
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-300">
                    Пользователь
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-300">
                    Статус
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-300">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredIncidents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-neutral-400">
                      Инциденты не найдены
                    </td>
                  </tr>
                ) : (
                  filteredIncidents.map((incident) => (
                    <tr key={incident.id} className="border-b border-neutral-800 hover:bg-neutral-800">
                      <td className="py-3 px-4 text-sm font-mono text-neutral-50">
                        #{incident.id}
                      </td>
                      <td className="py-3 px-4 text-sm text-neutral-50">
                        {incidentTypes[incident.incident_type as keyof typeof incidentTypes] || incident.incident_type}
                      </td>
                      <td className="py-3 px-4 text-sm text-neutral-300 max-w-xs truncate">
                        {incident.description}
                      </td>
                      <td className="py-3 px-4 text-sm text-neutral-400">
                        Авто #{incident.vehicle_id}
                      </td>
                      <td className="py-3 px-4 text-sm text-neutral-400">
                        {incident.user_id ? `Клиент #${incident.user_id}` : '-'}
                      </td>
                      <td className="py-3 px-4">
                        <Badge color={STATUS_COLORS[incident.status as keyof typeof STATUS_COLORS] || 'gray'}>
                          {INCIDENT_STATUS[incident.status as keyof typeof INCIDENT_STATUS] || incident.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          {incident.status === 'reported' && (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleStatusChange(incident.id, 'in_progress')}
                            >
                              В работу
                            </Button>
                          )}
                          {incident.status === 'in_progress' && (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleStatusChange(incident.id, 'resolved')}
                            >
                              <CheckCircleIcon className="h-4 w-4 mr-1" />
                              Решено
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default AdminIncidents;
