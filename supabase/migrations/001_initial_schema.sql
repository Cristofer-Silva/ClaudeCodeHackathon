-- Enable PostGIS for spatial queries
create extension if not exists postgis;

-- ============================================
-- Profiles table
-- ============================================
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  display_name text not null,
  avatar_url text,
  campus text default 'UW-Madison',
  created_at timestamptz default now()
);

alter table profiles enable row level security;
create policy "Public profiles" on profiles for select using (true);
create policy "Own profile update" on profiles for update using (auth.uid() = id);
create policy "Insert own profile" on profiles for insert with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'Anonymous'),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================
-- Pins table
-- ============================================
create table pins (
  id uuid default gen_random_uuid() primary key,
  creator_id uuid references profiles(id) on delete cascade not null,
  latitude double precision not null,
  longitude double precision not null,
  location geography(Point, 4326) generated always as (
    ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography
  ) stored,
  title text not null check (char_length(title) between 1 and 100),
  description text check (char_length(description) <= 300),
  category text not null check (category in (
    'studying', 'sports', 'food', 'music', 'games',
    'hangout', 'outdoors', 'creative', 'other'
  )),
  vibe text check (vibe in ('chill', 'energetic', 'focused', 'social')),
  capacity int check (capacity is null or (capacity > 0 and capacity <= 50)),
  attendee_count int default 1,
  expires_at timestamptz not null,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Spatial index for geo queries
create index pins_location_idx on pins using gist (location);
-- Index for active + expiry filtering
create index pins_active_expires_idx on pins (is_active, expires_at);

alter table pins enable row level security;
create policy "Anyone can view active pins" on pins
  for select using (is_active = true and expires_at > now());
create policy "Auth users create pins" on pins
  for insert with check (auth.uid() = creator_id);
create policy "Creators update own pins" on pins
  for update using (auth.uid() = creator_id);
create policy "Creators delete own pins" on pins
  for delete using (auth.uid() = creator_id);

-- Enable realtime
alter publication supabase_realtime add table pins;

-- ============================================
-- Pin attendees table
-- ============================================
create table pin_attendees (
  pin_id uuid references pins(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  joined_at timestamptz default now(),
  primary key (pin_id, user_id)
);

alter table pin_attendees enable row level security;
create policy "View attendees" on pin_attendees for select using (true);
create policy "Join pins" on pin_attendees
  for insert with check (auth.uid() = user_id);
create policy "Leave pins" on pin_attendees
  for delete using (auth.uid() = user_id);

-- ============================================
-- Functions
-- ============================================

-- Get nearby active pins within radius (meters)
create or replace function get_nearby_pins(
  lat double precision,
  lng double precision,
  radius_meters int default 2000
)
returns setof pins as $$
begin
  return query
    select *
    from pins
    where is_active = true
      and expires_at > now()
      and ST_DWithin(
        location,
        ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography,
        radius_meters
      )
    order by created_at desc;
end;
$$ language plpgsql security definer;

-- Expire old pins (run via pg_cron or edge function)
create or replace function expire_old_pins()
returns void as $$
begin
  update pins set is_active = false
  where is_active = true and expires_at <= now();
end;
$$ language plpgsql security definer;

-- Increment attendee count
create or replace function increment_attendees(pin_id uuid)
returns void as $$
begin
  update pins set attendee_count = attendee_count + 1
  where id = pin_id and is_active = true;
end;
$$ language plpgsql security definer;

-- Decrement attendee count
create or replace function decrement_attendees(pin_id uuid)
returns void as $$
begin
  update pins set attendee_count = greatest(1, attendee_count - 1)
  where id = pin_id and is_active = true;
end;
$$ language plpgsql security definer;
