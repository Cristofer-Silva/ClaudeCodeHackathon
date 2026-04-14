'use client';

import dynamic from 'next/dynamic';

const CampusMap = dynamic(() => import('@/components/map/CampusMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-bg-primary">
      <div className="text-center">
        <div className="text-4xl mb-3">{'\u{1F30D}'}</div>
        <p className="text-text-secondary text-sm">Loading map...</p>
      </div>
    </div>
  ),
});

export default function MapPage() {
  return (
    <div className="w-full h-screen">
      <CampusMap />
    </div>
  );
}
