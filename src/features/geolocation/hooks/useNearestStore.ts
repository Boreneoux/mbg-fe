import { useCallback } from 'react';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import useLocationStore from '@/stores/useLocationStore';
import { getNearestStoreApi } from '@/features/geolocation/api/nearest-store.api';
import { reverseGeocodeApi } from '@/features/geolocation/api/geocoding.api';
import { FALLBACK_STORE_ID } from '@/mocks/handlers/stores.handlers';

const FALLBACK_STORE_NAME = 'MagerBeliGrocery – Sudirman';

type Actions = {
  setStatus: (s: Parameters<ReturnType<typeof useLocationStore.getState>['setStatus']>[0]) => void;
  setSelectedStore: (id: string, name: string) => void;
  setDisplayLocation: (name: string | null) => void;
  setOutOfRangeMessage: (msg: string | null) => void;
};

async function resolveStore(lat: number, lng: number, actions: Actions) {
  try {
    const result = await getNearestStoreApi(lat, lng);
    actions.setSelectedStore(result.store.id, result.store.name);
    actions.setStatus('found');
    // Resolve display name after store is confirmed — avoids showing geocoded label when fallback is used
    reverseGeocodeApi(lat, lng)
      .then((name) => actions.setDisplayLocation(name))
      .catch(() => null);
  } catch (err) {
    if (isAxiosError(err) && err.response?.status === 404) {
      const message: string =
        err.response.data?.message ?? 'No store delivers to your location.';
      actions.setOutOfRangeMessage(message);
      actions.setSelectedStore(FALLBACK_STORE_ID, FALLBACK_STORE_NAME);
      actions.setStatus('out_of_range');
    } else {
      actions.setSelectedStore(FALLBACK_STORE_ID, FALLBACK_STORE_NAME);
      actions.setStatus('error');
    }
  }
}

export function useNearestStore() {
  const {
    setStatus,
    setSelectedStore,
    setDisplayLocation,
    setCoordinates,
    setOutOfRangeMessage,
    setHasPrompted,
  } = useLocationStore();

  const actions: Actions = { setStatus, setSelectedStore, setDisplayLocation, setOutOfRangeMessage };

  // Used when user explicitly clicks "Izinkan Lokasi" — shows loading spinner in dialog
  const resolveNearestStore = useCallback(
    async (lat: number, lng: number) => {
      setCoordinates({ lat, lng });
      setStatus('locating');
      await resolveStore(lat, lng, actions);
    },
    [setCoordinates, setStatus, setSelectedStore, setDisplayLocation, setOutOfRangeMessage],
  );

  // Used on page load when coordinates are cached — no dialog, no spinner
  const resolveNearestStoreSilently = useCallback(
    async (lat: number, lng: number) => {
      await resolveStore(lat, lng, actions);
    },
    [setStatus, setSelectedStore, setDisplayLocation, setOutOfRangeMessage],
  );

  const promptLocation = useCallback(() => {
    setHasPrompted(true);

    if (!navigator.geolocation) {
      setSelectedStore(FALLBACK_STORE_ID, FALLBACK_STORE_NAME);
      setStatus('error');
      toast.error('Perangkat tidak mendukung GPS');
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
      (err) => {
        setSelectedStore(FALLBACK_STORE_ID, FALLBACK_STORE_NAME);
        setStatus('denied');

        if (err.code === err.PERMISSION_DENIED) {
          toast.error('Akses lokasi ditolak. Ubah izin di pengaturan browser.');
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          toast.error('Lokasi tidak tersedia. Pastikan GPS aktif dan coba lagi.');
        } else {
          toast.error('Gagal mendapatkan lokasi GPS. Coba gunakan alamat tersimpan.');
        }
      },
      { enableHighAccuracy: true, timeout: 10_000, maximumAge: 0 },
    );
  }, [setHasPrompted, setStatus, setSelectedStore, resolveNearestStore]);

  const skipLocation = useCallback(() => {
    setHasPrompted(true);
    setSelectedStore(FALLBACK_STORE_ID, FALLBACK_STORE_NAME);
    setStatus('denied');
  }, [setHasPrompted, setSelectedStore, setStatus]);

  return { promptLocation, skipLocation, resolveNearestStore, resolveNearestStoreSilently };
}
