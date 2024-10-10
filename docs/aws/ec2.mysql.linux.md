## Cau hinh mysql tren linux ec2

```bash
# cau hinh kho luu tru can thiet
sudo amazon-linux-extras install epel -y

# cai dat mysql 8 tren linux
sudo yum install https://dev.mysql.com/get/mysql80-community-release-el7-5.noarch.rpm
sudo yum install mysql-community-server

# fix loi
rpm --import https://repo.mysql.com/RPM-GPG-KEY-mysql-2023

# active mysql
sudo systemctl enable mysqld
sudo systemctl start mysqld

# check status
sudo systemctl status mysqld

# check default password of mysql server
sudo cat /var/log/mysqld.log | grep "temporary password"

# change password default
ALTER USER root@'localhost' IDENTIFIED WITH mysql_native_password BY '@Asdasd1231411';
```

## Import Data from file local

```bash
# Day file len sever ec2
scp -i "~/.ssh/mysql-shopdev-ec2.pem" ~/Downloads/w3schools.sql ec2-user@ec2-18-142-253-111.ap-southeast-1.compute.amazonaws.com:~/

# truy cap vao mysql vao import data
source /path/to/w3schools.sql;

# Buoc tiep theo se tao user va cap quyen cho phep user truy cap vao db tu xa

# tao user (localhost)
CREATE USER 'thanhdd'@'localhost' IDENTIFIED WITH mysql_native_password BY '@Asdasd1231411';

# cap quyen cho use vua tao truy cap vao db (w3schools.*)
GRANT ALL PRIVILEGES ON w3schools.* TO 'thanhdd'@'localhost';

# tao 1 user cho phep truy cap remote tu khap noi (%)
CREATE USER 'shopdev'@'%' IDENTIFIED WITH mysql_native_password BY 'Dev12345@#';

# cap quyen cho phep user shopdev co quyen truy cap tat ca cac db giong nhu root (*.*)
GRANT ALL PRIVILEGES ON *.* TO 'shopdev'@'%';

```
