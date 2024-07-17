```Bash
# search docker
docker search mysql

# tao container
# use: root
# password: 12345
docker run --name mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=12345 -d mysql:latest --max_connections=1000

# dang nhap vao docker va su dung mysql
docker exec -it mysql bash

# dang nhap admin vao mysql voi user root vao password da khoi tao phia tren
mysql -uroot -p12345

# show databases
show databases;

# Hien tai t dang la Admin va se tao ra 1 DB va tao 1 user cap quyen quan ly cho cai DB do

# 1. Tao user
# user : test
# pass : 1
# % : localhost

 CREATE USER 'test'@'%' IDENTIFIED BY '1';
 
 # 2. Tao DB 
 create database db1;
 
 # 3. Cap quyen cho user test vao Db: db1
 # .* : co nghia la co quyen truy cap vao tat ca cac bang
 
 GRANT ALL PRIVILEGES ON db1.* TO 'test'@'%';
 FLUSH PRIVILEGES;
```

---
