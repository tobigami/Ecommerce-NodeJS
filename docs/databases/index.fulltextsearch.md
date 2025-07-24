[video](https://www.youtube.com/watch?v=1GTak-ifAnQ)

```sql
explain select sql_no_cache * from users where user_password like '%436 Moto%'; -- 9s 861ms | 366 record -> result '****436 Moto****' no use index

explain select sql_no_cache * from users where user_password like '436 Moto%'; -- 250ms | 284 record  -> result '436 Moto****' use index

explain select sql_no_cache * from users where user_password like '%560 Moto Guzzi'; -- 9s 751ms | 80 record  -> result '***560 Moto Guzzi' no use index

-- index full text

create fulltext index idx_user_password_full_text on users(user_password);

select sql_no_cache * from users where user_password like '%1998 Benelli 560 Moto Guzzi%';

select sql_no_cache * from users where user_password like '%Benelli 560 Moto%'; --

select sql_no_cache * from users where match(user_password) against('+Benelli +560' in boolean mode);
```
