create table if not exists public.workbench_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.workbench_state enable row level security;

create policy "Users can read own workbench"
on public.workbench_state for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert own workbench"
on public.workbench_state for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update own workbench"
on public.workbench_state for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
