import axios from 'axios';
import { Vehicle } from '../../types';
import { API_URL } from '../../utils/constants';

export interface VehicleFilters {
  vehicle_type?: string;
  tariff_id?: number;
  parking_zone_id?: number;
  brand?: string;
  status?: string;
}

export const vehiclesApi = {
  // Get all vehicles with optional filters
  getVehicles: async (filters?: VehicleFilters): Promise<Vehicle[]> => {
    const params = new URLSearchParams();

    if (filters?.vehicle_type) params.append('vehicle_type', filters.vehicle_type);
    if (filters?.tariff_id) params.append('tariff_id', filters.tariff_id.toString());
    if (filters?.parking_zone_id) params.append('parking_zone_id', filters.parking_zone_id.toString());
    if (filters?.brand) params.append('brand', filters.brand);
    if (filters?.status) params.append('status', filters.status);

    const response = await axios.get<Vehicle[]>(
      `${API_URL}/vehicles?${params.toString()}`
    );
    return response.data;
  },

  // Get vehicle by ID
  getVehicleById: async (id: number): Promise<Vehicle> => {
    const response = await axios.get<Vehicle>(`${API_URL}/vehicles/${id}`);
    return response.data;
  },

  // Get available vehicles (shorthand)
  getAvailableVehicles: async (filters?: VehicleFilters): Promise<Vehicle[]> => {
    return vehiclesApi.getVehicles({ ...filters, status: 'available' });
  },
};
