# Ecommerce-NodeJS - API

## 1. Setup Env

create new `.env` file in your diretory

Example `.env`:

```shell
# APP
ENVIRONMENT ='development'
PORT='3055'
# DB DEV
DEV_APP_PORT='3055'

# ubuntu
DEV_DB_PORT='127.0.0.1'

# wsl (cmd -> ipconfig -> ipv4)
# DEV_DB_PORT='192.168.1.97'
DEV_DB_NAME='shopDEV'

# DB PRODUCT
PRO_APP_PORT='4055'
PRO_DB_PORT='127.0.0.1'
PRO_DB_NAME='shopPRO'

# Discord bot log
TOKEN_BOT_LOG= ''
CHANNEL_ID_DISCORD=''

# Redis Cloud
REDIS_URL=''


# RabbitMQ
RABBIT_MQ_PASS = 'guest'

# Mysql
MYSQL_DB_NAME = 'NodeJs'
MYSQL_DB_USER = 'test'
MYSQL_DB_PASS = '1'

# Cloudinary
CLOUDINARY_NAME = ''
CLOUDINARY_API_KEY = ''
CLOUDINARY_SECRET_KEY = ''

#AWS
AWS_S3_NAME = ''
AWS_S3_API_KEY= ''
AWS_S3_SECRET_KEY= ''
AWS_CLOUD_FRONT = ''
AWS_KEY_PUBLIC_ID= '
CLOUD_FRONT_PRIVATE_KEY= ''
```

## 2. Install docker needed

- MongoDB
  ```shell
  docker run --name mdb -d -p 27017:27017 mongo
  ```
- Redis

  ```shell
  docker run --name rdb -d -p 6379:6379 redis
  ```

- RabbitMq
  ```shell
  docker run --name rabbitMQ -d -p 5672:5672 -p 15672:15672 rabbitmq:3-management
  ```

- Mysql
  ```shell
  #step-1: install mysql container
  docker run --name mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=12345 -d mysql:latest --max_connections=1000

  #step-2: create dev DB
  docker exec -it mysql bash
  mysql -uroot -p12345
  create database dev;


  ```



## 3. Gen key

- private key

```shell
openssl genrsa -out private_key.pem 2048
```

- public key

```shell
openssl rsa -pubout -in private_key.pem -out public_key.pem
```

## 4. Start with pm2

```shell
pm2 start npm --name NodeJs -- run dev --watch
```

## 5. CI/CD 123
