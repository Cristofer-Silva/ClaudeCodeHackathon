'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Map, { type MapRef, type MapMouseEvent } from 'react-map-gl/mapbox';
import PinMarker from './PinMarker';
import MapControls from './MapControls';
import CreatePinSheet from '@/components/pins/CreatePinSheet';
import PinCard from '@/components/pins/PinCard';
import FilterBar from '@/components/ui/FilterBar';
import Header from '@/components/layout/Header';
import { useRealtimePins } from '@/hooks/useRealtimePins';
import { useLocation } from '@/hooks/useLocation';
import { usePinActions } from '@/hooks/usePinActions';
import { useAuth } from '@/hooks/useAuth';
import { DEFAULT_CENTER, MAP_STYLE } from '@/lib/constants';
import type { Pin, Category } from '@/types';

export default function CampusMap() {
  const mapRef = useRef<MapRef>(null);
  const { pins, loading } = useRealtimePins();
  const { latitude, longitude, requestLocation } = useLocation();
  const { createPin, joinPin, leavePin, deletePin } = usePinActions();
  const { user } = useAuth();

  const [viewState, setViewState] = useState({
    latitude: DEFAULT_CENTER.latitude,
    longitude: DEFAULT_CENTER.longitude,
    zoom: DEFAULT_CENTER.zoom,
  });

  const [isCreating, setIsCreating] = useState(false);
  const [createLocation, setCreateLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null);
  const [activeFilter, setActiveFilter] = useState<Category | 'all'>('all');
  const [newPinIds, setNewPinIds] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<string | null>(null);

  // Track new pins for animation
  useEffect(() => {
    if (pins.length > 0) {
      const latestPin = pins[0];
      if (latestPin && !newPinIds.has(latestPin.id)) {
        setNewPinIds(prev => new Set(prev).add(latestPin.id));
        // Remove "new" status after animation
        setTimeout(() => {
          setNewPinIds(prev => {
            const next = new Set(prev);
            next.delete(latestPin.id);
            return next;
          });
        }, 2000);
      }
    }
  }, [pins, newPinIds]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  const handleMapClick = useCallback((e: MapMouseEvent) => {
    if (isCreating) {
      setCreateLocation({ lat: e.lngLat.lat, lng: e.lngLat.lng });
    } else {
      setSelectedPin(null);
    }
  }, [isCreating]);

  const handleLocateMe = useCallback(() => {
    requestLocation();
    mapRef.current?.flyTo({
      center: [longitude, latitude],
      zoom: 16,
      duration: 1000,
    });
  }, [longitude, latitude, requestLocation]);

  const handleZoomIn = useCallback(() => {
    mapRef.current?.zoomIn({ duration: 300 });
  }, []);

  const handleZoomOut = useCallback(() => {
    mapRef.current?.zoomOut({ duration: 300 });
  }, []);

  const handleCreatePin = useCallback(async (data: Parameters<typeof createPin>[0]) => {
    try {
      await createPin(data);
      setIsCreating(false);
      setCreateLocation(null);
      showToast('Pin dropped! Others can see it now.');
    } catch {
      showToast('Failed to drop pin. Try again.');
    }
  }, [createPin, showToast]);

  const handleJoinPin = useCallback(async (pinId: string) => {
    try {
      await joinPin(pinId);
      showToast("You're in! Head over and say hi.");
    } catch {
      showToast('Could not join. You may have already joined.');
    }
  }, [joinPin, showToast]);

  const handleLeavePin = useCallback(async (pinId: string) => {
    try {
      await leavePin(pinId);
      showToast('Left the hangout.');
      setSelectedPin(null);
    } catch {
      showToast('Could not leave.');
    }
  }, [leavePin, showToast]);

  const handleDeletePin = useCallback(async (pinId: string) => {
    try {
      await deletePin(pinId);
      showToast('Pin removed.');
      setSelectedPin(null);
    } catch {
      showToast('Could not remove pin.');
    }
  }, [deletePin, showToast]);

  const filteredPins = activeFilter === 'all'
    ? pins
    : pins.filter(p => p.category === activeFilter);

  return (
    <div className="relative w-full h-full">
      <Map
        ref={mapRef}
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        onClick={handleMapClick}
        mapStyle={MAP_STYLE}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        style={{ width: '100%', height: '100%' }}
        cursor={isCreating ? 'crosshair' : 'grab'}
        maxZoom={20}
        minZoom={10}
      >
        {filteredPins.map(pin => (
          <PinMarker
            key={pin.id}
            pin={pin}
            onClick={setSelectedPin}
            isNew={newPinIds.has(pin.id)}
          />
        ))}
      </Map>

      <Header />

      <FilterBar
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        pinCounts={pins.reduce((acc, pin) => {
          acc[pin.category] = (acc[pin.category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)}
      />

      <MapControls
        onLocateMe={handleLocateMe}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        isCreating={isCreating}
        onToggleCreate={() => {
          setIsCreating(!isCreating);
          setCreateLocation(null);
          setSelectedPin(null);
        }}
      />

      {/* Create mode hint */}
      {isCreating && !createLocation && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 bg-accent text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg animate-fade-in-up">
          Tap the map to drop your pin
        </div>
      )}

      {/* Loading indicator */}
      {loading && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 bg-bg-card/90 backdrop-blur-md text-text-secondary px-4 py-2 rounded-full text-sm border border-border">
          Loading pins...
        </div>
      )}

      {/* Empty state */}
      {!loading && pins.length === 0 && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-center pointer-events-none">
          <div className="text-5xl mb-3">{'\u{1F4CD}'}</div>
          <p className="text-text-secondary text-lg font-medium">No pins nearby yet</p>
          <p className="text-text-muted text-sm mt-1">Be the first to drop one!</p>
        </div>
      )}

      {/* Create Pin Sheet */}
      {createLocation && (
        <CreatePinSheet
          latitude={createLocation.lat}
          longitude={createLocation.lng}
          onSubmit={handleCreatePin}
          onClose={() => {
            setCreateLocation(null);
            setIsCreating(false);
          }}
        />
      )}

      {/* Pin Detail Card */}
      {selectedPin && (
        <PinCard
          pin={selectedPin}
          currentUserId={user?.id}
          onJoin={handleJoinPin}
          onLeave={handleLeavePin}
          onDelete={handleDeletePin}
          onClose={() => setSelectedPin(null)}
        />
      )}

      {/* Toast notification */}
      {toast && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 bg-bg-card border border-border text-text-primary px-5 py-3 rounded-2xl text-sm font-medium shadow-lg animate-fade-in-up">
          {toast}
        </div>
      )}
    </div>
  );
}
