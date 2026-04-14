'use client';

interface MapControlsProps {
  onLocateMe: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  isCreating: boolean;
  onToggleCreate: () => void;
}

export default function MapControls({
  onLocateMe,
  onZoomIn,
  onZoomOut,
  isCreating,
  onToggleCreate,
}: MapControlsProps) {
  return (
    <div className="absolute right-4 bottom-24 z-10 flex flex-col gap-2">
      {/* Create Pin FAB */}
      <button
        onClick={onToggleCreate}
        className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-lg transition-all duration-200 ${
          isCreating
            ? 'bg-accent-hover text-white scale-110 rotate-45'
            : 'bg-accent text-white hover:bg-accent-hover hover:scale-105'
        }`}
        title={isCreating ? 'Cancel' : 'Drop a pin'}
      >
        +
      </button>

      <div className="flex flex-col gap-1 mt-2">
        {/* Locate me */}
        <button
          onClick={onLocateMe}
          className="w-10 h-10 rounded-xl bg-bg-card/90 backdrop-blur-md border border-border flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
          title="My location"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
          </svg>
        </button>

        {/* Zoom in */}
        <button
          onClick={onZoomIn}
          className="w-10 h-10 rounded-xl bg-bg-card/90 backdrop-blur-md border border-border flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>

        {/* Zoom out */}
        <button
          onClick={onZoomOut}
          className="w-10 h-10 rounded-xl bg-bg-card/90 backdrop-blur-md border border-border flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14" />
          </svg>
        </button>
      </div>
    </div>
  );
}
