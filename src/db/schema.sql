-- Esquema de Reward Card. Idempotente: se puede ejecutar varias veces.
create table if not exists businesses (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  country text not null default 'CR',
  color text not null default '#c8f169',
  icon text not null default 'coffee',
  stamps_required integer not null default 10,
  reward_text text not null,
  pin_hash text not null,
  wallet_template_id text,
  created_at timestamptz not null default now()
);

create table if not exists members (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  name text not null,
  phone text not null,
  code text unique not null,
  token text unique not null,
  stamps integer not null default 0,
  rewards_available integer not null default 0,
  total_stamps integer not null default 0,
  wallet_instance_id text,
  wallet_url text,
  consent_at timestamptz not null default now(),
  last_stamp_at timestamptz,
  created_at timestamptz not null default now(),
  unique (business_id, phone)
);

create table if not exists coupons (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  title text not null,
  description text not null default '',
  expires_at timestamptz,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists coupon_redemptions (
  coupon_id uuid not null references coupons(id) on delete cascade,
  member_id uuid not null references members(id) on delete cascade,
  redeemed_at timestamptz not null default now(),
  primary key (coupon_id, member_id)
);

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  member_id uuid references members(id) on delete cascade,
  type text not null,
  detail text,
  created_at timestamptz not null default now()
);

create index if not exists events_business_created on events (business_id, created_at desc);
create index if not exists members_business on members (business_id, created_at desc);
