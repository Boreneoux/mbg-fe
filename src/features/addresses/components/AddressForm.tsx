'use client';

import dynamic from 'next/dynamic';
import { LocateFixed, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const LABEL_TEMPLATES = ['Rumah', 'Kantor', 'Kos', 'Apartemen', 'Gudang'];

const MapPicker = dynamic(
  () => import('./MapPicker').then(m => m.MapPicker),
  { ssr: false, loading: () => <div className="h-56 w-full rounded-lg border border-border bg-muted animate-pulse" /> }
);
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
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

  const lat = form.watch('latitude');
  const lng = form.watch('longitude');

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-5">
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Label Alamat <span className="text-destructive">*</span></FormLabel>
              <div className="flex flex-wrap gap-2 mb-1">
                {LABEL_TEMPLATES.map(tpl => {
                  const isActive = field.value?.toLowerCase() === tpl.toLowerCase();
                  return (
                    <button
                      key={tpl}
                      type="button"
                      onClick={() => field.onChange(isActive ? '' : tpl)}
                      className={cn(
                        'rounded-full border px-3 py-1 text-sm transition-colors',
                        isActive
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-background text-muted-foreground hover:border-primary hover:text-primary',
                      )}
                    >
                      {tpl}
                    </button>
                  );
                })}
              </div>
              <FormControl>
                <Input placeholder="atau ketik label sendiri..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="recipient_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Penerima <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nomor HP <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                <Input type="tel" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="province_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Provinsi <span className="text-destructive">*</span></FormLabel>
              <Select
                disabled={loadingProvinces}
                value={field.value ? String(field.value) : ''}
                onValueChange={onProvinceChange}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={loadingProvinces ? 'Memuat...' : 'Pilih provinsi'} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {provinces.map(p => (
                    <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>
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
              <FormLabel>Kota / Kabupaten <span className="text-destructive">*</span></FormLabel>
              <Select
                disabled={!watchedProvinceId || loadingCities}
                value={field.value ? String(field.value) : ''}
                onValueChange={onCityChange}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={
                      !watchedProvinceId ? 'Pilih provinsi dulu'
                        : loadingCities ? 'Memuat...'
                        : 'Pilih kota'
                    } />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {cities.map(c => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {[c.type, c.name].filter(Boolean).join(' ')}
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
          name="district_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kecamatan <span className="text-destructive">*</span></FormLabel>
              <Select
                disabled={!watchedCityId || loadingDistricts}
                value={field.value ? String(field.value) : ''}
                onValueChange={val => onDistrictChange(val, districts, cities, provinces)}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={
                      !watchedCityId ? 'Pilih kota dulu'
                        : loadingDistricts ? 'Memuat...'
                        : 'Pilih kecamatan'
                    } />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {districts.map(d => (
                    <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>
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
                <Input maxLength={10} {...field} />
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
              <FormLabel>Alamat Lengkap <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                <Textarea
                  rows={3}
                  placeholder="Nama jalan, nomor rumah, RT/RW, dll."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* GPS + Map */}
        <div className="space-y-2">
          <FormLabel>Pin Lokasi di Peta <span className="text-destructive">*</span></FormLabel>
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

          {(form.formState.errors.latitude || form.formState.errors.longitude) && (
            <p className="text-xs text-destructive">Titik lokasi wajib ditentukan</p>
          )}
        </div>

        <FormField
          control={form.control}
          name="is_primary"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="cursor-pointer font-normal">
                Jadikan alamat utama
              </FormLabel>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          {isEdit ? 'Simpan Perubahan' : 'Tambah Alamat'}
        </Button>
      </form>
    </Form>
  );
}
