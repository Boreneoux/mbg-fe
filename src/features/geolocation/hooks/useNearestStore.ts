import { useCallback } from 'react';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import useLocationStore from '@/stores/useLocationStore';
import { getNearestStoreApi } from '@/features/geolocation/api/nearest-store.api';
import { reverseGeocodeApi } from '@/features/geolocation/api/geocoding.api';

type Actions = {
  setStatus: (s: Parameters<ReturnType<typeof useLocationStore.getState>['setStatus']>[0]) => void;
  setSelectedStore: (id: string, name: string, slug: string) => void;
  clearStore: () => void;
  setDisplayLocation: (name: string | null) => void;
  setOutOfRangeMessage: (msg: string | null) => void;
};

async function resolveStore(lat: number, lng: number, actions: Actions) {
  try {
    const result = await getNearestStoreApi(lat, lng);
    actions.setOutOfRangeMessage(null);
    actions.setSelectedStore(result.store.id, result.store.name, result.store.slug);
    actions.setStatus('found');
    reverseGeocodeApi(lat, lng)
      .then((name) => actions.setDisplayLocation(name))
      .catch(() => null);
  } catch (err) {
    if (isAxiosError(err) && err.response?.status === 404) {
      const message: string =
        err.response.data?.message ?? 'Layanan tidak tersedia di lokasi ini.';
      actions.setOutOfRangeMessage(message);
      actions.clearStore();
      actions.setStatus('out_of_range');
    } else {
      actions.clearStore();
      actions.setStatus('error');
    }
  }
}

export function useNearestStore() {
  const {
    setStatus,
    setSelectedStore,
    clearStore,
    setDisplayLocation,
    setCoordinates,
    setOutOfRangeMessage,
    setHasPrompted,
  } = useLocationStore();

  const actions: Actions = { setStatus, setSelectedStore, clearStore, setDisplayLocation, setOutOfRangeMessage };

  const resolveNearestStore = useCallback(
    async (lat: number, lng: number) => {
      setCoordinates({ lat, lng });
      setStatus('locating');
      await resolveStore(lat, lng, actions);
    },
    [setCoordinates, setStatus, setSelectedStore, clearStore, setDisplayLocation, setOutOfRangeMessage],
  );

  const resolveNearestStoreSilently = useCallback(
    async (lat: number, lng: number) => {
      await resolveStore(lat, lng, actions);
    },
    [setStatus, setSelectedStore, clearStore, setDisplayLocation, setOutOfRangeMessage],
  );

  const resolveWithFreshGPS = useCallback(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoordinates({ lat: latitude, lng: longitude });
        resolveStore(latitude, longitude, actions);
      },
      () => null, // silent fail — keep existing store
      { enableHighAccuracy: true, timeout: 10_000, maximumAge: 60_000 },
    );
  }, [setCoordinates, setSelectedStore, clearStore, setDisplayLocation, setOutOfRangeMessage]);

  const promptLocation = useCallback(() => {
    setHasPrompted(true);

    if (!navigator.geolocation) {
      clearStore();
      setStatus('error');
      toast.error('Perangkat tidak mendukung GPS');
      return;
    }

    setStatus('locating');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolveNearestStore(position.coords.latitude, position.coords.longitude);
      },
      (err) => {
        clearStore();
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
  }, [setHasPrompted, setStatus, clearStore, resolveNearestStore]);

  const skipLocation = useCallback(() => {
    setHasPrompted(true);
    clearStore();
    setStatus('denied');
  }, [setHasPrompted, clearStore, setStatus]);

  return { promptLocation, skipLocation, resolveNearestStore, resolveNearestStoreSilently, resolveWithFreshGPS };
}
