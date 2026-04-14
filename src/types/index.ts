export type Category =
  | 'studying'
  | 'sports'
  | 'food'
  | 'music'
  | 'games'
  | 'hangout'
  | 'outdoors'
  | 'creative'
  | 'other';

export type Vibe = 'chill' | 'energetic' | 'focused' | 'social';

export interface Profile {
  id: string;
  display_name: string;
  avatar_url: string | null;
  campus: string | null;
  created_at: string;
}

export interface Pin {
  id: string;
  creator_id: string;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };
  latitude: number;
  longitude: number;
  title: string;
  description: string | null;
  category: Category;
  vibe: Vibe | null;
  capacity: number | null;
  attendee_count: number;
  expires_at: string;
  is_active: boolean;
  created_at: string;
  // Joined fields
  creator?: Profile;
}

export interface PinAttendee {
  pin_id: string;
  user_id: string;
  joined_at: string;
}

export const CATEGORIES: { value: Category; label: string; emoji: string; color: string }[] = [
  { value: 'studying', label: 'Studying', emoji: '\u{1F4DA}', color: '#818CF8' },
  { value: 'sports', label: 'Sports', emoji: '\u{1F3C0}', color: '#F97316' },
  { value: 'food', label: 'Food', emoji: '\u{1F355}', color: '#EF4444' },
  { value: 'music', label: 'Music', emoji: '\u{1F3B5}', color: '#EC4899' },
  { value: 'games', label: 'Games', emoji: '\u{1F3AE}', color: '#8B5CF6' },
  { value: 'hangout', label: 'Hangout', emoji: '\u{1F44B}', color: '#F59E0B' },
  { value: 'outdoors', label: 'Outdoors', emoji: '\u{1F333}', color: '#22C55E' },
  { value: 'creative', label: 'Creative', emoji: '\u{1F3A8}', color: '#06B6D4' },
  { value: 'other', label: 'Other', emoji: '\u{2728}', color: '#6B7280' },
];

export const VIBES: { value: Vibe; label: string; emoji: string }[] = [
  { value: 'chill', label: 'Chill', emoji: '\u{1F60C}' },
  { value: 'energetic', label: 'Energetic', emoji: '\u{26A1}' },
  { value: 'focused', label: 'Focused', emoji: '\u{1F3AF}' },
  { value: 'social', label: 'Social', emoji: '\u{1F389}' },
];

export const EXPIRY_OPTIONS = [
  { label: '30 min', minutes: 30 },
  { label: '1 hour', minutes: 60 },
  { label: '2 hours', minutes: 120 },
  { label: '4 hours', minutes: 240 },
];
