'use client';

import dynamic from 'next/dynamic';
import { LocateFixed, Loader2, CheckCircle2, XCircle } from 'lucide-react';

const MapPicker = dynamic(
  () => import('./MapPicker').then(m => m.MapPicker),
  { ssr: false, loading: () => <div className="h-56 w-full rounded-lg border border-border bg-muted animate-pulse" /> }
);
import { Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UserAddress } from '../types';
import { useAddressForm } from '../hooks/useAddressForm';

type Props = {
  address?: UserAddress;
  onSuccess: (saved: UserAddress) => void;
  existingLabels?: string[];
};

export function AddressForm({ address, onSuccess, existingLabels = [] }: Props) {
  const {
    form,
    isEdit,
    locationStatus,
    detectLocation,
    setCoords,
    onProvinceChange,
    onCityChange,
    onDistrictChange,
    mapCenter,
    provinces, cities, districts,
    loadingProvinces, loadingCities, loadingDistricts,
    watchedProvinceId,
    watchedCityId,
    onSubmit,
    isSubmitting,
  } = useAddressForm({ address, onSuccess, existingLabels });

  const { register, control, watch, formState: { errors } } = form;
  const lat = watch('latitude');
  const lng = watch('longitude');

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {/* Label */}
      <div className="space-y-1.5">
        <Label htmlFor="label">Label Alamat <span className="text-destructive">*</span></Label>
        <Input id="label" placeholder="cth: Rumah, Kantor" {...register('label')} />
        {errors.label && <p className="text-xs text-destructive">{errors.label.message}</p>}
      </div>

      {/* Recipient */}
      <div className="space-y-1.5">
        <Label htmlFor="recipient_name">Nama Penerima <span className="text-destructive">*</span></Label>
        <Input id="recipient_name" {...register('recipient_name')} />
        {errors.recipient_name && <p className="text-xs text-destructive">{errors.recipient_name.message}</p>}
      </div>

      {/* Phone */}
      <div className="space-y-1.5">
        <Label htmlFor="phone">Nomor HP <span className="text-destructive">*</span></Label>
        <Input id="phone" type="tel" {...register('phone')} />
        {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
      </div>

      {/* Province */}
      <div className="space-y-1.5">
        <Label>Provinsi <span className="text-destructive">*</span></Label>
        <Controller
          control={control}
          name="province_id"
          render={({ field }) => (
            <Select
              disabled={loadingProvinces}
              value={field.value ? String(field.value) : ''}
              onValueChange={val => onProvinceChange(Number(val))}
            >
              <SelectTrigger>
                <SelectValue placeholder={loadingProvinces ? 'Memuat...' : 'Pilih provinsi'} />
              </SelectTrigger>
              <SelectContent>
                {provinces.map(p => (
                  <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.province_id && <p className="text-xs text-destructive">{errors.province_id.message}</p>}
      </div>

      {/* City */}
      <div className="space-y-1.5">
        <Label>Kota / Kabupaten <span className="text-destructive">*</span></Label>
        <Controller
          control={control}
          name="city_id"
          render={({ field }) => (
            <Select
              disabled={!watchedProvinceId || loadingCities}
              value={field.value ? String(field.value) : ''}
              onValueChange={val => onCityChange(Number(val))}
            >
              <SelectTrigger>
                <SelectValue placeholder={
                  !watchedProvinceId ? 'Pilih provinsi dulu'
                    : loadingCities ? 'Memuat...'
                    : 'Pilih kota'
                } />
              </SelectTrigger>
              <SelectContent>
                {cities.map(c => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {[c.type, c.name].filter(Boolean).join(' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.city_id && <p className="text-xs text-destructive">{errors.city_id.message}</p>}
      </div>

      {/* District */}
      <div className="space-y-1.5">
        <Label>Kecamatan <span className="text-destructive">*</span></Label>
        <Controller
          control={control}
          name="district_id"
          render={({ field }) => (
            <Select
              disabled={!watchedCityId || loadingDistricts}
              value={field.value ? String(field.value) : ''}
              onValueChange={val => onDistrictChange(Number(val), districts, cities, provinces)}
            >
              <SelectTrigger>
                <SelectValue placeholder={
                  !watchedCityId ? 'Pilih kota dulu'
                    : loadingDistricts ? 'Memuat...'
                    : 'Pilih kecamatan'
                } />
              </SelectTrigger>
              <SelectContent>
                {districts.map(d => (
                  <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.district_id && <p className="text-xs text-destructive">{errors.district_id.message}</p>}
      </div>

      {/* Postal Code */}
      <div className="space-y-1.5">
        <Label htmlFor="postal_code">Kode Pos</Label>
        <Input id="postal_code" maxLength={10} {...register('postal_code')} />
      </div>

      {/* Full Address */}
      <div className="space-y-1.5">
        <Label htmlFor="address">Alamat Lengkap <span className="text-destructive">*</span></Label>
        <Textarea
          id="address"
          rows={3}
          placeholder="Nama jalan, nomor rumah, RT/RW, dll."
          {...register('address')}
        />
        {errors.address && <p className="text-xs text-destructive">{errors.address.message}</p>}
      </div>

      {/* GPS + Map */}
      <div className="space-y-2">
        <Label>Pin Lokasi di Peta <span className="text-destructive">*</span></Label>
        <p className="text-xs text-muted-foreground">
          Tandai titik lokasi pengiriman di peta. Ini hanya untuk koordinat peta — isi provinsi, kota, dan kecamatan secara manual di atas.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={detectLocation}
            disabled={locationStatus === 'locating'}
            className="gap-2"
          >
            {locationStatus === 'locating' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LocateFixed className="h-4 w-4" />
            )}
            {locationStatus === 'locating' ? 'Mendeteksi...' : 'Lokasi Saya'}
          </Button>

          {locationStatus === 'found' && lat != null && lng != null && (
            <span className="flex items-center gap-1 text-xs text-green-600">
              <CheckCircle2 className="h-3.5 w-3.5" />
              ({lat.toFixed(5)}, {lng.toFixed(5)})
            </span>
          )}
          {locationStatus === 'denied' && (
            <span className="flex items-center gap-1 text-xs text-destructive">
              <XCircle className="h-3.5 w-3.5" /> Akses lokasi ditolak
            </span>
          )}
          {locationStatus === 'error' && (
            <span className="flex items-center gap-1 text-xs text-destructive">
              <XCircle className="h-3.5 w-3.5" /> Gagal mendeteksi
            </span>
          )}
        </div>

        <MapPicker lat={lat ?? null} lng={lng ?? null} onPositionChange={setCoords} centerOn={mapCenter} />

        {(errors.latitude || errors.longitude) && (
          <p className="text-xs text-destructive">Titik lokasi wajib ditentukan</p>
        )}
      </div>

      {/* Set as Primary */}
      <div className="flex items-center gap-2">
        <Controller
          control={control}
          name="is_primary"
          render={({ field }) => (
            <Checkbox
              id="is_primary"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
        <Label htmlFor="is_primary" className="cursor-pointer font-normal">
          Jadikan alamat utama
        </Label>
      </div>

      {/* Submit */}
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
        {isEdit ? 'Simpan Perubahan' : 'Tambah Alamat'}
      </Button>
    </form>
  );
}
