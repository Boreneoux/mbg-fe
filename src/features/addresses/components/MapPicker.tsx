'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icons broken by webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

type Props = {
  lat: number | null;
  lng: number | null;
  onPositionChange: (lat: number, lng: number) => void;
  /** Pan the map to these coordinates without placing or moving the pin. */
  centerOn?: { lat: number; lng: number } | null;
};

// Default center: Indonesia
const DEFAULT_CENTER: [number, number] = [-2.5, 118];
const DEFAULT_ZOOM = 5;
const PIN_ZOOM = 15;
const DISTRICT_ZOOM = 13;

export function MapPicker({ lat, lng, onPositionChange, centerOn }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<L.Map | null>(null);
  const markerRef    = useRef<L.Marker | null>(null);

  // Init map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: lat && lng ? [lat, lng] : DEFAULT_CENTER,
      zoom:   lat && lng ? PIN_ZOOM : DEFAULT_ZOOM,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20,
    }).addTo(map);

    if (lat && lng) {
      const marker = L.marker([lat, lng], { draggable: true }).addTo(map);
      marker.on('dragend', () => {
        const pos = marker.getLatLng();
        onPositionChange(pos.lat, pos.lng);
      });
      markerRef.current = marker;
    }

    // Click to place / move pin
    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat: clickLat, lng: clickLng } = e.latlng;
      if (markerRef.current) {
        markerRef.current.setLatLng([clickLat, clickLng]);
      } else {
        const marker = L.marker([clickLat, clickLng], { draggable: true }).addTo(map);
        marker.on('dragend', () => {
          const pos = marker.getLatLng();
          onPositionChange(pos.lat, pos.lng);
        });
        markerRef.current = marker;
      }
      onPositionChange(clickLat, clickLng);
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Pan view when centerOn changes (no pin placed/moved)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !centerOn) return;
    map.setView([centerOn.lat, centerOn.lng], DISTRICT_ZOOM);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [centerOn]);

  // Move marker when lat/lng changes externally (e.g. GPS autofill)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || lat == null || lng == null) return;

    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    } else {
      const marker = L.marker([lat, lng], { draggable: true }).addTo(map);
      marker.on('dragend', () => {
        const pos = marker.getLatLng();
        onPositionChange(pos.lat, pos.lng);
      });
      markerRef.current = marker;
    }
    map.setView([lat, lng], PIN_ZOOM);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat, lng]);

  return (
    <div className="isolate">
      <div
        ref={containerRef}
        className="h-56 w-full rounded-lg border border-border overflow-hidden"
      />
    </div>
  );
}
