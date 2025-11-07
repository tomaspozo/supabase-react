-- migration: create_showcase_bucket
-- purpose: create the showcase storage bucket and row level security policies that scope access to user-owned paths.

insert into storage.buckets (id, name, public)
select 'showcase', 'showcase', false
where not exists (
  select 1
  from storage.buckets
  where id = 'showcase'
);

-- allow authenticated users to view objects they own within the showcase bucket.
create policy "authenticated users can view own showcase files"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'showcase'
    and (
      owner = (select auth.uid())
      or name = (select auth.uid())::text
      or name like (select auth.uid())::text || '/%'
    )
  );

-- allow authenticated users to upload objects when the path matches their user id within the showcase bucket.
create policy "authenticated users can upload to own showcase path"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'showcase'
    and coalesce(owner, (select auth.uid())) = (select auth.uid())
    and (
      name = (select auth.uid())::text
      or name like (select auth.uid())::text || '/%'
    )
  );

-- allow authenticated users to update objects they own within the showcase bucket.
create policy "authenticated users can update own showcase files"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'showcase'
    and coalesce(owner, (select auth.uid())) = (select auth.uid())
    and (
      name = (select auth.uid())::text
      or name like (select auth.uid())::text || '/%'
    )
  )
  with check (
    bucket_id = 'showcase'
    and coalesce(owner, (select auth.uid())) = (select auth.uid())
    and (
      name = (select auth.uid())::text
      or name like (select auth.uid())::text || '/%'
    )
  );

-- allow authenticated users to delete objects they own within the showcase bucket.
create policy "authenticated users can delete own showcase files"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'showcase'
    and coalesce(owner, (select auth.uid())) = (select auth.uid())
    and (
      name = (select auth.uid())::text
      or name like (select auth.uid())::text || '/%'
    )
  );

