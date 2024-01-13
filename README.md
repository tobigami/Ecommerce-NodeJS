# Ecommerce-NodeJS - API
## 1. Setup Env
create new ```.env``` file in your diretory

Example ```.env```:
```shell
ENVIRONMENT ='dev'
PORT='3055'

DEV_APP_PORT='3055'
DEV_DB_PORT='127.0.0.1'
DEV_DB_NAME='shopDEV'

PRO_APP_PORT='4055'
PRO_DB_PORT='127.0.0.1'
PRO_DB_NAME='shopPRO'
```
## 2. Start Service
```shell
pm2 start npm --name EcommerceNodeJs -- run dev --watch
```
