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

# window
# DEV_DB_PORT='127.0.0.1'

# wsl (cmd -> ipconfig -> ipv4)
DEV_DB_PORT='192.168.1.97'
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

```

## 2. Start with pm2

```shell
pm2 start npm --name NodeJs -- run dev --watch
```
