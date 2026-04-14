'use client';

import { useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Category, Vibe } from '@/types';

interface CreatePinInput {
  latitude: number;
  longitude: number;
  title: string;
  description?: string;
  category: Category;
  vibe?: Vibe;
  capacity?: number;
  durationMinutes: number;
}

export function usePinActions() {
  const supabase = createClient();

  const createPin = useCallback(async (input: CreatePinInput) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Must be logged in');

    const expiresAt = new Date(
      Date.now() + input.durationMinutes * 60 * 1000
    ).toISOString();

    const { data, error } = await supabase
      .from('pins')
      .insert({
        creator_id: user.id,
        latitude: input.latitude,
        longitude: input.longitude,
        title: input.title,
        description: input.description || null,
        category: input.category,
        vibe: input.vibe || null,
        capacity: input.capacity || null,
        expires_at: expiresAt,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }, [supabase]);

  const joinPin = useCallback(async (pinId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Must be logged in');

    const { error: joinError } = await supabase
      .from('pin_attendees')
      .insert({ pin_id: pinId, user_id: user.id });

    if (joinError) throw joinError;

    // Increment attendee count
    await supabase.rpc('increment_attendees', { pin_id: pinId });
  }, [supabase]);

  const leavePin = useCallback(async (pinId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Must be logged in');

    const { error } = await supabase
      .from('pin_attendees')
      .delete()
      .eq('pin_id', pinId)
      .eq('user_id', user.id);

    if (error) throw error;

    await supabase.rpc('decrement_attendees', { pin_id: pinId });
  }, [supabase]);

  const deletePin = useCallback(async (pinId: string) => {
    const { error } = await supabase
      .from('pins')
      .update({ is_active: false })
      .eq('id', pinId);

    if (error) throw error;
  }, [supabase]);

  return { createPin, joinPin, leavePin, deletePin };
}
