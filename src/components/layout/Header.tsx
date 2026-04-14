'use client';

import { useAuth } from '@/hooks/useAuth';

export default function Header() {
  const { user, signOut } = useAuth();

  return (
    <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 py-3 pointer-events-none">
      <div className="pointer-events-auto flex items-center gap-2 bg-bg-card/80 backdrop-blur-md rounded-2xl px-4 py-2 border border-border">
        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-sm font-bold">
          3
        </div>
        <span className="text-sm font-semibold text-text-primary">The Third Place</span>
      </div>

      {user && (
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            onClick={signOut}
            className="bg-bg-card/80 backdrop-blur-md rounded-full px-3 py-2 border border-border text-xs text-text-secondary hover:text-text-primary transition-colors"
          >
            Sign Out
          </button>
          <div className="w-9 h-9 rounded-full bg-accent-secondary flex items-center justify-center text-sm font-bold overflow-hidden">
            {user.user_metadata?.avatar_url ? (
              <img
                src={user.user_metadata.avatar_url}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              user.user_metadata?.full_name?.[0] || user.email?.[0]?.toUpperCase() || '?'
            )}
          </div>
        </div>
      )}
    </header>
  );
}
