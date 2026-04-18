'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

  const { register, watch, setValue, formState: { errors } } = form;

  const provinceId = watch('province_id');
  const cityId = watch('city_id');
  const districtId = watch('district_id');
  const lat = watch('latitude');
  const lng = watch('longitude');

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
        // Auto-place pin only if no pin has been set yet
        if (!lat || !lng) {
          setValue('latitude', result.lat, { shouldValidate: true });
          setValue('longitude', result.lng, { shouldValidate: true });
        }
      })
      .catch(() => null)
      .finally(() => { geocodingRef.current = false; });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [districtId]);

  function onProvinceChange(value: string) {
    setValue('province_id', Number(value));
    setValue('city_id', 0);
    setValue('district_id', 0);
  }

  function onCityChange(value: string) {
    setValue('city_id', Number(value));
    setValue('district_id', 0);
  }

  function onMapPositionChange(newLat: number, newLng: number) {
    setValue('latitude', newLat, { shouldValidate: true });
    setValue('longitude', newLng, { shouldValidate: true });
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
            <div className="space-y-1.5">
              <Label htmlFor="name">Nama Toko</Label>
              <Input
                id="name"
                placeholder="cth. Cabang Sudirman"
                {...register('name')}
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="address">Alamat Lengkap</Label>
              <Textarea
                id="address"
                placeholder="Jl. Contoh No. 1, Kelurahan, Kecamatan"
                rows={3}
                {...register('address')}
                className={errors.address ? 'border-destructive' : ''}
              />
              {errors.address && (
                <p className="text-xs text-destructive">{errors.address.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="max_delivery_distance">
                Jarak Pengiriman Maksimal{' '}
                <span className="text-muted-foreground font-normal">(km)</span>
              </Label>
              <Input
                id="max_delivery_distance"
                type="number"
                step="0.1"
                min="0"
                placeholder="cth. 10"
                {...register('max_delivery_distance', { valueAsNumber: true })}
                className={errors.max_delivery_distance ? 'border-destructive' : ''}
              />
              {errors.max_delivery_distance && (
                <p className="text-xs text-destructive">{errors.max_delivery_distance.message}</p>
              )}
            </div>
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
              <div className="space-y-1.5">
                <Label>Provinsi</Label>
                <Select
                  value={provinceId ? String(provinceId) : ''}
                  onValueChange={onProvinceChange}
                  disabled={loadingProvinces}
                >
                  <SelectTrigger className={errors.province_id ? 'border-destructive' : ''}>
                    <SelectValue placeholder={loadingProvinces ? 'Memuat…' : 'Pilih provinsi'} />
                  </SelectTrigger>
                  <SelectContent>
                    {provinces.map((p) => (
                      <SelectItem key={p.id} value={String(p.id)}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.province_id && (
                  <p className="text-xs text-destructive">{errors.province_id.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label>Kota / Kabupaten</Label>
                <Select
                  value={cityId ? String(cityId) : ''}
                  onValueChange={onCityChange}
                  disabled={!provinceId || loadingCities}
                >
                  <SelectTrigger className={errors.city_id ? 'border-destructive' : ''}>
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
                  <SelectContent>
                    {cities.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {c.type ? `${c.type} ${c.name}` : c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.city_id && (
                  <p className="text-xs text-destructive">{errors.city_id.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Kecamatan</Label>
                <Select
                  value={districtId ? String(districtId) : ''}
                  onValueChange={(v) => setValue('district_id', Number(v))}
                  disabled={!cityId || loadingDistricts}
                >
                  <SelectTrigger className={errors.district_id ? 'border-destructive' : ''}>
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
                  <SelectContent>
                    {districts.map((d) => (
                      <SelectItem key={d.id} value={String(d.id)}>
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.district_id && (
                  <p className="text-xs text-destructive">{errors.district_id.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="postal_code">Kode Pos</Label>
                <Input id="postal_code" placeholder="cth. 10110" {...register('postal_code')} />
              </div>
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

            {(errors.latitude || errors.longitude) && (
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
    </div>
  );
}
