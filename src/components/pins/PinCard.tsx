'use client';

import { useState, useEffect } from 'react';
import type { Pin } from '@/types';
import { CATEGORIES, VIBES } from '@/types';
import { timeRemaining, expiryProgress } from '@/lib/utils';

interface PinCardProps {
  pin: Pin;
  currentUserId?: string;
  onJoin: (pinId: string) => void;
  onLeave: (pinId: string) => void;
  onDelete: (pinId: string) => void;
  onClose: () => void;
}

export default function PinCard({
  pin,
  currentUserId,
  onJoin,
  onLeave,
  onDelete,
  onClose,
}: PinCardProps) {
  const [remaining, setRemaining] = useState(timeRemaining(pin.expires_at));
  const [progress, setProgress] = useState(expiryProgress(pin.created_at, pin.expires_at));

  const category = CATEGORIES.find(c => c.value === pin.category);
  const vibe = VIBES.find(v => v.value === pin.vibe);
  const isCreator = currentUserId === pin.creator_id;
  const creatorName = pin.creator?.display_name || 'Someone';

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(timeRemaining(pin.expires_at));
      setProgress(expiryProgress(pin.created_at, pin.expires_at));
    }, 10000);
    return () => clearInterval(interval);
  }, [pin.expires_at, pin.created_at]);

  return (
    <div className="absolute bottom-0 left-0 right-0 z-30 animate-slide-up">
      {/* Backdrop */}
      <div className="absolute inset-0 -top-[100vh]" onClick={onClose} />

      {/* Card */}
      <div className="relative bg-bg-card border-t border-border rounded-t-3xl px-5 pt-3 pb-8">
        {/* Drag handle */}
        <div className="w-10 h-1 bg-text-muted/30 rounded-full mx-auto mb-4" />

        {/* Expiry progress bar */}
        <div className="w-full h-1 bg-bg-primary rounded-full mb-4 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{
              width: `${progress * 100}%`,
              backgroundColor: progress > 0.3 ? '#4ECDC4' : progress > 0.1 ? '#FFD43B' : '#FF6B6B',
            }}
          />
        </div>

        {/* Header row */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-text-primary leading-tight">
              {pin.title}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-5 h-5 rounded-full bg-accent-secondary flex items-center justify-center text-[10px] font-bold overflow-hidden">
                {pin.creator?.avatar_url ? (
                  <img src={pin.creator.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  creatorName[0]
                )}
              </div>
              <span className="text-sm text-text-secondary">{creatorName}</span>
            </div>
          </div>
          <span className="text-sm text-text-muted whitespace-nowrap ml-3">{remaining}</span>
        </div>

        {/* Description */}
        {pin.description && (
          <p className="text-sm text-text-secondary mb-3 leading-relaxed">{pin.description}</p>
        )}

        {/* Badges */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {category && (
            <span
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium"
              style={{
                backgroundColor: `${category.color}20`,
                color: category.color,
                border: `1px solid ${category.color}40`,
              }}
            >
              {category.emoji} {category.label}
            </span>
          )}
          {vibe && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-bg-primary border border-border text-text-secondary">
              {vibe.emoji} {vibe.label}
            </span>
          )}
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-bg-primary border border-border text-text-secondary">
            {'\u{1F465}'} {pin.attendee_count}{pin.capacity ? `/${pin.capacity}` : ''}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          {isCreator ? (
            <button
              onClick={() => onDelete(pin.id)}
              className="flex-1 py-3 rounded-xl text-sm font-medium bg-bg-primary border border-border text-accent hover:bg-accent/10 transition-colors"
            >
              End Hangout
            </button>
          ) : (
            <>
              <button
                onClick={() => onJoin(pin.id)}
                className="flex-1 py-3 rounded-xl text-sm font-semibold bg-accent-secondary text-bg-primary hover:opacity-90 transition-opacity active:scale-[0.98]"
              >
                Join {'\u{1F44B}'}
              </button>
              <button
                onClick={() => onLeave(pin.id)}
                className="py-3 px-4 rounded-xl text-sm font-medium bg-bg-primary border border-border text-text-secondary hover:text-text-primary transition-colors"
              >
                Leave
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
