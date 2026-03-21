-- ══════════════════════════════════════════════
-- PHENEXAI DATABASE SCHEMA
-- Run this in your Supabase SQL Editor
-- ══════════════════════════════════════════════

-- USERS
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  password text not null,
  name text not null,
  business_name text,
  plan text default 'free',
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- SUB ACCOUNTS
create table if not exists sub_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  business_name text not null,
  website text,
  industry text,
  phone text,
  ai_data jsonb,
  integrations jsonb default '[]',
  status text default 'active',
  created_at timestamptz default now()
);

-- CONTACTS
create table if not exists contacts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  name text not null,
  email text,
  phone text,
  company text,
  source text default 'manual',
  status text default 'new',
  value numeric default 0,
  notes text,
  tags text[],
  ai_score integer,
  ai_next_action text,
  last_contacted_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- DEALS
create table if not exists deals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  contact_id uuid references contacts(id) on delete set null,
  name text not null,
  value numeric default 0,
  stage text default 'Lead',
  probability integer default 10,
  close_date date,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- APPOINTMENTS
create table if not exists appointments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  contact_id uuid references contacts(id) on delete set null,
  title text not null,
  start_time timestamptz not null,
  end_time timestamptz,
  type text default 'call',
  status text default 'scheduled',
  notes text,
  meeting_url text,
  created_at timestamptz default now()
);

-- CONVERSATIONS
create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  contact_id uuid references contacts(id) on delete set null,
  channel text not null,
  last_message text,
  last_message_at timestamptz default now(),
  unread_count integer default 0,
  status text default 'open',
  created_at timestamptz default now()
);

-- MESSAGES
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  conversation_id uuid references conversations(id) on delete cascade,
  contact_id uuid references contacts(id) on delete set null,
  channel text not null,
  direction text not null,
  body text not null,
  from_number text,
  to_number text,
  twilio_sid text,
  is_ai boolean default false,
  created_at timestamptz default now()
);

-- INVOICES
create table if not exists invoices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  contact_id uuid references contacts(id) on delete set null,
  invoice_number text,
  amount numeric not null,
  currency text default 'usd',
  tax numeric default 0,
  description text,
  due_date date,
  status text default 'pending',
  stripe_id text,
  payment_url text,
  paid_at timestamptz,
  created_at timestamptz default now()
);

-- CAMPAIGNS
create table if not exists campaigns (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  name text not null,
  channel text not null,
  subject text,
  body text,
  audience jsonb,
  status text default 'draft',
  scheduled_at timestamptz,
  sent_at timestamptz,
  stats jsonb default '{"sent":0,"opened":0,"clicked":0,"replied":0}',
  created_at timestamptz default now()
);

-- WORKFLOWS
create table if not exists workflows (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  name text not null,
  trigger jsonb,
  steps jsonb default '[]',
  is_active boolean default true,
  run_count integer default 0,
  last_run_at timestamptz,
  created_at timestamptz default now()
);

-- AI CONVERSATIONS
create table if not exists ai_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  contact_id uuid references contacts(id) on delete set null,
  user_message text not null,
  ai_reply text not null,
  created_at timestamptz default now()
);

-- INDEXES for performance
create index if not exists idx_contacts_user_id on contacts(user_id);
create index if not exists idx_contacts_status on contacts(status);
create index if not exists idx_deals_user_id on deals(user_id);
create index if not exists idx_deals_stage on deals(stage);
create index if not exists idx_appointments_user_id on appointments(user_id);
create index if not exists idx_messages_conversation_id on messages(conversation_id);
create index if not exists idx_invoices_user_id on invoices(user_id);
create index if not exists idx_invoices_status on invoices(status);

-- ROW LEVEL SECURITY (optional but recommended)
alter table users enable row level security;
alter table contacts enable row level security;
alter table deals enable row level security;
alter table appointments enable row level security;
alter table invoices enable row level security;
alter table campaigns enable row level security;
alter table workflows enable row level security;
alter table messages enable row level security;
alter table ai_conversations enable row level security;

select 'PhenexAi database schema created successfully! 🚀' as status;
