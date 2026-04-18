import axios from 'axios';

type OpenCageComponent = {
  road?: string;
  house_number?: string;
  neighbourhood?: string;
  suburb?: string;
  city_district?: string;
  city?: string;
  county?: string;
  state?: string;
  postcode?: string;
};

type OpenCageResult = {
  components: OpenCageComponent;
  formatted: string;
  geometry: { lat: number; lng: number };
};

type OpenCageResponse = {
  results: OpenCageResult[];
  status: { code: number; message: string };
};

export type ReverseGeocodeResult = {
  addressText: string | null;
  provinceName: string | null;
  cityName: string | null;
  districtName: string | null;
  postalCode: string | null;
};

async function fetchOpenCage(lat: number, lng: number): Promise<OpenCageResult | null> {
  const apiKey = process.env.NEXT_PUBLIC_OPENCAGE_API_KEY;
  if (!apiKey) return null;

  const { data } = await axios.get<OpenCageResponse>(
    'https://api.opencagedata.com/geocode/v1/json',
    {
      params: {
        q: `${lat}+${lng}`,
        key: apiKey,
        language: 'id',
        no_annotations: 1,
        limit: 1,
      },
    },
  );
  return data.results[0] ?? null;
}

/**
 * Reverse geocodes lat/lng to a short display name (suburb or city).
 * Used by the location store for the navbar display.
 */
export async function reverseGeocodeApi(lat: number, lng: number): Promise<string | null> {
  const result = await fetchOpenCage(lat, lng).catch(() => null);
  if (!result) return null;
  const { suburb, city_district, city, county, state } = result.components;
  return suburb ?? city_district ?? city ?? county ?? state ?? result.formatted;
}

/**
 * Reverse geocodes lat/lng to structured address data for form autofill.
 * Returns all fields needed to populate the address form dropdowns + text.
 */
export async function reverseGeocodeFullApi(lat: number, lng: number): Promise<ReverseGeocodeResult> {
  const empty: ReverseGeocodeResult = {
    addressText: null, provinceName: null, cityName: null,
    districtName: null, postalCode: null,
  };

  const result = await fetchOpenCage(lat, lng).catch(() => null);
  if (!result) return empty;

  const { road, house_number, neighbourhood, suburb, city_district, city, county, state, postcode } =
    result.components;

  const roadText = road && house_number ? `${road} No. ${house_number}` : road ?? null;
  const addressText = [roadText, neighbourhood].filter(Boolean).join(', ') || result.formatted;

  return {
    addressText,
    provinceName: state ?? null,
    // For Indonesia: county is kabupaten/kota (more reliable than city which can be missing)
    cityName: county ?? city ?? null,
    // city_district is kecamatan; suburb is usually kelurahan (too deep)
    districtName: city_district ?? suburb ?? null,
    postalCode: postcode ?? null,
  };
}

/**
 * Forward geocodes a place name to coordinates using OpenCage.
 * Uses the same API key already configured for reverse geocoding.
 */
export async function forwardGeocodeApi(
  query: string,
): Promise<{ lat: number; lng: number } | null> {
  const apiKey = process.env.NEXT_PUBLIC_OPENCAGE_API_KEY;
  if (!apiKey) return null;

  const { data } = await axios.get<OpenCageResponse>(
    'https://api.opencagedata.com/geocode/v1/json',
    {
      params: { q: query, key: apiKey, language: 'id', no_annotations: 1, limit: 1, countrycode: 'id' },
    },
  );
  const result = data.results[0];
  if (!result) return null;
  return { lat: result.geometry.lat, lng: result.geometry.lng };
}

