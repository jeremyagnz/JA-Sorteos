-- =============================================================================
-- EnduroCommunity Database Schema
-- Run this SQL in your Supabase SQL Editor
-- =============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- =============================================================================
-- PROFILES TABLE
-- Extends auth.users with additional profile info
-- =============================================================================
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  avatar_url text,
  role text not null default 'user' check (role in ('admin', 'user')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- RLS
alter table public.profiles enable row level security;

-- Policies
create policy "Public profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Trigger: auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Trigger: update updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

-- =============================================================================
-- EVENTS TABLE
-- =============================================================================
create table public.events (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text not null,
  location text not null,
  event_date timestamptz not null,
  end_date timestamptz,
  category text not null,
  difficulty text not null default 'all' check (difficulty in ('beginner', 'intermediate', 'advanced', 'all')),
  max_participants integer,
  price numeric(10, 2) not null default 0,
  image_url text,
  organizer_id uuid references public.profiles(id) on delete set null,
  status text not null default 'draft' check (status in ('draft', 'published', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Indexes
create index events_status_idx on public.events(status);
create index events_event_date_idx on public.events(event_date);
create index events_category_idx on public.events(category);
create index events_organizer_idx on public.events(organizer_id);

-- RLS
alter table public.events enable row level security;

-- Policies
create policy "Published events are viewable by everyone"
  on public.events for select
  using (status = 'published' or auth.uid() in (
    select id from public.profiles where role = 'admin'
  ) or auth.uid() = organizer_id);

create policy "Admins can insert events"
  on public.events for insert
  with check (auth.uid() in (
    select id from public.profiles where role = 'admin'
  ));

create policy "Admins can update events"
  on public.events for update
  using (auth.uid() in (
    select id from public.profiles where role = 'admin'
  ));

create policy "Admins can delete events"
  on public.events for delete
  using (auth.uid() in (
    select id from public.profiles where role = 'admin'
  ));

-- Updated at trigger
create trigger events_updated_at
  before update on public.events
  for each row execute procedure public.handle_updated_at();

-- =============================================================================
-- REGISTRATIONS TABLE
-- =============================================================================
create table public.registrations (
  id uuid default uuid_generate_v4() primary key,
  event_id uuid references public.events(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  status text not null default 'confirmed' check (status in ('pending', 'confirmed', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(event_id, user_id)
);

-- Indexes
create index registrations_event_idx on public.registrations(event_id);
create index registrations_user_idx on public.registrations(user_id);

-- RLS
alter table public.registrations enable row level security;

-- Policies
create policy "Users can view own registrations"
  on public.registrations for select
  using (auth.uid() = user_id or auth.uid() in (
    select id from public.profiles where role = 'admin'
  ));

create policy "Authenticated users can register"
  on public.registrations for insert
  with check (auth.uid() = user_id and auth.role() = 'authenticated');

create policy "Users can cancel own registrations"
  on public.registrations for delete
  using (auth.uid() = user_id or auth.uid() in (
    select id from public.profiles where role = 'admin'
  ));

create policy "Admins can update registrations"
  on public.registrations for update
  using (auth.uid() in (
    select id from public.profiles where role = 'admin'
  ));

-- Updated at trigger
create trigger registrations_updated_at
  before update on public.registrations
  for each row execute procedure public.handle_updated_at();

-- =============================================================================
-- STORAGE: event-images bucket
-- Run this separately or via Supabase Dashboard
-- =============================================================================
-- insert into storage.buckets (id, name, public)
-- values ('event-images', 'event-images', true);

-- create policy "Event images are publicly accessible"
--   on storage.objects for select
--   using (bucket_id = 'event-images');

-- create policy "Admins can upload event images"
--   on storage.objects for insert
--   with check (bucket_id = 'event-images' and auth.uid() in (
--     select id from public.profiles where role = 'admin'
--   ));

-- create policy "Admins can delete event images"
--   on storage.objects for delete
--   using (bucket_id = 'event-images' and auth.uid() in (
--     select id from public.profiles where role = 'admin'
--   ));
