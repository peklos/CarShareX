import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Vehicle } from '../../types';
import { ROUTES } from '../../utils/constants';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';
import { optimizeImageUrl, generateSrcSet, IMAGE_SIZES } from '../../utils/imageOptimizer';
import {
  MapPinIcon,
  BoltIcon,
  TruckIcon
} from '@heroicons/react/24/outline';

interface VehicleCardProps {
  vehicle: Vehicle;
}

const VehicleCard: React.FC<VehicleCardProps> = React.memo(({ vehicle }) => {
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
        return <BoltIcon className="h-5 w-5" />;
      case 'hybrid':
        return <BoltIcon className="h-5 w-5 text-green-500" />;
      default:
        return <TruckIcon className="h-5 w-5" />;
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      sedan: 'Седан',
      suv: 'Внедорожник',
      electric: 'Электро',
      hybrid: 'Гибрид',
      premium: 'Премиум',
      economy: 'Эконом',
      crossover: 'Кроссовер',
    };
    return labels[type] || type;
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Link to={`${ROUTES.VEHICLES}/${vehicle.id}`}>
        <Card className="overflow-hidden h-full hover:shadow-xl transition-shadow">
          {/* Image */}
          <div className="relative h-48 bg-neutral-800 overflow-hidden">
            {vehicle.image_url ? (
              <img
                src={optimizeImageUrl(vehicle.image_url, IMAGE_SIZES.card)}
                srcSet={generateSrcSet(vehicle.image_url, [400, 600, 800])}
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                alt={`${vehicle.brand} ${vehicle.model}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-gradient-to-br from-neutral-100 to-neutral-200">
                <TruckIcon className="h-16 w-16 text-neutral-400" />
              </div>
            )}

            {/* Status badge */}
            <div className="absolute top-3 right-3">
              {getStatusBadge(vehicle.status)}
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Brand and Model */}
            <h3 className="text-lg font-bold text-neutral-50 mb-1">
              {vehicle.brand} {vehicle.model}
            </h3>

            {/* Type and Year */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2 text-sm text-neutral-400">
                {getTypeIcon(vehicle.vehicle_type)}
                <span>{getTypeLabel(vehicle.vehicle_type)}</span>
              </div>
              {vehicle.year && (
                <span className="text-sm text-neutral-400">{vehicle.year} г.</span>
              )}
            </div>

            {/* Description */}
            {vehicle.description && (
              <p className="text-sm text-neutral-400 mb-3 line-clamp-2">
                {vehicle.description}
              </p>
            )}

            {/* Color */}
            {vehicle.color && (
              <div className="flex items-center space-x-2 mb-3">
                <div
                  className="w-4 h-4 rounded-full border border-neutral-600"
                  style={{ backgroundColor: vehicle.color.toLowerCase() }}
                  title={vehicle.color}
                />
                <span className="text-sm text-neutral-400 capitalize">{vehicle.color}</span>
              </div>
            )}

            {/* Price */}
            {vehicle.tariff && (
              <div className="bg-primary-500/10 rounded-lg p-2 mb-3">
                <p className="text-primary-500 font-bold text-sm">
                  {vehicle.tariff.price_per_hour
                    ? `${vehicle.tariff.price_per_hour} ₽/час`
                    : vehicle.tariff.price_per_minute
                      ? `${vehicle.tariff.price_per_minute} ₽/мин`
                      : 'Цена не указана'}
                </p>
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-neutral-800">
              <span className="text-xs text-neutral-400 font-mono">
                {vehicle.license_plate}
              </span>
              {vehicle.parking_zone_id && (
                <div className="flex items-center space-x-1 text-xs text-neutral-400">
                  <MapPinIcon className="h-4 w-4" />
                  <span>Зона {vehicle.parking_zone_id}</span>
                </div>
              )}
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
});

VehicleCard.displayName = 'VehicleCard';

export default VehicleCard;
