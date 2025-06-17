use dev;
drop table users;
truncate table users;

desc users;

-- show index and check cardinality
show index from users;

-- drop index
drop index idx_user_status on users;


select count(*) from users;


-- not soft no idx select *
-- 379ms
select sql_no_cache *
from users
where user_createdAt > '2025-01-01 10:19:51'
  AND user_createdAt < '2025-04-01 10:19:51'
limit 1;

-- 521
select sql_no_cache *
from users
where user_createdAt > '2025-01-01 10:19:51'
  AND user_createdAt < '2025-04-01 10:19:51'
limit 100000, 50;

-- 1s 821ms
select sql_no_cache *
from users
where user_createdAt > '2025-01-01 10:19:51'
  AND user_createdAt < '2025-04-01 10:19:51'
limit 1000000, 50;

-- 8s 46ms with order by
select sql_no_cache *
from users
where user_createdAt > '2025-01-01 10:19:51'
  AND user_createdAt < '2025-04-01 10:19:51'
order by user_createdAt ASC, user_id ASC
limit 1400000, 50;


-- 5s 289ms with order by select user_id and wo idx
explain
select sql_no_cache user_id
from users
where user_createdAt > '2025-01-01 10:19:51'
  AND user_createdAt < '2025-04-01 10:19:51'
order by user_createdAt ASC, user_id ASC
limit 1400000, 50;

-- create index
create index idx_user_createdAt on users (user_createdAt);

--  582ms with order by select user_id and with idx
explain
select sql_no_cache user_id
from users
where user_createdAt > '2025-01-01 10:19:51'
  AND user_createdAt < '2025-04-01 10:19:51'
order by user_createdAt ASC, user_id ASC
limit 1400000, 50;

-- 7s 687ms with order by select user_id and with idx
explain
select sql_no_cache user_id, user_email, user_phone, user_password, user_username, user_status
from users
where user_createdAt > '2025-01-01 10:19:51'
  AND user_createdAt < '2025-04-01 10:19:51'
order by user_createdAt ASC, user_id ASC
limit 1400000, 50;

-- 8s 22ms with order by select user_id and with idx
explain
select sql_no_cache *
from users
where user_createdAt > '2025-01-01 10:19:51'
  AND user_createdAt < '2025-04-01 10:19:51'
order by user_createdAt ASC, user_id ASC
limit 1400000, 50;

-- OPTIMIZE SELECT time: 603ms
select sql_no_cache pre.user_id, user_email, user_phone, user_password, user_username, user_status
from (select sql_no_cache user_id
      from users
      where user_createdAt > '2025-01-01 10:19:51' AND user_createdAt < '2025-04-01 10:19:51'
      order by user_createdAt, user_id
      limit 1400000, 50
      ) as temp inner join users as pre on temp.user_id = pre.user_id
order by user_createdAt ASC, user_id ASC;

-- Test create index for status col
create index idx_user_status on users (user_status);


