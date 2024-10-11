# Ẩn port với config của ngix

```bash
# install nginx
sudo apt-get install -y nginx

# edit config
cd /etc/nginx/sites-available
sudo vi default

# config
location /v1/api {
  rewrite ^\/v1\/api\/(.*)$ /v1/api/$1 break;
  proxy_pass http://localhost:3055;
  proxy_set_header Host $host;
  proxy_set_header X-Real_IP $remote_addr;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}

# restart nginx
sudo systemctl restart nginx

```

# Config domain với nginx - pedding do chua co domain

```bash
server_name thanh.dd.com www.thanh.dd.com;
location / {
  proxy_pass http://localhost:3055;
  proxy_http_version 1.1;
  proxy_set_header Upgrade $http_upgrade;
  proxy_set_header Connection 'upgrade';
  proxy_set_header Host $host;
  proxy_cache_bypass $http_upgrade;
}
```
