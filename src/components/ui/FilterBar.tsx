'use client';

import { CATEGORIES } from '@/types';
import type { Category } from '@/types';

interface FilterBarProps {
  activeFilter: Category | 'all';
  onFilterChange: (filter: Category | 'all') => void;
  pinCounts: Record<string, number>;
}

export default function FilterBar({ activeFilter, onFilterChange, pinCounts }: FilterBarProps) {
  const totalPins = Object.values(pinCounts).reduce((a, b) => a + b, 0);

  return (
    <div className="absolute top-16 left-0 right-0 z-10 px-4">
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => onFilterChange('all')}
          className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium transition-all ${
            activeFilter === 'all'
              ? 'bg-text-primary text-bg-primary'
              : 'bg-bg-card/80 backdrop-blur-md border border-border text-text-secondary hover:text-text-primary'
          }`}
        >
          All {totalPins > 0 && <span className="opacity-60">{totalPins}</span>}
        </button>
        {CATEGORIES.map((cat) => {
          const count = pinCounts[cat.value] || 0;
          return (
            <button
              key={cat.value}
              onClick={() => onFilterChange(cat.value)}
              className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium transition-all ${
                activeFilter === cat.value
                  ? 'text-bg-primary'
                  : 'bg-bg-card/80 backdrop-blur-md border border-border text-text-secondary hover:text-text-primary'
              }`}
              style={
                activeFilter === cat.value
                  ? { backgroundColor: cat.color }
                  : undefined
              }
            >
              {cat.emoji} {cat.label}
              {count > 0 && <span className="opacity-60">{count}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
