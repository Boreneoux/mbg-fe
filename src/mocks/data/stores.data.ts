import { Store } from '@/features/stores/types';

const mockProvince = { id: '6', name: 'DKI Jakarta', rajaongkir_province_id: '6' };
const mockCity = { id: '151', province_id: '6', name: 'Jakarta Pusat', type: 'Kota', postal_code: '10000', rajaongkir_city_id: '151' };
const mockDistrict = { id: '1', city_id: '151', name: 'Gambir', rajaongkir_district_id: '1' };

export const mockStores: Store[] = [
  {
    id: 'mock-store-uuid-1',
    slug: 'magerbeligrocery-sudirman',
    name: 'MagerBeliGrocery – Sudirman',
    address: 'Jl. Jend. Sudirman No.1, Karet Tengsin, Jakarta Pusat',
    district_id: '1',
    city_id: '151',
    province_id: '6',
    postal_code: '10220',
    latitude: -6.2088,
    longitude: 106.8456,
    max_delivery_distance: 10,
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z',
    deleted_at: null,
    province: mockProvince,
    city: mockCity,
    district: mockDistrict,
    store_admins: [],
  },
  {
    id: 'mock-store-uuid-2',
    slug: 'magerbeligrocery-kelapa-gading',
    name: 'MagerBeliGrocery – Kelapa Gading',
    address: 'Jl. Boulevard Raya No.1, Kelapa Gading, Jakarta Utara',
    district_id: '1',
    city_id: '151',
    province_id: '6',
    postal_code: '14240',
    latitude: -6.1586,
    longitude: 106.9,
    max_delivery_distance: 10,
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z',
    deleted_at: null,
    province: mockProvince,
    city: mockCity,
    district: mockDistrict,
    store_admins: [],
  },
  {
    id: 'mock-store-uuid-3',
    slug: 'magerbeligrocery-fatmawati',
    name: 'MagerBeliGrocery – Fatmawati',
    address: 'Jl. RS Fatmawati No.10, Cilandak, Jakarta Selatan',
    district_id: '1',
    city_id: '151',
    province_id: '6',
    postal_code: '12430',
    latitude: -6.2946,
    longitude: 106.7954,
    max_delivery_distance: 10,
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z',
    deleted_at: null,
    province: mockProvince,
    city: mockCity,
    district: mockDistrict,
    store_admins: [],
  },
];

/** The fallback store slug used when the user denies location or is out of range */
export const FALLBACK_STORE_ID = 'magerbeligrocery-sudirman';
