-- Initial schema for life-game

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  username text unique not null,
  password_hash text not null,
  level integer default 1,
  total_xp integer default 0,
  current_streak integer default 0,
  longest_streak integer default 0,
  last_active_date date,
  created_at timestamp with time zone default now()
);

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  title text not null,
  description text,
  xp_reward integer default 10,
  due_date date,
  repeat_rule text default 'none',
  completed boolean default false,
  completed_at timestamp with time zone,
  created_at timestamp with time zone default now()
);

create table if not exists habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  name text not null,
  xp_reward integer default 5,
  current_streak integer default 0,
  longest_streak integer default 0,
  last_check_in date,
  created_at timestamp with time zone default now()
);

create table if not exists habit_logs (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid references habits(id) on delete cascade,
  check_in_date date not null,
  created_at timestamp with time zone default now(),
  unique(habit_id, check_in_date)
);

create table if not exists achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  achievement_key text not null,
  unlocked_at timestamp with time zone default now(),
  unique(user_id, achievement_key)
);

-- Note: RLS disabled for now - backend handles auth via JWT
