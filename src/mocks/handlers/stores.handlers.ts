import { http, HttpResponse, passthrough } from 'msw';
import { FALLBACK_STORE_ID } from '@/mocks/data/stores.data';

const BASE = process.env.NEXT_PUBLIC_API_URL;

export const storeHandlers = [
  // GET /stores — nearest store (public) or admin list → real backend
  http.get(`${BASE}/stores`, () => passthrough()),

  // GET /stores/:id/products — real backend
  http.get(`${BASE}/stores/:id/products`, () => passthrough()),

  // GET /stores/:id — admin detail
  http.get(`${BASE}/stores/:id`, ({ params }) => {
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
];

export { FALLBACK_STORE_ID };
