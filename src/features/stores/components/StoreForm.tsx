'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { useCreateStore } from '@/features/stores/hooks/useCreateStore';
import { useUpdateStore } from '@/features/stores/hooks/useUpdateStore';
import { useRegions } from '@/features/addresses/hooks/useRegions';
import { forwardGeocodeApi } from '@/features/geolocation/api/geocoding.api';
import { Store } from '@/features/stores/types';

const MapPicker = dynamic(
  () => import('@/features/addresses/components/MapPicker').then((m) => m.MapPicker),
  {
    ssr: false,
    loading: () => (
      <div className="h-72 w-full rounded-xl border border-border bg-muted animate-pulse flex items-center justify-center text-sm text-muted-foreground">
        Memuat peta…
      </div>
    ),
  },
);

type Props = {
  store?: Store | null;
};

export function StoreForm({ store }: Props) {
  const isEdit = !!store;

  const createHook = useCreateStore();
  const updateHook = useUpdateStore(store ?? null);
  const { form, onSubmit, isSubmitting } = isEdit ? updateHook : createHook;

  const provinceId = form.watch('province_id');
  const cityId = form.watch('city_id');
  const districtId = form.watch('district_id');
  const lat = form.watch('latitude');
  const lng = form.watch('longitude');

  const { provinces, cities, districts, loadingProvinces, loadingCities, loadingDistricts } =
    useRegions(provinceId || null, cityId || null);

  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);
  const geocodingRef = useRef(false);

  // Auto-pan (and optionally auto-pin) when district is selected
  useEffect(() => {
    if (!districtId || !cityId || !provinceId) return;

    const district = districts.find((d) => d.id === districtId);
    const city = cities.find((c) => c.id === cityId);
    const province = provinces.find((p) => p.id === provinceId);
    if (!district || !city || !province) return;

    if (geocodingRef.current) return;
    geocodingRef.current = true;

    const query = `${district.name}, ${city.name}, ${province.name}, Indonesia`;
    forwardGeocodeApi(query)
      .then((result) => {
        if (!result) return;
        setMapCenter(result);
        if (!lat || !lng) {
          form.setValue('latitude', result.lat, { shouldValidate: true });
          form.setValue('longitude', result.lng, { shouldValidate: true });
        }
      })
      .catch(() => null)
      .finally(() => { geocodingRef.current = false; });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [districtId]);

  function onProvinceChange(value: string) {
    form.setValue('province_id', Number(value));
    form.setValue('city_id', 0);
    form.setValue('district_id', 0);
  }

  function onCityChange(value: string) {
    form.setValue('city_id', Number(value));
    form.setValue('district_id', 0);
  }

  function onMapPositionChange(newLat: number, newLng: number) {
    form.setValue('latitude', newLat, { shouldValidate: true });
    form.setValue('longitude', newLng, { shouldValidate: true });
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard/stores">
          <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {isEdit ? 'Edit Toko' : 'Tambah Toko Baru'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isEdit
              ? `Perbarui detail untuk "${store.name}".`
              : 'Isi informasi di bawah untuk menambahkan store location baru.'}
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={onSubmit} noValidate className="space-y-5">
          {/* Card: Basic Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Informasi Toko
              </CardTitle>
              <Separator />
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Toko</FormLabel>
                    <FormControl>
                      <Input placeholder="cth. Cabang Sudirman" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alamat Lengkap</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Jl. Contoh No. 1, Kelurahan, Kecamatan"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="max_delivery_distance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Jarak Pengiriman Maksimal{' '}
                      <span className="text-muted-foreground font-normal">(km)</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        min="0"
                        placeholder="cth. 10"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Card: Region */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Wilayah
              </CardTitle>
              <Separator />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="province_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Provinsi</FormLabel>
                      <Select
                        value={field.value ? String(field.value) : ''}
                        onValueChange={onProvinceChange}
                        disabled={loadingProvinces}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={loadingProvinces ? 'Memuat…' : 'Pilih provinsi'} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {provinces.map((p) => (
                            <SelectItem key={p.id} value={String(p.id)}>
                              {p.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kota / Kabupaten</FormLabel>
                      <Select
                        value={field.value ? String(field.value) : ''}
                        onValueChange={onCityChange}
                        disabled={!provinceId || loadingCities}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                !provinceId
                                  ? 'Pilih provinsi dulu'
                                  : loadingCities
                                    ? 'Memuat…'
                                    : 'Pilih kota'
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {cities.map((c) => (
                            <SelectItem key={c.id} value={String(c.id)}>
                              {c.type ? `${c.type} ${c.name}` : c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="district_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kecamatan</FormLabel>
                      <Select
                        value={field.value ? String(field.value) : ''}
                        onValueChange={(v) => form.setValue('district_id', Number(v))}
                        disabled={!cityId || loadingDistricts}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                !cityId
                                  ? 'Pilih kota dulu'
                                  : loadingDistricts
                                    ? 'Memuat…'
                                    : 'Pilih kecamatan'
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {districts.map((d) => (
                            <SelectItem key={d.id} value={String(d.id)}>
                              {d.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="postal_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kode Pos</FormLabel>
                      <FormControl>
                        <Input placeholder="cth. 10110" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Card: Map */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Titik Lokasi Store
              </CardTitle>
              <Separator />
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Klik pada peta untuk menandai lokasi toko secara tepat.
              </p>

              <MapPicker
                lat={lat || null}
                lng={lng || null}
                onPositionChange={onMapPositionChange}
                centerOn={mapCenter}
              />

              {!!lat && !!lng && (
                <p className="text-xs text-muted-foreground tabular-nums">
                  Koordinat: {Number(lat).toFixed(6)}, {Number(lng).toFixed(6)}
                </p>
              )}

              {(form.formState.errors.latitude || form.formState.errors.longitude) && (
                <p className="text-xs text-destructive">Tandai dulu lokasi toko di peta ya.</p>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center gap-3 pb-8">
            <Button type="submit" disabled={isSubmitting} className="min-w-32">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEdit ? 'Menyimpan…' : 'Membuat toko…'}
                </>
              ) : isEdit ? (
                'Simpan Perubahan'
              ) : (
                'Buat Toko'
              )}
            </Button>
            <Link href="/dashboard/stores">
              <Button type="button" variant="outline" disabled={isSubmitting}>
                Batal
              </Button>
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
}
