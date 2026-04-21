import { http, HttpResponse } from 'msw';
import { mockCategories } from '@/mocks/data/categories.data';

const BASE = process.env.NEXT_PUBLIC_API_URL;

// In-memory storage for categories during the test session
let categories = [...mockCategories];
let nextId = Math.max(...categories.map((c) => c.id)) + 1;

export const categoryHandlers = [
  // ── GET /categories ──────────────────────────────────────────────
  http.get(`${BASE}/categories`, () => {
    return HttpResponse.json(categories, { status: 200 });
  }),

  // ── GET /categories/:id ──────────────────────────────────────────
  http.get(`${BASE}/categories/:id`, ({ params }) => {
    const id = parseInt(params.id as string);
    const category = categories.find((c) => c.id === id);

    if (!category) {
      return HttpResponse.json(
        { message: 'Category not found' },
        { status: 404 }
      );
    }

    return HttpResponse.json(category, { status: 200 });
  }),

  // ── POST /categories ──────────────────────────────────────────────
  http.post(`${BASE}/categories`, async ({ request }) => {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string || null;
    const photo = formData.get('photo') as File | null;

    // Check for duplicate name
    if (categories.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
      return HttpResponse.json(
        { message: 'A category with this name already exists' },
        { status: 400 }
      );
    }

    // Mock photo URL (in real app, this would be uploaded to storage)
    let image_url: string | null = null;
    if (photo) {
      image_url = `https://placehold.co/400x300?text=${encodeURIComponent(name)}`;
    }

    const newCategory: typeof categories[0] = {
      id: nextId++,
      name,
      description: description || null,
      image_url,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    categories.push(newCategory);

    return HttpResponse.json(newCategory, { status: 201 });
  }),

  // ── PATCH /categories/:id ──────────────────────────────────────────
  http.patch(`${BASE}/categories/:id`, async ({ params, request }) => {
    const id = parseInt(params.id as string);
    const formData = await request.formData();

    const category = categories.find((c) => c.id === id);
    if (!category) {
      return HttpResponse.json(
        { message: 'Category not found' },
        { status: 404 }
      );
    }

    const name = formData.get('name') as string | null;
    const description = formData.get('description') as string | null;
    const photo = formData.get('photo') as File | null;

    // Check for duplicate name (excluding current category)
    if (name && categories.some((c) => c.id !== id && c.name.toLowerCase() === name.toLowerCase())) {
      return HttpResponse.json(
        { message: 'A category with this name already exists' },
        { status: 400 }
      );
    }

    // Update fields
    if (name) category.name = name;
    if (description !== null) category.description = description || null;
    if (photo) {
      category.image_url = `https://placehold.co/400x300?text=${encodeURIComponent(category.name)}`;
    }
    category.updated_at = new Date().toISOString();

    return HttpResponse.json(category, { status: 200 });
  }),

  // ── DELETE /categories/:id ──────────────────────────────────────────
  http.delete(`${BASE}/categories/:id`, ({ params }) => {
    const id = parseInt(params.id as string);
    const index = categories.findIndex((c) => c.id === id);

    if (index === -1) {
      return HttpResponse.json(
        { message: 'Category not found' },
        { status: 404 }
      );
    }

    categories.splice(index, 1);

    return HttpResponse.json(
      { message: 'Category deleted successfully' },
      { status: 200 }
    );
  }),
];
