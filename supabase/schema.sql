-- Staff IQ Phase 0 → MVP schema
-- Run with `supabase db push` or apply via SQL editor

-- Extensions
create extension if not exists "pgcrypto" with schema public;
create extension if not exists "uuid-ossp" with schema public;

-- Core domain tables -------------------------------------------------------

create table if not exists organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  timezone text default 'UTC',
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists users (
  id uuid primary key,
  email text not null unique,
  full_name text,
  created_at timestamptz not null default timezone('utc', now()),
  foreign key (id) references auth.users (id) on delete cascade
);

create type membership_role as enum ('owner', 'admin', 'member', 'viewer');

create table if not exists memberships (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  user_id uuid not null references users (id) on delete cascade,
  role membership_role not null default 'viewer',
  created_at timestamptz not null default timezone('utc', now()),
  unique (organization_id, user_id)
);

create table if not exists data_sources (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  type text not null check (type in ('bullhorn', 'hubspot', 'csv', 'other')),
  name text not null,
  status text not null default 'pending',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists data_credentials (
  id uuid primary key default gen_random_uuid(),
  data_source_id uuid not null references data_sources (id) on delete cascade,
  enc_credentials jsonb not null,
  last_validated_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists dashboards (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  name text not null,
  powerbi_report_id text not null,
  powerbi_dataset_id text not null,
  created_at timestamptz not null default timezone('utc', now())
);

-- Organization goals (per-tenant targets for revenue/units/GP, etc.)
create table if not exists org_goals (
  organization_id uuid primary key references organizations (id) on delete cascade,
  goals jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  user_id uuid references users (id),
  action text not null,
  target text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

-- Warehouse dimensions -----------------------------------------------------

create table if not exists dim_organization (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  name text not null,
  timezone text,
  created_at timestamptz default timezone('utc', now()),
  updated_at timestamptz default timezone('utc', now())
);

create table if not exists dim_time (
  date_key integer primary key,
  date date not null,
  week integer,
  month integer,
  quarter integer,
  year integer,
  created_at timestamptz default timezone('utc', now())
);

create table if not exists dim_client (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  name text not null,
  segment text,
  region text,
  created_at timestamptz default timezone('utc', now())
);

create table if not exists dim_facility (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  client_id uuid references dim_client (id),
  name text not null,
  facility_type text,
  created_at timestamptz default timezone('utc', now())
);

create table if not exists dim_recruiter (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  name text not null,
  team text,
  created_at timestamptz default timezone('utc', now())
);

create table if not exists dim_candidate (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  specialty text,
  license_state text,
  status text,
  created_at timestamptz default timezone('utc', now())
);

create table if not exists dim_job (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  client_id uuid references dim_client (id),
  facility_id uuid references dim_facility (id),
  specialty text,
  seniority text,
  rate_plan text,
  created_at timestamptz default timezone('utc', now())
);

-- Warehouse facts ----------------------------------------------------------

create table if not exists fact_submission (
  id bigserial primary key,
  organization_id uuid not null references organizations (id) on delete cascade,
  time_key integer not null references dim_time (date_key),
  job_id uuid references dim_job (id),
  candidate_id uuid references dim_candidate (id),
  recruiter_id uuid references dim_recruiter (id),
  status text,
  created_at timestamptz default timezone('utc', now())
);

create table if not exists fact_interview (
  id bigserial primary key,
  organization_id uuid not null references organizations (id) on delete cascade,
  time_key integer not null references dim_time (date_key),
  job_id uuid references dim_job (id),
  candidate_id uuid references dim_candidate (id),
  recruiter_id uuid references dim_recruiter (id),
  outcome text,
  created_at timestamptz default timezone('utc', now())
);

create table if not exists fact_offer (
  id bigserial primary key,
  organization_id uuid not null references organizations (id) on delete cascade,
  time_key integer not null references dim_time (date_key),
  job_id uuid references dim_job (id),
  candidate_id uuid references dim_candidate (id),
  recruiter_id uuid references dim_recruiter (id),
  accepted boolean,
  created_at timestamptz default timezone('utc', now())
);

create table if not exists fact_placement (
  id bigserial primary key,
  organization_id uuid not null references organizations (id) on delete cascade,
  time_key integer not null references dim_time (date_key),
  job_id uuid references dim_job (id),
  candidate_id uuid references dim_candidate (id),
  recruiter_id uuid references dim_recruiter (id),
  start_date date,
  end_date date,
  bill_rate numeric(12,2),
  pay_rate numeric(12,2),
  created_at timestamptz default timezone('utc', now())
);

create table if not exists fact_shift (
  id bigserial primary key,
  organization_id uuid not null references organizations (id) on delete cascade,
  time_key integer not null references dim_time (date_key),
  facility_id uuid references dim_facility (id),
  hours numeric(10,2),
  billed_amount numeric(12,2),
  paid_amount numeric(12,2),
  created_at timestamptz default timezone('utc', now())
);

create table if not exists fact_revenue (
  id bigserial primary key,
  organization_id uuid not null references organizations (id) on delete cascade,
  time_key integer not null references dim_time (date_key),
  client_id uuid references dim_client (id),
  facility_id uuid references dim_facility (id),
  amount numeric(12,2),
  category text,
  created_at timestamptz default timezone('utc', now())
);

create table if not exists fact_margin (
  id bigserial primary key,
  organization_id uuid not null references organizations (id) on delete cascade,
  time_key integer not null references dim_time (date_key),
  client_id uuid references dim_client (id),
  gross_profit numeric(12,2),
  margin_pct numeric(5,2),
  created_at timestamptz default timezone('utc', now())
);

create table if not exists fact_compliance (
  id bigserial primary key,
  organization_id uuid not null references organizations (id) on delete cascade,
  time_key integer not null references dim_time (date_key),
  candidate_id uuid references dim_candidate (id),
  credential_type text,
  status text,
  created_at timestamptz default timezone('utc', now())
);

-- Indexing -----------------------------------------------------------------

create index if not exists organizations_slug_idx on organizations (slug);
create index if not exists memberships_org_user_idx on memberships (organization_id, user_id);
create index if not exists data_sources_org_idx on data_sources (organization_id);
create index if not exists dashboards_org_idx on dashboards (organization_id);
create index if not exists audit_logs_org_created_idx on audit_logs (organization_id, created_at);

-- Fact table composite indexes
create index if not exists fact_submission_org_time_idx on fact_submission (organization_id, time_key);
create index if not exists fact_interview_org_time_idx on fact_interview (organization_id, time_key);
create index if not exists fact_offer_org_time_idx on fact_offer (organization_id, time_key);
create index if not exists fact_placement_org_time_idx on fact_placement (organization_id, time_key);
create index if not exists fact_shift_org_time_idx on fact_shift (organization_id, time_key);
create index if not exists fact_revenue_org_time_idx on fact_revenue (organization_id, time_key);
create index if not exists fact_margin_org_time_idx on fact_margin (organization_id, time_key);
create index if not exists fact_compliance_org_time_idx on fact_compliance (organization_id, time_key);

-- RLS policies -------------------------------------------------------------

alter table organizations enable row level security;
alter table users enable row level security;
alter table memberships enable row level security;
alter table data_sources enable row level security;
alter table data_credentials enable row level security;
alter table dashboards enable row level security;
alter table org_goals enable row level security;
alter table audit_logs enable row level security;
alter table dim_organization enable row level security;
alter table dim_client enable row level security;
alter table dim_facility enable row level security;
alter table dim_recruiter enable row level security;
alter table dim_candidate enable row level security;
alter table dim_job enable row level security;
alter table fact_submission enable row level security;
alter table fact_interview enable row level security;
alter table fact_offer enable row level security;
alter table fact_placement enable row level security;
alter table fact_shift enable row level security;
alter table fact_revenue enable row level security;
alter table fact_margin enable row level security;
alter table fact_compliance enable row level security;

create policy "Users can view organizations they belong to"
  on organizations for select
  using (
    exists (
      select 1 from memberships m
      where m.organization_id = organizations.id
        and m.user_id = auth.uid()
    )
  );

-- Helper function to check membership without RLS recursion
-- Uses SECURITY DEFINER to bypass RLS when checking memberships
create or replace function public.user_has_membership_role(
  p_organization_id uuid,
  p_user_id uuid,
  p_roles text[] default null
)
returns boolean
language plpgsql
security definer
set search_path = public
stable
as $$
declare
  v_role membership_role;
begin
  -- Bypass RLS by using security definer
  select role into v_role
  from memberships
  where organization_id = p_organization_id
    and user_id = p_user_id
  limit 1;

  if v_role is null then
    return false;
  end if;

  -- If specific roles provided, check if user's role is in the list
  if p_roles is not null then
    return v_role::text = any(p_roles);
  end if;

  -- Otherwise, just check if membership exists
  return true;
end;
$$;

-- Drop existing policies to recreate them
drop policy if exists "Users manage own organization memberships" on memberships;
drop policy if exists "Users read memberships they belong to" on memberships;

-- Users can read their own membership or memberships in organizations they belong to
create policy "Users read memberships they belong to"
  on memberships for select
  using (
    -- User can see their own membership
    user_id = auth.uid()
    OR
    -- User can see memberships in organizations they belong to
    public.user_has_membership_role(organization_id, auth.uid())
  );

-- Only owners and admins can modify memberships in their organizations
create policy "Users manage own organization memberships"
  on memberships for all
  using (
    -- User can modify if they're an owner/admin of the organization
    public.user_has_membership_role(organization_id, auth.uid(), array['owner', 'admin'])
  )
  with check (
    -- Same check for inserts/updates
    public.user_has_membership_role(organization_id, auth.uid(), array['owner', 'admin'])
  );

-- Template policy generator for tenant tables
do $$
declare
  table_name text;
begin
  for table_name in
    select tablename
    from pg_tables
    where schemaname = 'public'
      and tablename in (
        'data_sources', 'dashboards', 'audit_logs',
        'dim_organization', 'dim_client', 'dim_facility', 'dim_recruiter',
        'dim_candidate', 'dim_job', 'fact_submission', 'fact_interview',
        'fact_offer', 'fact_placement', 'fact_shift', 'fact_revenue',
        'fact_margin', 'fact_compliance'
      )
  loop
    execute format('drop policy if exists %1$I_rls_select on %1$I;', table_name);
    execute format($f$
      create policy %1$I_rls_select on %1$I
        for select using (
          exists (
            select 1 from memberships m
            where m.organization_id = %1$I.organization_id
              and m.user_id = auth.uid()
          )
        );
    $f$, table_name);

    execute format('drop policy if exists %1$I_rls_modify on %1$I;', table_name);
    execute format($f$
      create policy %1$I_rls_modify on %1$I
        for all using (
          exists (
            select 1 from memberships m
            where m.organization_id = %1$I.organization_id
              and m.user_id = auth.uid()
              and m.role in ('owner', 'admin')
          )
        )
        with check (
          exists (
            select 1 from memberships m
            where m.organization_id = %1$I.organization_id
              and m.user_id = auth.uid()
              and m.role in ('owner', 'admin')
          )
        );
    $f$, table_name);
  end loop;
end $$;

comment on table data_credentials is 'Encrypted credentials stored via pgcrypto or Vault';
comment on table audit_logs is 'Tenant-scoped audit trail for sensitive actions';

-- User security policies ---------------------------------------------------

drop policy if exists "Users can read their profile" on users;
create policy "Users can read their profile"
  on users for select
  using (id = auth.uid());

drop policy if exists "Users can update their profile" on users;
create policy "Users can update their profile"
  on users for update
  using (id = auth.uid())
  with check (id = auth.uid());

drop policy if exists "Service role can manage users" on users;
create policy "Service role can manage users"
  on users for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- Organization goals policies (tenant-scoped) -------------------------------

drop policy if exists org_goals_rls_select on org_goals;
create policy org_goals_rls_select on org_goals
  for select using (
    exists (
      select 1 from memberships m
      where m.organization_id = org_goals.organization_id
        and m.user_id = auth.uid()
    )
  );

drop policy if exists org_goals_rls_modify on org_goals;
create policy org_goals_rls_modify on org_goals
  for all using (
    exists (
      select 1 from memberships m
      where m.organization_id = org_goals.organization_id
        and m.user_id = auth.uid()
        and m.role in ('owner', 'admin')
    )
  )
  with check (
    exists (
      select 1 from memberships m
      where m.organization_id = org_goals.organization_id
        and m.user_id = auth.uid()
        and m.role in ('owner', 'admin')
    )
  );

-- Data credentials policies (join via data_sources) ------------------------

drop policy if exists data_credentials_rls_select on data_credentials;
create policy data_credentials_rls_select on data_credentials
  for select using (
    exists (
      select 1
      from data_sources ds
      join memberships m on m.organization_id = ds.organization_id
      where ds.id = data_credentials.data_source_id
        and m.user_id = auth.uid()
    )
  );

drop policy if exists data_credentials_rls_modify on data_credentials;
create policy data_credentials_rls_modify on data_credentials
  for all using (
    exists (
      select 1
      from data_sources ds
      join memberships m on m.organization_id = ds.organization_id
      where ds.id = data_credentials.data_source_id
        and m.user_id = auth.uid()
        and m.role in ('owner', 'admin')
    )
  )
  with check (
    exists (
      select 1
      from data_sources ds
      join memberships m on m.organization_id = ds.organization_id
      where ds.id = data_credentials.data_source_id
        and m.user_id = auth.uid()
        and m.role in ('owner', 'admin')
    )
  );

-- Provision auth.users -> public.users sync --------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', new.email))
  on conflict (id) do update
    set email = excluded.email,
        full_name = coalesce(excluded.full_name, public.users.full_name),
        created_at = public.users.created_at;
  return new;
end;
$$;

create or replace function public.handle_user_delete()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.users where id = old.id;
  return old;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

drop trigger if exists on_auth_user_deleted on auth.users;
create trigger on_auth_user_deleted
  after delete on auth.users
  for each row execute function public.handle_user_delete();

-- Safeguard: prevent removing last owner -----------------------------------

create or replace function public.ensure_owner_presence()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  owner_count integer;
  org_id uuid;
begin
  if tg_table_name <> 'memberships' then
    return null;
  end if;

  if tg_op = 'DELETE' then
    org_id := old.organization_id;
    if old.role <> 'owner' then
      return old;
    end if;
    select count(*) into owner_count
    from memberships
    where organization_id = org_id
      and role = 'owner'
      and id <> old.id;
    if owner_count = 0 then
      raise exception 'Organization must retain at least one owner';
    end if;
    return old;
  end if;

  if tg_op = 'UPDATE' then
    org_id := new.organization_id;
    if old.role = 'owner' and new.role <> 'owner' then
      select count(*) into owner_count
      from memberships
      where organization_id = org_id
        and role = 'owner'
        and id <> old.id;
      if owner_count = 0 then
        raise exception 'Organization must retain at least one owner';
      end if;
    end if;
    return new;
  end if;

  return new;
end;
$$;

drop trigger if exists memberships_owner_guard on memberships;
create trigger memberships_owner_guard
  before delete or update on memberships
  for each row execute function public.ensure_owner_presence();