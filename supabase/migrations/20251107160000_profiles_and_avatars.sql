-- migration: profiles_and_avatars
-- purpose: add the public avatars bucket with secure policies and introduce the profiles table for storing user profile details.

insert into storage.buckets (id, name, public)
select 'avatars', 'avatars', true
where not exists (
  select 1
  from storage.buckets
  where id = 'avatars'
);

-- allow anyone to read assets from the avatars bucket.
create policy "public can read avatars bucket"
  on storage.objects
  for select
  to authenticated, anon
  using (bucket_id = 'avatars');

-- allow authenticated users to upload avatars within a path scoped to their user id.
create policy "authenticated users can upload avatars"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'avatars'
    and coalesce(owner, (select auth.uid())) = (select auth.uid())
    and (
      name = (select auth.uid())::text
      or name like (select auth.uid())::text || '/%'
    )
  );

-- allow authenticated users to update avatars they own in the avatars bucket.
create policy "authenticated users can update avatars"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'avatars'
    and coalesce(owner, (select auth.uid())) = (select auth.uid())
    and (
      name = (select auth.uid())::text
      or name like (select auth.uid())::text || '/%'
    )
  )
  with check (
    bucket_id = 'avatars'
    and coalesce(owner, (select auth.uid())) = (select auth.uid())
    and (
      name = (select auth.uid())::text
      or name like (select auth.uid())::text || '/%'
    )
  );

-- allow authenticated users to delete avatars they own in the avatars bucket.
create policy "authenticated users can delete avatars"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'avatars'
    and coalesce(owner, (select auth.uid())) = (select auth.uid())
    and (
      name = (select auth.uid())::text
      or name like (select auth.uid())::text || '/%'
    )
  );

-- create a profiles table for storing user details.
create table if not exists public.profiles (
  user_id uuid not null primary key references auth.users (id) on delete cascade,
  first_name text,
  last_name text,
  avatar_url text,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

comment on table public.profiles is 'Stores user profile metadata, including names and avatar URL.';
comment on column public.profiles.user_id is 'References the authenticated user.';
comment on column public.profiles.avatar_url is 'Points to the avatar asset stored in the avatars bucket.';

alter table public.profiles enable row level security;

-- allow users to read their own profile records.
create policy "users can read own profile"
  on public.profiles
  for select
  to authenticated
  using (user_id = (select auth.uid()));

-- allow users to insert their own profile records.
create policy "users can insert own profile"
  on public.profiles
  for insert
  to authenticated
  with check (user_id = (select auth.uid()));

-- allow users to update their own profile records.
create policy "users can update own profile"
  on public.profiles
  for update
  to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

-- allow users to delete their own profile records when needed.
create policy "users can delete own profile"
  on public.profiles
  for delete
  to authenticated
  using (user_id = (select auth.uid()));

-- ensure updated_at stays in sync on modifications.
create or replace function public.handle_profiles_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row
  execute procedure public.handle_profiles_updated_at();

