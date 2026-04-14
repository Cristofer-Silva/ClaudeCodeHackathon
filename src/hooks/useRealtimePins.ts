'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Pin } from '@/types';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

export function useRealtimePins() {
  const [pins, setPins] = useState<Pin[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchPins = useCallback(async () => {
    const { data, error } = await supabase
      .from('pins')
      .select('*, creator:profiles(*)')
      .eq('is_active', true)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false });

    if (!error && data) {
      setPins(data as Pin[]);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchPins();

    const channel = supabase
      .channel('pins-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'pins' },
        (payload: RealtimePostgresChangesPayload<Pin>) => {
          if (payload.eventType === 'INSERT') {
            // Fetch the full pin with creator profile
            supabase
              .from('pins')
              .select('*, creator:profiles(*)')
              .eq('id', (payload.new as Pin).id)
              .single()
              .then(({ data }) => {
                if (data) {
                  setPins(prev => [data as Pin, ...prev]);
                }
              });
          } else if (payload.eventType === 'UPDATE') {
            const updated = payload.new as Pin;
            if (!updated.is_active || new Date(updated.expires_at) <= new Date()) {
              setPins(prev => prev.filter(p => p.id !== updated.id));
            } else {
              setPins(prev =>
                prev.map(p => (p.id === updated.id ? { ...p, ...updated } : p))
              );
            }
          } else if (payload.eventType === 'DELETE') {
            const deleted = payload.old as Partial<Pin>;
            setPins(prev => prev.filter(p => p.id !== deleted.id));
          }
        }
      )
      .subscribe();

    // Periodic cleanup of expired pins from local state
    const interval = setInterval(() => {
      const now = new Date();
      setPins(prev => prev.filter(p => new Date(p.expires_at) > now));
    }, 30000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [supabase, fetchPins]);

  return { pins, loading, refetch: fetchPins };
}
