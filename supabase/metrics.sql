create extension if not exists pgcrypto;

create table if not exists public.metrics_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default timezone('utc', now()),
  landing text not null,
  event text not null,
  step text null,
  label text null,
  path text not null,
  visitor_id text not null
);

create index if not exists metrics_events_created_at_idx
  on public.metrics_events (created_at desc);

create index if not exists metrics_events_landing_idx
  on public.metrics_events (landing, created_at desc);

create index if not exists metrics_events_event_idx
  on public.metrics_events (event, created_at desc);

create index if not exists metrics_events_visitor_idx
  on public.metrics_events (visitor_id, created_at desc);

alter table public.metrics_events enable row level security;
