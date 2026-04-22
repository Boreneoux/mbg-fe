import { z } from 'zod';

export const addressSchema = z.object({
  label:          z.string().min(1, 'Label wajib diisi').max(50),
  recipient_name: z.string().min(1, 'Nama penerima wajib diisi').max(100),
  phone:          z.string().min(1, 'Nomor HP wajib diisi').max(20),
  address:        z.string().min(1, 'Alamat lengkap wajib diisi'),
  province_id:    z.number({ error: 'Provinsi wajib dipilih' }).positive('Provinsi wajib dipilih'),
  city_id:        z.number({ error: 'Kota/Kabupaten wajib dipilih' }).positive('Kota wajib dipilih'),
  district_id:    z.number({ error: 'Kecamatan wajib dipilih' }).positive('Kecamatan wajib dipilih'),
  postal_code:    z.string().max(10).optional(),
  latitude:       z.number({ error: 'Lokasi GPS wajib dideteksi' }),
  longitude:      z.number({ error: 'Lokasi GPS wajib dideteksi' }),
  is_primary:     z.boolean().optional(),
});

export type AddressFormValues = z.infer<typeof addressSchema>;
