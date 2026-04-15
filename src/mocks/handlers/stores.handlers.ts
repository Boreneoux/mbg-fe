import { http, HttpResponse } from 'msw';
import { mockStores, FALLBACK_STORE_ID } from '@/mocks/data/stores.data';
import { getProductsByStoreId } from '@/mocks/data/products.data';

/** Haversine formula — returns distance in km between two lat/lng points */
function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export const storeHandlers = [
  /**
   * GET /stores
   * Returns all stores (used as fallback list)
   */
  http.get(`${process.env.NEXT_PUBLIC_API_URL}/stores`, () => {
    return HttpResponse.json({
      success: true,
      message: 'Stores fetched successfully',
      data: mockStores,
    });
  }),

  /**
   * GET /stores/nearest?lat=&lng=
   * Returns the closest store within its max_delivery_distance.
   * 404 if no store is within range.
   */
  http.get(`${process.env.NEXT_PUBLIC_API_URL}/stores/nearest`, ({ request }) => {
    const url = new URL(request.url);
    const lat = parseFloat(url.searchParams.get('lat') ?? '');
    const lng = parseFloat(url.searchParams.get('lng') ?? '');

    if (isNaN(lat) || isNaN(lng)) {
      return HttpResponse.json(
        { success: false, message: 'lat and lng query params are required', data: null },
        { status: 400 },
      );
    }

    // Find the closest store that is within its delivery range
    let nearestStore = null;
    let nearestDistance = Infinity;

    for (const store of mockStores) {
      const distance = haversineKm(lat, lng, store.latitude, store.longitude);
      if (distance <= store.max_delivery_distance && distance < nearestDistance) {
        nearestDistance = distance;
        nearestStore = store;
      }
    }

    if (!nearestStore) {
      // Find the absolute nearest store (for the suggestion message)
      let closestStore = mockStores[0];
      let closestDistance = haversineKm(lat, lng, mockStores[0].latitude, mockStores[0].longitude);
      for (const store of mockStores.slice(1)) {
        const d = haversineKm(lat, lng, store.latitude, store.longitude);
        if (d < closestDistance) {
          closestDistance = d;
          closestStore = store;
        }
      }

      return HttpResponse.json(
        {
          success: false,
          message: `No store delivers to your location. The nearest store is "${closestStore.name}" (${closestDistance.toFixed(1)} km away).`,
          data: null,
        },
        { status: 404 },
      );
    }

    return HttpResponse.json({
      success: true,
      message: 'Nearest store found',
      data: { store: nearestStore, distance_km: parseFloat(nearestDistance.toFixed(2)) },
    });
  }),

  /**
   * GET /stores/:id/products
   * Returns products in stock at a given store
   */
  http.get(`${process.env.NEXT_PUBLIC_API_URL}/stores/:id/products`, ({ params }) => {
    const storeId = parseInt(params.id as string, 10);
    const store = mockStores.find((s) => s.id === storeId);

    if (!store) {
      return HttpResponse.json(
        { success: false, message: 'Store not found', data: null },
        { status: 404 },
      );
    }

    const products = getProductsByStoreId(storeId);

    return HttpResponse.json({
      success: true,
      message: 'Products fetched successfully',
      data: products,
    });
  }),

  /**
   * GET /stores/:id
   * Returns a single store by ID (used for fallback store details)
   */
  http.get(`${process.env.NEXT_PUBLIC_API_URL}/stores/:id`, ({ params }) => {
    const storeId = parseInt(params.id as string, 10);
    const store = mockStores.find((s) => s.id === storeId);

    if (!store) {
      return HttpResponse.json(
        { success: false, message: 'Store not found', data: null },
        { status: 404 },
      );
    }

    return HttpResponse.json({
      success: true,
      message: 'Store fetched successfully',
      data: store,
    });
  }),
];

export { FALLBACK_STORE_ID };
