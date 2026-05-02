'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import { addressSchema, AddressFormValues } from '../schemas/address.schema';
import { createAddressApi, updateAddressApi } from '../api/address.api';
import { getProvincesApi, getCitiesApi, getDistrictsApi } from '../api/region.api';
import { forwardGeocodeApi } from '@/features/geolocation/api/geocoding.api';
import { Province, City, District, UserAddress } from '../types';

type UseAddressFormOptions = {
  address?: UserAddress;
  onSuccess: (saved: UserAddress) => void;
  existingLabels?: string[];
};

export type LocationStatus = 'idle' | 'locating' | 'found' | 'error' | 'denied';

let cachedProvinces: Province[] | null = null;

export function useAddressForm({ address, onSuccess, existingLabels = [] }: UseAddressFormOptions) {
  const isEdit = !!address;

  const [locationStatus, setLocationStatus] = useState<LocationStatus>(
    isEdit ? 'found' : 'idle',
  );
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);
  const geocodingRef = useRef(false);

  const [provinces, setProvinces]               = useState<Province[]>(cachedProvinces ?? []);
  const [cities, setCities]                     = useState<City[]>([]);
  const [districts, setDistricts]               = useState<District[]>([]);
  const [loadingProvinces, setLoadingProvinces] = useState(!cachedProvinces);
  const [loadingCities, setLoadingCities]       = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    reValidateMode: 'onSubmit',
    defaultValues: {
      label:          address?.label ?? '',
      recipient_name: address?.recipient_name ?? '',
      phone:          address?.phone ?? '',
      address:        address?.address ?? '',
      province_id:    address?.province_id ?? '',
      city_id:        address?.city_id ?? '',
      district_id:    address?.district_id ?? '',
      postal_code:    address?.postal_code ?? '',
      latitude:       address?.latitude,
      longitude:      address?.longitude,
      is_primary:     address?.is_primary ?? false,
    },
  });

  const watchedProvinceId = form.watch('province_id');
  const watchedCityId     = form.watch('city_id');

  // Load provinces once
  useEffect(() => {
    if (cachedProvinces) return;
    setLoadingProvinces(true);
    getProvincesApi()
      .then(data => { cachedProvinces = data; setProvinces(data); })
      .catch(() => null)
      .finally(() => setLoadingProvinces(false));
  }, []);

  // Pre-load cities/districts for edit mode
  useEffect(() => {
    if (!isEdit || !address) return;
    setLoadingCities(true);
    getCitiesApi(address.province_id)
      .then(setCities)
      .catch(() => null)
      .finally(() => setLoadingCities(false));
  }, [isEdit, address?.province_id]);

  useEffect(() => {
    if (!isEdit || !address) return;
    setLoadingDistricts(true);
    getDistrictsApi(address.city_id)
      .then(setDistricts)
      .catch(() => null)
      .finally(() => setLoadingDistricts(false));
  }, [isEdit, address?.city_id]);

  // Called only from the Province Select's onValueChange (user interaction only)
  function onProvinceChange(provinceId: string) {
    form.setValue('province_id', provinceId);
    form.setValue('city_id', '');
    form.setValue('district_id', '');
    setCities([]);
    setDistricts([]);
    setLoadingCities(true);
    getCitiesApi(provinceId)
      .then(setCities)
      .catch(() => null)
      .finally(() => setLoadingCities(false));
  }

  // Called only from the City Select's onValueChange (user interaction only)
  function onCityChange(cityId: string) {
    form.setValue('city_id', cityId);
    form.setValue('district_id', '');
    setDistricts([]);
    setLoadingDistricts(true);
    getDistrictsApi(cityId)
      .then(setDistricts)
      .catch(() => null)
      .finally(() => setLoadingDistricts(false));
  }

  function onDistrictChange(districtId: string, currentDistricts: District[], currentCities: City[], currentProvinces: Province[]) {
    form.setValue('district_id', districtId);

    if (!districtId || geocodingRef.current) return;
    const district = currentDistricts.find((d) => d.id === districtId);
    const city = currentCities.find((c) => c.id === form.getValues('city_id'));
    const province = currentProvinces.find((p) => p.id === form.getValues('province_id'));
    if (!district || !city || !province) return;

    geocodingRef.current = true;
    const query = `${district.name}, ${city.name}, ${province.name}, Indonesia`;
    forwardGeocodeApi(query)
      .then((result) => {
        if (!result) return;
        setMapCenter(result);
        const lat = form.getValues('latitude');
        const lng = form.getValues('longitude');
        if (!lat || !lng) {
          form.setValue('latitude', result.lat);
          form.setValue('longitude', result.lng);
          setLocationStatus('found');
        }
      })
      .catch(() => null)
      .finally(() => { geocodingRef.current = false; });
  }

  function setCoords(lat: number, lng: number) {
    form.setValue('latitude', lat);
    form.setValue('longitude', lng);
    if (locationStatus !== 'found') setLocationStatus('found');
  }

  function detectLocation() {
    if (!navigator.geolocation) {
      toast.error('Browser tidak mendukung geolokasi');
      return;
    }
    setLocationStatus('locating');
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        form.setValue('latitude', coords.latitude);
        form.setValue('longitude', coords.longitude);
        setLocationStatus('found');
      },
      () => {
        setLocationStatus('denied');
        toast.error('Akses lokasi ditolak. Izinkan lokasi di browser kamu.');
      },
      { timeout: 10000 },
    );
  }

  async function onSubmit(values: AddressFormValues) {
    const labelLower = values.label?.toLowerCase() ?? '';
    const isDuplicate = existingLabels.some(l => l.toLowerCase() === labelLower);
    if (isDuplicate) {
      form.setError('label', { message: 'Label sudah digunakan di alamat lain' });
      return;
    }

    try {
      const payload = { ...values };
      const saved = isEdit
        ? await updateAddressApi(address!.id, payload)
        : await createAddressApi(payload);
      toast.success(isEdit ? 'Alamat berhasil diperbarui' : 'Alamat berhasil ditambahkan');
      onSuccess(saved);
    } catch (err) {
      const message = isAxiosError(err)
        ? (err.response?.data?.message ?? 'Gagal menyimpan alamat')
        : 'Gagal menyimpan alamat';
      toast.error(message);
      throw err;
    }
  }

  return {
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
    watchedProvinceId: watchedProvinceId || null,
    watchedCityId:     watchedCityId || null,
    onSubmit: form.handleSubmit(onSubmit),
    isSubmitting: form.formState.isSubmitting,
  };
}
