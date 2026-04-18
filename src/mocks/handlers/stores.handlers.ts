import { http, HttpResponse, passthrough } from 'msw';
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

const BASE = process.env.NEXT_PUBLIC_API_URL;

export const storeHandlers = [
  // ── Admin CRUD routes → passthrough to real backend ──────────────────────

  // GET /stores — admin list (real backend returns { stores: [...] })
  http.get(`${BASE}/stores`, () => passthrough()),

  // GET /stores/:id — admin detail
  http.get(`${BASE}/stores/:id`, ({ params }) => {
    // Keep mock only for non-numeric IDs (safety); numeric → real backend
    const id = params.id as string;
    if (/^\d+$/.test(id)) return passthrough();

    return HttpResponse.json(
      { success: false, message: 'Store not found', data: null },
      { status: 404 },
    );
  }),

  // POST /stores — create
  http.post(`${BASE}/stores`, () => passthrough()),

  // PUT /stores/:id — update
  http.put(`${BASE}/stores/:id`, () => passthrough()),

  // DELETE /stores/:id — delete
  http.delete(`${BASE}/stores/:id`, () => passthrough()),

  // POST /stores/:id/admins — assign admin
  http.post(`${BASE}/stores/:id/admins`, () => passthrough()),

  // ── Public helper routes → keep mocked ───────────────────────────────────

  /**
   * GET /stores/nearest?lat=&lng=
   * Used by the geolocation feature on the main site.
   */
  http.get(`${BASE}/stores/nearest`, ({ request }) => {
    const url = new URL(request.url);
    const lat = parseFloat(url.searchParams.get('lat') ?? '');
    const lng = parseFloat(url.searchParams.get('lng') ?? '');

    if (isNaN(lat) || isNaN(lng)) {
      return HttpResponse.json(
        { success: false, message: 'lat and lng query params are required', data: null },
        { status: 400 },
      );
    }

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
   * Used by the store products feature on the main site.
   */
  http.get(`${BASE}/stores/:id/products`, ({ params }) => {
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
];

export { FALLBACK_STORE_ID };
