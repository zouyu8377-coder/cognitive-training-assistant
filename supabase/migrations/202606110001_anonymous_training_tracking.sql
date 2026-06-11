create extension if not exists pgcrypto;

create table if not exists public.patients (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  nickname text not null check (char_length(nickname) between 1 and 40),
  created_at timestamptz not null default now(),
  last_active_at timestamptz not null default now()
);

create index if not exists patients_owner_user_idx
  on public.patients (owner_user_id);

create table if not exists public.training_sessions (
  id text primary key,
  patient_id uuid not null references public.patients(id) on delete cascade,
  started_at timestamptz not null,
  completed_at timestamptz,
  session_date date not null,
  status text not null check (status in ('started', 'completed')),
  result_data jsonb not null,
  app_version text not null default '0.1.0',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists training_sessions_patient_started_idx
  on public.training_sessions (patient_id, started_at desc);

create table if not exists public.activity_events (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  session_id text,
  event_type text not null check (char_length(event_type) between 1 and 80),
  event_data jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now()
);

create index if not exists activity_events_patient_occurred_idx
  on public.activity_events (patient_id, occurred_at desc);

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.patients enable row level security;
alter table public.training_sessions enable row level security;
alter table public.activity_events enable row level security;
alter table public.admin_users enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.admin_users where user_id = auth.uid()
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

create policy "patients_insert_own"
on public.patients for insert
to authenticated
with check (owner_user_id = auth.uid());

create policy "patients_select_own_or_admin"
on public.patients for select
to authenticated
using (owner_user_id = auth.uid() or public.is_admin());

create policy "patients_update_own"
on public.patients for update
to authenticated
using (owner_user_id = auth.uid())
with check (owner_user_id = auth.uid());

create policy "sessions_insert_own"
on public.training_sessions for insert
to authenticated
with check (
  exists (
    select 1 from public.patients
    where patients.id = patient_id
      and patients.owner_user_id = auth.uid()
  )
);

create policy "sessions_select_own_or_admin"
on public.training_sessions for select
to authenticated
using (
  public.is_admin()
  or exists (
    select 1 from public.patients
    where patients.id = patient_id
      and patients.owner_user_id = auth.uid()
  )
);

create policy "sessions_update_own"
on public.training_sessions for update
to authenticated
using (
  exists (
    select 1 from public.patients
    where patients.id = patient_id
      and patients.owner_user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.patients
    where patients.id = patient_id
      and patients.owner_user_id = auth.uid()
  )
);

create policy "events_insert_own"
on public.activity_events for insert
to authenticated
with check (
  exists (
    select 1 from public.patients
    where patients.id = patient_id
      and patients.owner_user_id = auth.uid()
  )
);

create policy "events_select_admin"
on public.activity_events for select
to authenticated
using (public.is_admin());

create policy "admin_users_select_self"
on public.admin_users for select
to authenticated
using (user_id = auth.uid());
