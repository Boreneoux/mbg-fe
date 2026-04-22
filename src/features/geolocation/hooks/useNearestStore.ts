import { useCallback } from 'react';
import { isAxiosError } from 'axios';
import useLocationStore from '@/stores/useLocationStore';
import { getNearestStoreApi } from '@/features/geolocation/api/nearest-store.api';
import { reverseGeocodeApi } from '@/features/geolocation/api/geocoding.api';
import { FALLBACK_STORE_ID } from '@/mocks/handlers/stores.handlers';

// Fallback store name matches FALLBACK_STORE_ID = 1
const FALLBACK_STORE_NAME = 'MagerBeliGrocery – Sudirman';

export function useNearestStore() {
  const {
    setStatus,
    setSelectedStore,
    setDisplayLocation,
    setCoordinates,
    setOutOfRangeMessage,
    setHasPrompted,
  } = useLocationStore();

  const resolveNearestStore = useCallback(
    async (lat: number, lng: number) => {
      setCoordinates({ lat, lng });
      setStatus('locating');

      // Reverse geocode in parallel with nearest-store lookup — fire and forget
      reverseGeocodeApi(lat, lng)
        .then((name) => setDisplayLocation(name))
        .catch(() => null);

      try {
        const result = await getNearestStoreApi(lat, lng);
        setSelectedStore(result.store.id, result.store.name);
        setStatus('found');
      } catch (err) {
        if (isAxiosError(err) && err.response?.status === 404) {
          const message: string =
            err.response.data?.message ?? 'No store delivers to your location.';
          setOutOfRangeMessage(message);
          setSelectedStore(FALLBACK_STORE_ID, FALLBACK_STORE_NAME);
          setStatus('out_of_range');
        } else {
          setSelectedStore(FALLBACK_STORE_ID, FALLBACK_STORE_NAME);
          setStatus('error');
        }
      }
    },
    [setCoordinates, setStatus, setSelectedStore, setDisplayLocation, setOutOfRangeMessage],
  );

  const promptLocation = useCallback(() => {
    setHasPrompted(true);

    if (!navigator.geolocation) {
      setSelectedStore(FALLBACK_STORE_ID, FALLBACK_STORE_NAME);
      setStatus('error');
      return;
    }

    setStatus('locating');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolveNearestStore(
          position.coords.latitude,
          position.coords.longitude,
        );
      },
      () => {
        // User denied browser permission
        setSelectedStore(FALLBACK_STORE_ID, FALLBACK_STORE_NAME);
        setStatus('denied');
      },
    );
  }, [setHasPrompted, setStatus, setSelectedStore, resolveNearestStore]);

  const skipLocation = useCallback(() => {
    setHasPrompted(true);
    setSelectedStore(FALLBACK_STORE_ID, FALLBACK_STORE_NAME);
    setStatus('denied');
  }, [setHasPrompted, setSelectedStore, setStatus]);

  return { promptLocation, skipLocation, resolveNearestStore };
}
