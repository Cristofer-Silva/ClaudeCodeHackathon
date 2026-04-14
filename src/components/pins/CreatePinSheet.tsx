'use client';

import { useState } from 'react';
import { CATEGORIES, VIBES, EXPIRY_OPTIONS } from '@/types';
import type { Category, Vibe } from '@/types';
import { PIN_MAX_TITLE_LENGTH, PIN_MAX_DESCRIPTION_LENGTH } from '@/lib/constants';

interface CreatePinSheetProps {
  latitude: number;
  longitude: number;
  onSubmit: (data: {
    latitude: number;
    longitude: number;
    title: string;
    description?: string;
    category: Category;
    vibe?: Vibe;
    capacity?: number;
    durationMinutes: number;
  }) => void;
  onClose: () => void;
}

export default function CreatePinSheet({
  latitude,
  longitude,
  onSubmit,
  onClose,
}: CreatePinSheetProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category | null>(null);
  const [vibe, setVibe] = useState<Vibe | null>(null);
  const [duration, setDuration] = useState(60);
  const [capacity, setCapacity] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = title.trim().length > 0 && category !== null && !submitting;

  const handleSubmit = async () => {
    if (!canSubmit || !category) return;
    setSubmitting(true);
    await onSubmit({
      latitude,
      longitude,
      title: title.trim(),
      description: description.trim() || undefined,
      category,
      vibe: vibe || undefined,
      capacity: capacity ? parseInt(capacity) : undefined,
      durationMinutes: duration,
    });
    setSubmitting(false);
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 z-30 animate-slide-up">
      {/* Backdrop */}
      <div className="absolute inset-0 -top-[100vh] bg-black/40" onClick={onClose} />

      {/* Sheet */}
      <div className="relative bg-bg-card border-t border-border rounded-t-3xl px-5 pt-3 pb-8 max-h-[80vh] overflow-y-auto">
        {/* Drag handle */}
        <div className="w-10 h-1 bg-text-muted/30 rounded-full mx-auto mb-4" />

        <h2 className="text-lg font-semibold text-text-primary mb-1">Drop a Pin</h2>
        <p className="text-sm text-text-muted mb-5">Let people know what&apos;s happening</p>

        {/* Title */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="What's happening? (e.g., Studying at Memorial Library)"
            value={title}
            onChange={(e) => setTitle(e.target.value.slice(0, PIN_MAX_TITLE_LENGTH))}
            className="w-full bg-bg-primary border border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-accent transition-colors"
            autoFocus
          />
          <div className="text-right text-xs text-text-muted mt-1">
            {title.length}/{PIN_MAX_TITLE_LENGTH}
          </div>
        </div>

        {/* Description */}
        <div className="mb-4">
          <textarea
            placeholder="Add details (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value.slice(0, PIN_MAX_DESCRIPTION_LENGTH))}
            className="w-full bg-bg-primary border border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-accent transition-colors resize-none h-20"
          />
        </div>

        {/* Category */}
        <div className="mb-4">
          <label className="text-sm font-medium text-text-secondary mb-2 block">Category</label>
          <div className="grid grid-cols-3 gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm transition-all ${
                  category === cat.value
                    ? 'border-2 text-text-primary'
                    : 'bg-bg-primary border border-border text-text-secondary hover:border-text-muted'
                }`}
                style={
                  category === cat.value
                    ? { borderColor: cat.color, backgroundColor: `${cat.color}15` }
                    : undefined
                }
              >
                <span>{cat.emoji}</span>
                <span className="truncate">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Vibe */}
        <div className="mb-4">
          <label className="text-sm font-medium text-text-secondary mb-2 block">Vibe</label>
          <div className="flex gap-2 flex-wrap">
            {VIBES.map((v) => (
              <button
                key={v.value}
                onClick={() => setVibe(vibe === v.value ? null : v.value)}
                className={`px-4 py-2 rounded-full text-sm transition-all ${
                  vibe === v.value
                    ? 'bg-accent-secondary text-bg-primary font-medium'
                    : 'bg-bg-primary border border-border text-text-secondary hover:border-text-muted'
                }`}
              >
                {v.emoji} {v.label}
              </button>
            ))}
          </div>
        </div>

        {/* Duration */}
        <div className="mb-4">
          <label className="text-sm font-medium text-text-secondary mb-2 block">How long?</label>
          <div className="flex gap-2">
            {EXPIRY_OPTIONS.map((opt) => (
              <button
                key={opt.minutes}
                onClick={() => setDuration(opt.minutes)}
                className={`flex-1 py-2.5 rounded-xl text-sm transition-all ${
                  duration === opt.minutes
                    ? 'bg-accent text-white font-medium'
                    : 'bg-bg-primary border border-border text-text-secondary hover:border-text-muted'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Capacity */}
        <div className="mb-6">
          <label className="text-sm font-medium text-text-secondary mb-2 block">
            Max people <span className="text-text-muted font-normal">(optional)</span>
          </label>
          <input
            type="number"
            min="2"
            max="50"
            placeholder="No limit"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            className="w-24 bg-bg-primary border border-border rounded-xl px-4 py-2.5 text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-accent transition-colors"
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={`w-full py-3.5 rounded-xl text-sm font-semibold transition-all ${
            canSubmit
              ? 'bg-accent text-white hover:bg-accent-hover active:scale-[0.98]'
              : 'bg-bg-primary text-text-muted cursor-not-allowed'
          }`}
        >
          {submitting ? 'Dropping...' : 'Drop Pin \u{1F4CD}'}
        </button>
      </div>
    </div>
  );
}
