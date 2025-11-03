import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { TruckIcon } from '@heroicons/react/24/outline';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchVehicles, setFilters, clearFilters } from './vehiclesSlice';
import { VehicleFilters as Filters } from './vehiclesApi';
import Layout from '../../components/layout/Layout';
import VehicleCard from './VehicleCard';
import VehicleFilters from './VehicleFilters';
import Spinner from '../../components/ui/Spinner';

const Vehicles: React.FC = () => {
  const dispatch = useAppDispatch();
  const { vehicles, filters, loading, error } = useAppSelector((state) => state.vehicles);

  useEffect(() => {
    dispatch(fetchVehicles(filters));
  }, [dispatch, filters]);

  const handleFilterChange = (newFilters: Filters) => {
    dispatch(setFilters(newFilters));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

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
            <TruckIcon className="h-8 w-8 text-primary-500" />
            <h1 className="text-3xl md:text-4xl font-bold text-gradient">
              Каталог автомобилей
            </h1>
          </div>
          <p className="text-neutral-400">
            Выберите автомобиль для аренды из нашего парка
          </p>
        </motion.div>

        {/* Filters */}
        <VehicleFilters
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />

        {/* Results count */}
        {!loading && (
          <div className="mb-4">
            <p className="text-sm text-neutral-400">
              Найдено автомобилей: <span className="font-semibold">{vehicles.length}</span>
            </p>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Spinner size="lg" />
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Vehicles grid */}
        {!loading && !error && vehicles.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {vehicles.map((vehicle, index) => (
              <motion.div
                key={vehicle.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <VehicleCard vehicle={vehicle} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Empty state */}
        {!loading && !error && vehicles.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <TruckIcon className="h-24 w-24 text-neutral-300 mb-4" />
            <h3 className="text-xl font-semibold text-neutral-300 mb-2">
              Автомобили не найдены
            </h3>
            <p className="text-neutral-400 mb-6">
              Попробуйте изменить параметры фильтрации
            </p>
            <button
              onClick={handleClearFilters}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Сбросить фильтры
            </button>
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

export default Vehicles;
