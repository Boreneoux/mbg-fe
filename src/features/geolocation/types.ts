import { Store } from '@/features/stores/types';

export type LocationStatus =
  | 'idle'          // not yet prompted
  | 'prompting'     // dialog is open
  | 'locating'      // waiting for browser geolocation API
  | 'found'         // nearest store resolved
  | 'out_of_range'  // no store covers the user's location
  | 'denied'        // user denied browser permission or skipped
  | 'error';        // unexpected failure

export type Coordinates = {
  lat: number;
  lng: number;
};

export type NearestStoreResponse = {
  store: Store;
  distance_km: number;
};
