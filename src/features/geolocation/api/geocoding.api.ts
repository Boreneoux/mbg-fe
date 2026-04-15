import axios from 'axios';

type OpenCageComponent = {
  suburb?: string;
  city_district?: string;
  city?: string;
  county?: string;
  state?: string;
};

type OpenCageResult = {
  components: OpenCageComponent;
  formatted: string;
};

type OpenCageResponse = {
  results: OpenCageResult[];
  status: { code: number; message: string };
};

/**
 * Reverse geocodes lat/lng to a short display name (suburb or city).
 * Returns null if the API call fails or returns no results.
 */
export async function reverseGeocodeApi(
  lat: number,
  lng: number,
): Promise<string | null> {
  const apiKey = process.env.NEXT_PUBLIC_OPENCAGE_API_KEY;
  if (!apiKey) return null;

  const response = await axios.get<OpenCageResponse>(
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

  const result = response.data.results[0];
  if (!result) return null;

  const { suburb, city_district, city, county, state } = result.components;
  return suburb ?? city_district ?? city ?? county ?? state ?? result.formatted;
}
