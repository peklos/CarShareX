import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';
import { VehicleFilters as Filters } from './vehiclesApi';

interface VehicleFiltersProps {
  onFilterChange: (filters: Filters) => void;
  onClearFilters: () => void;
}

const VehicleFilters: React.FC<VehicleFiltersProps> = ({
  onFilterChange,
  onClearFilters,
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    vehicle_type: '',
    brand: '',
    status: 'available',
  });

  const handleFilterChange = (key: keyof Filters, value: string) => {
    const newFilters = {
      ...filters,
      [key]: value || undefined,
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClearFilters = () => {
    const resetFilters: Filters = {
      vehicle_type: '',
      brand: '',
      status: 'available',
    };
    setFilters(resetFilters);
    onClearFilters();
  };

  const vehicleTypes = [
    { value: '', label: 'Все типы' },
    { value: 'sedan', label: 'Седан' },
    { value: 'suv', label: 'Внедорожник' },
    { value: 'crossover', label: 'Кроссовер' },
    { value: 'electric', label: 'Электро' },
    { value: 'hybrid', label: 'Гибрид' },
    { value: 'premium', label: 'Премиум' },
    { value: 'economy', label: 'Эконом' },
  ];

  const brands = [
    { value: '', label: 'Все марки' },
    { value: 'Toyota', label: 'Toyota' },
    { value: 'Honda', label: 'Honda' },
    { value: 'BMW', label: 'BMW' },
    { value: 'Mercedes-Benz', label: 'Mercedes-Benz' },
    { value: 'Tesla', label: 'Tesla' },
    { value: 'Nissan', label: 'Nissan' },
    { value: 'Hyundai', label: 'Hyundai' },
    { value: 'Kia', label: 'Kia' },
    { value: 'Mazda', label: 'Mazda' },
    { value: 'Volkswagen', label: 'Volkswagen' },
    { value: 'Audi', label: 'Audi' },
    { value: 'Lexus', label: 'Lexus' },
  ];

  const statuses = [
    { value: 'available', label: 'Доступен' },
    { value: 'in_use', label: 'Занят' },
    { value: 'maintenance', label: 'Обслуживание' },
  ];

  return (
    <div className="mb-6">
      {/* Mobile filter toggle */}
      <div className="md:hidden mb-4">
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="w-full"
        >
          <FunnelIcon className="h-5 w-5 mr-2" />
          {showFilters ? 'Скрыть фильтры' : 'Показать фильтры'}
        </Button>
      </div>

      {/* Filters */}
      <motion.div
        initial={false}
        animate={{ height: showFilters || window.innerWidth >= 768 ? 'auto' : 0 }}
        className="overflow-hidden md:overflow-visible"
      >
        <div className="bg-neutral-800 rounded-lg shadow-sm p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <FunnelIcon className="h-5 w-5 text-neutral-400" />
              <h3 className="text-lg font-semibold text-neutral-50">Фильтры</h3>
            </div>
            <button
              onClick={handleClearFilters}
              className="flex items-center space-x-1 text-sm text-primary-600 hover:text-primary-700 transition-colors"
            >
              <XMarkIcon className="h-4 w-4" />
              <span>Очистить</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Vehicle Type */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Тип автомобиля
              </label>
              <select
                value={filters.vehicle_type || ''}
                onChange={(e) => handleFilterChange('vehicle_type', e.target.value)}
                className="w-full px-4 py-2 border border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              >
                {vehicleTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Brand */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Марка
              </label>
              <select
                value={filters.brand || ''}
                onChange={(e) => handleFilterChange('brand', e.target.value)}
                className="w-full px-4 py-2 border border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              >
                {brands.map((brand) => (
                  <option key={brand.value} value={brand.value}>
                    {brand.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Статус
              </label>
              <select
                value={filters.status || 'available'}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-4 py-2 border border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              >
                {statuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default VehicleFilters;
