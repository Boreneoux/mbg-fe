import { Store } from '@/features/stores/types';

export const mockStores: Store[] = [
  {
    id: 1,
    name: 'MalesBeliGrocery – Sudirman',
    address: 'Jl. Jend. Sudirman No.1, Karet Tengsin, Jakarta Pusat',
    city_id: 151,
    province_id: 6,
    postal_code: '10220',
    latitude: -6.2088,
    longitude: 106.8456,
    max_delivery_distance: 10,
  },
  {
    id: 2,
    name: 'MalesBeliGrocery – Kelapa Gading',
    address: 'Jl. Boulevard Raya No.1, Kelapa Gading, Jakarta Utara',
    city_id: 151,
    province_id: 6,
    postal_code: '14240',
    latitude: -6.1586,
    longitude: 106.9,
    max_delivery_distance: 10,
  },
  {
    id: 3,
    name: 'MalesBeliGrocery – Fatmawati',
    address: 'Jl. RS Fatmawati No.10, Cilandak, Jakarta Selatan',
    city_id: 151,
    province_id: 6,
    postal_code: '12430',
    latitude: -6.2946,
    longitude: 106.7954,
    max_delivery_distance: 10,
  },
];

/** The fallback store used when the user denies location or is out of range */
export const FALLBACK_STORE_ID = 1;
