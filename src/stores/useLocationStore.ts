import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { LocationStatus, Coordinates } from '@/features/geolocation/types';

type LocationStore = {
  status: LocationStatus;
  selectedStoreId: number | null;
  selectedStoreName: string | null;
  /** Human-readable location name from OpenCage reverse geocoding (e.g. "Cilandak") */
  displayLocation: string | null;
  coordinates: Coordinates | null;
  outOfRangeMessage: string | null;
  hasPrompted: boolean;

  setStatus: (status: LocationStatus) => void;
  setSelectedStore: (id: number, name: string) => void;
  setDisplayLocation: (name: string | null) => void;
  setCoordinates: (coords: Coordinates | null) => void;
  setOutOfRangeMessage: (msg: string | null) => void;
  setHasPrompted: (prompted: boolean) => void;
  openLocationDialog: () => void;
};

const useLocationStore = create<LocationStore>()(
  persist(
    (set) => ({
      status: 'idle',
      selectedStoreId: null,
      selectedStoreName: null,
      displayLocation: null,
      coordinates: null,
      outOfRangeMessage: null,
      hasPrompted: false,

      setStatus: (status) => set({ status }),
      setSelectedStore: (id, name) =>
        set({ selectedStoreId: id, selectedStoreName: name }),
      setDisplayLocation: (displayLocation) => set({ displayLocation }),
      setCoordinates: (coordinates) => set({ coordinates }),
      setOutOfRangeMessage: (outOfRangeMessage) => set({ outOfRangeMessage }),
      setHasPrompted: (hasPrompted) => set({ hasPrompted }),
      openLocationDialog: () => set({ status: 'prompting' }),
    }),
    {
      name: 'mbg-location',
      storage: createJSONStorage(() => localStorage),
      // Only persist what's needed across sessions
      partialize: (state) => ({
        hasPrompted: state.hasPrompted,
        selectedStoreId: state.selectedStoreId,
        selectedStoreName: state.selectedStoreName,
        displayLocation: state.displayLocation,
        coordinates: state.coordinates,
      }),
    },
  ),
);

export default useLocationStore;
