'use client';

import { useState, useEffect } from 'react';
import { isAxiosError } from 'axios';
import { Province, City, District } from '../types';
import { getProvincesApi, getCitiesApi, getDistrictsApi } from '../api/region.api';

// Province list never changes — fetch once and cache in module scope
let cachedProvinces: Province[] | null = null;

export function useRegions(provinceId: string | null, cityId: string | null) {
  const [provinces, setProvinces] = useState<Province[]>(cachedProvinces ?? []);
  const [cities, setCities] = useState<City[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);

  const [loadingProvinces, setLoadingProvinces] = useState(!cachedProvinces);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);

  // Fetch provinces once
  useEffect(() => {
    if (cachedProvinces) return;
    setLoadingProvinces(true);
    getProvincesApi()
      .then(data => {
        cachedProvinces = data;
        setProvinces(data);
      })
      .catch(err => {
        const msg = isAxiosError(err) ? (err.response?.data?.message ?? 'Gagal memuat provinsi') : 'Gagal memuat provinsi';
        console.error(msg);
      })
      .finally(() => setLoadingProvinces(false));
  }, []);

  // Fetch cities when province changes
  useEffect(() => {
    if (!provinceId) {
      setCities([]);
      setDistricts([]);
      return;
    }
    setLoadingCities(true);
    setCities([]);
    setDistricts([]);
    getCitiesApi(provinceId)
      .then(setCities)
      .catch(err => {
        const msg = isAxiosError(err) ? (err.response?.data?.message ?? 'Gagal memuat kota') : 'Gagal memuat kota';
        console.error(msg);
      })
      .finally(() => setLoadingCities(false));
  }, [provinceId]);

  // Fetch districts when city changes
  useEffect(() => {
    if (!cityId) {
      setDistricts([]);
      return;
    }
    setLoadingDistricts(true);
    setDistricts([]);
    getDistrictsApi(cityId)
      .then(setDistricts)
      .catch(err => {
        const msg = isAxiosError(err) ? (err.response?.data?.message ?? 'Gagal memuat kecamatan') : 'Gagal memuat kecamatan';
        console.error(msg);
      })
      .finally(() => setLoadingDistricts(false));
  }, [cityId]);

  return {
    provinces, cities, districts,
    loadingProvinces, loadingCities, loadingDistricts,
  };
}
