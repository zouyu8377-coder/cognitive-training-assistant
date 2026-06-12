create or replace function public.prune_training_history()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.activity_events
  where session_id in (
    select id
    from public.training_sessions
    order by started_at desc, created_at desc, id desc
    offset 100
  );

  delete from public.training_sessions
  where id in (
    select id
    from public.training_sessions
    order by started_at desc, created_at desc, id desc
    offset 100
  );
end;
$$;

create or replace function public.prune_training_history_after_insert()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.prune_training_history();
  return null;
end;
$$;

drop trigger if exists trim_training_history_after_insert on public.training_sessions;

create trigger trim_training_history_after_insert
after insert on public.training_sessions
for each statement
execute function public.prune_training_history_after_insert();

select public.prune_training_history();

revoke all on function public.prune_training_history() from public;
revoke all on function public.prune_training_history_after_insert() from public;
