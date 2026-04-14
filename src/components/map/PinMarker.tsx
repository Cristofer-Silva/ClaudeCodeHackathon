'use client';

import { Marker } from 'react-map-gl/mapbox';
import type { Pin } from '@/types';
import { CATEGORIES } from '@/types';

interface PinMarkerProps {
  pin: Pin;
  onClick: (pin: Pin) => void;
  isNew?: boolean;
}

export default function PinMarker({ pin, onClick, isNew }: PinMarkerProps) {
  const category = CATEGORIES.find(c => c.value === pin.category);
  const color = category?.color || '#6B7280';
  const emoji = category?.emoji || '\u{2728}';

  return (
    <Marker
      longitude={pin.longitude}
      latitude={pin.latitude}
      anchor="bottom"
      onClick={(e) => {
        e.originalEvent.stopPropagation();
        onClick(pin);
      }}
    >
      <div className={`relative cursor-pointer ${isNew ? 'animate-pin-drop' : ''}`}>
        {/* Ripple effect for new pins */}
        {isNew && (
          <div
            className="absolute inset-0 rounded-full animate-pin-ripple"
            style={{ backgroundColor: `${color}30` }}
          />
        )}

        {/* Pin body */}
        <div
          className="relative flex items-center justify-center w-11 h-11 rounded-full border-2 shadow-lg transition-transform hover:scale-110 animate-pin-pulse"
          style={{
            backgroundColor: `${color}20`,
            borderColor: color,
            boxShadow: `0 0 16px ${color}40`,
          }}
        >
          <span className="text-lg">{emoji}</span>
        </div>

        {/* Pin stem */}
        <div
          className="mx-auto w-0.5 h-2"
          style={{ backgroundColor: color }}
        />
        <div
          className="mx-auto w-2 h-1 rounded-full opacity-30"
          style={{ backgroundColor: color }}
        />

        {/* Attendee count badge */}
        {pin.attendee_count > 1 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent text-[10px] font-bold flex items-center justify-center text-white">
            {pin.attendee_count}
          </div>
        )}
      </div>
    </Marker>
  );
}
