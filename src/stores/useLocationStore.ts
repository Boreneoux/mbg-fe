import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { LocationStatus, Coordinates } from '@/features/geolocation/types';

type LocationStore = {
  status: LocationStatus;
  selectedStoreId: string | null;
  selectedStoreSlug: string | null;
  selectedStoreName: string | null;
  displayLocation: string | null;
  coordinates: Coordinates | null;
  outOfRangeMessage: string | null;
  hasPrompted: boolean;
  selectedAddressId: string | null;

  setStatus: (status: LocationStatus) => void;
  setSelectedStore: (id: string, name: string, slug: string) => void;
  clearStore: () => void;
  setDisplayLocation: (name: string | null) => void;
  setCoordinates: (coords: Coordinates | null) => void;
  setOutOfRangeMessage: (msg: string | null) => void;
  setHasPrompted: (prompted: boolean) => void;
  setSelectedAddressId: (id: string | null) => void;
  openLocationDialog: () => void;
};

const useLocationStore = create<LocationStore>()(
  persist(
    set => ({
      status: 'idle',
      selectedStoreId: null,
      selectedStoreSlug: null,
      selectedStoreName: null,
      displayLocation: null,
      coordinates: null,
      outOfRangeMessage: null,
      hasPrompted: false,
      selectedAddressId: null,

      setStatus: status => set({ status }),
      setSelectedStore: (id, name, slug) =>
        set({ selectedStoreId: id, selectedStoreName: name, selectedStoreSlug: slug }),
      clearStore: () => set({ selectedStoreId: null, selectedStoreName: null, selectedStoreSlug: null }),
      setDisplayLocation: displayLocation => set({ displayLocation }),
      setCoordinates: coordinates => set({ coordinates }),
      setOutOfRangeMessage: outOfRangeMessage => set({ outOfRangeMessage }),
      setHasPrompted: hasPrompted => set({ hasPrompted }),
      setSelectedAddressId: selectedAddressId => set({ selectedAddressId }),
      openLocationDialog: () => set({ status: 'prompting' })
    }),
    {
      name: 'mbg-location',
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({
        hasPrompted: state.hasPrompted,
        selectedStoreId: state.selectedStoreId,
        selectedStoreSlug: state.selectedStoreSlug,
        selectedStoreName: state.selectedStoreName,
        displayLocation: state.displayLocation,
        coordinates: state.coordinates,
        selectedAddressId: state.selectedAddressId
      })
    }
  )
);

export default useLocationStore;
