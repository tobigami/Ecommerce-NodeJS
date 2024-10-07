# Ecommerce-NodeJS - API

## 1. Setup Env

create new `.env` file in your diretory

Example `.env`:

```shell
# APP
ENVIRONMENT ='dev'
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

```

## 2. Install docker needed

* MongoDB
  ```shell
  docker run --name mdb -d -p 27017:27017 mongo
  ```
  
* Redis
  ```shell
  docker run --name rdb -d -p 6379:6379 redis
  ```

* RabbitMq
  ```shell
  docker run --name rabbitMQ -d -p 5672:5672 -p 15672:15672 rabbitmq:3-management
  ```

## 3. Start with pm2

```shell
pm2 start npm --name NodeJs -- run dev --watch
```
