import { z } from 'zod';

export const createStoreSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100, 'Max 100 characters'),
  address: z.string().trim().min(1, 'Address is required'),
  province_id: z.string().min(1, 'Province is required'),
  city_id: z.string().min(1, 'City is required'),
  district_id: z.string().min(1, 'District is required'),
  postal_code: z.string().trim().optional(),
  latitude: z
    .number({ error: 'Latitude is required' })
    .min(-90, 'Must be ≥ -90')
    .max(90, 'Must be ≤ 90'),
  longitude: z
    .number({ error: 'Longitude is required' })
    .min(-180, 'Must be ≥ -180')
    .max(180, 'Must be ≤ 180'),
  max_delivery_distance: z
    .number({ error: 'Delivery distance is required' })
    .positive('Must be a positive number'),
});

export const updateStoreSchema = createStoreSchema.partial().refine(
  (data) => Object.values(data).some((v) => v !== undefined),
  { message: 'At least one field must be provided' },
);

export const assignAdminSchema = z.object({
  user_id: z.string().min(1, 'Please select a store admin'),
});

export type CreateStoreFormValues = z.infer<typeof createStoreSchema>;
export type UpdateStoreFormValues = z.infer<typeof updateStoreSchema>;
export type AssignAdminFormValues = z.infer<typeof assignAdminSchema>;
