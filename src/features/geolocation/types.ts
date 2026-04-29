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

/** Lean store shape returned by GET /stores?lat=&lng= (nearest store routing) */
export type NearestStore = {
  id: string;
  name: string;
  slug: string;
  latitude: number;
  longitude: number;
  max_delivery_distance: number;
};

export type NearestStoreResponse = {
  store: NearestStore;
  distance_km: number;
};
