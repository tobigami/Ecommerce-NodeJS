# Docker và Docker Compose trong Ecommerce-NodeJS

Tài liệu này tổng hợp các kiến thức và lệnh thao tác với Docker và Docker Compose cho dự án Ecommerce-NodeJS.

## 1. Tổng quan về Docker

Docker là một nền tảng cho phép đóng gói ứng dụng và các phụ thuộc của nó vào một container. Với Docker, bạn có thể đảm bảo ứng dụng sẽ chạy giống nhau trên mọi môi trường.

### 1.1 Các thành phần chính của Docker

- **Docker Engine**: Nền tảng chạy các container
- **Docker Image**: Template chứa code, thư viện, biến môi trường để tạo container
- **Docker Container**: Instance của image đang chạy
- **Docker Registry**: Nơi lưu trữ các image (Docker Hub)
- **Dockerfile**: File kịch bản để build image
- **Docker Compose**: Công cụ quản lý nhiều container

## 2. Cấu trúc Dockerfile trong dự án

```dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Use either npm or pnpm based on your preference
# For pnpm
RUN npm install -g pnpm && pnpm install

# Copy app source
COPY . .

# Set environment variables
ENV NODE_ENV=development
ENV PORT=3055
ENV ENVIRONMENT=development

# Expose the port the app runs on
EXPOSE 3055

# Create a non-root user to run the app and change ownership
RUN addgroup -S nodejs && adduser -S nodejs -G nodejs
RUN chown -R nodejs:nodejs /app
USER nodejs

# Command to run the app
CMD ["npm", "run", "dev"]
```

### 2.1 Giải thích Dockerfile

- `FROM node:18-alpine`: Sử dụng image Node.js 18 phiên bản Alpine (nhẹ)
- `WORKDIR /app`: Thiết lập thư mục làm việc trong container
- `COPY package.json...`: Copy file package.json trước để tận dụng cache
- `RUN npm install...`: Cài đặt các dependencies
- `COPY . .`: Copy toàn bộ code nguồn vào container
- `ENV...`: Thiết lập biến môi trường
- `EXPOSE 3055`: Mở cổng 3055
- `RUN addgroup...`: Tạo user non-root để tăng bảo mật
- `CMD ["npm", "run", "dev"]`: Lệnh khởi động ứng dụng

## 3. Docker Compose trong dự án

Docker Compose giúp định nghĩa và chạy multi-container Docker applications. Trong dự án này, chúng ta sử dụng 4 service: Node.js app, MongoDB, MySQL và Redis.

### 3.1 Cấu trúc docker-compose.yml

```yaml
version: '3.8'

services:
  # Node.js application
  app:
    build: .
    container_name: ecommerce-nodejs-app
    restart: always
    ports:
      - '3055:3055'
    environment:
      # App environment, MongoDB, MySQL, Redis settings...
      # Các biến môi trường từ file .env
    volumes:
      - ./src/uploads:/app/src/uploads
      - ./logs:/app/logs
    depends_on:
      - mongodb
      - mysql
      - redis
    networks:
      - ecommerce-network

  # MongoDB service
  mongodb:
    image: mongo:latest
    container_name: ecommerce-mongodb
    restart: always
    ports:
      - '27017:27017'
    volumes:
      - mongodb-data:/data/db
    networks:
      - ecommerce-network

  # MySQL service
  mysql:
    image: mysql:8.0
    container_name: ecommerce-mysql
    restart: always
    ports:
      - '3306:3306'
    environment:
      - MYSQL_ROOT_PASSWORD=12345
      - MYSQL_DATABASE=dev
      - MYSQL_TCP_PORT=3306
    volumes:
      - mysql-data:/var/lib/mysql
    networks:
      - ecommerce-network

  # Redis service
  redis:
    image: redis:alpine
    container_name: ecommerce-redis
    restart: always
    ports:
      - '6379:6379'
    volumes:
      - redis-data:/data
    networks:
      - ecommerce-network

volumes:
  mongodb-data:
  mysql-data:
  redis-data:

networks:
  ecommerce-network:
    driver: bridge
```

### 3.2 Giải thích docker-compose.yml

- **Services**: Định nghĩa 4 service (container) cần chạy
  - **app**: Ứng dụng Node.js được build từ Dockerfile
  - **mongodb**: Service MongoDB sử dụng image mongo:latest
  - **mysql**: Service MySQL sử dụng image mysql:8.0
  - **redis**: Service Redis sử dụng image redis:alpine
- **Volumes**: Lưu trữ dữ liệu bền vững giữa các lần chạy container
- **Networks**: Tạo network riêng cho các container giao tiếp với nhau

## 4. Lệnh Docker Compose thường dùng

### 4.1 Build và chạy container

```zsh
# Build và chạy tất cả container (chế độ detached)
docker-compose up -d

# Buộc build lại image trước khi chạy
docker-compose up -d --build

# Chỉ chạy một service cụ thể
docker-compose up -d app
```

### 4.2 Kiểm tra trạng thái

```zsh
# Liệt kê các container đang chạy
docker-compose ps

# Xem logs của tất cả service
docker-compose logs

# Xem logs của service cụ thể và theo dõi real-time
docker-compose logs -f app
```

### 4.3 Dừng và xóa container

```zsh
# Dừng các container (không xóa)
docker-compose stop

# Dừng và xóa các container
docker-compose down

# Dừng, xóa container và xóa volume
docker-compose down -v
```

### 4.4 Thao tác với container

```zsh
# Thực thi lệnh trong container
docker-compose exec app /bin/sh

# Khởi động lại một container
docker-compose restart app

# Khởi động lại tất cả container
docker-compose restart

# Xem sử dụng tài nguyên
docker stats
```

### 4.5 Restart Docker Compose

```zsh
# Cách 1: Restart tất cả service trong docker-compose
docker-compose restart

# Cách 2: Restart một service cụ thể
docker-compose restart app
docker-compose restart mysql

# Cách 3: Down và up lại (khởi động lại hoàn toàn)
docker-compose down && docker-compose up -d

# Cách 4: Restart với các thay đổi trong docker-compose.yml
docker-compose up -d --force-recreate

# Cách 5: Restart và build lại image (nếu có thay đổi trong Dockerfile)
docker-compose up -d --build

# Cách 6: Restart với timeout tùy chỉnh (mặc định là 10 giây)
docker-compose restart --timeout 30
```

### 4.6 Quản lý image và volume

```zsh
# Liệt kê tất cả image
docker images

# Liệt kê tất cả volume
docker volume ls

# Xóa image không sử dụng
docker image prune

# Xóa volume không sử dụng
docker volume prune
```

## 5. Các điểm lưu ý quan trọng

### 5.1 Biến môi trường và Docker Compose

- Docker Compose có thể sử dụng biến từ file `.env` với cú pháp `${VARIABLE_NAME}`
- Nếu có `${TOKEN_BOT_LOG}` trong docker-compose.yml, giá trị sẽ được lấy từ file `.env`
- Không nên bỏ file `.env` vào `.dockerignore` nếu sử dụng cú pháp `${VARIABLE}`

### 5.2 User non-root trong Docker

- Chạy container với quyền non-root là best practice về bảo mật
- Nếu bỏ qua bước tạo user non-root, container sẽ chạy với quyền root (rủi ro bảo mật cao hơn)
- Trong môi trường development, có thể bỏ qua bước này, nhưng không nên trong production

### 5.3 Image vs Container

- **Image**: Template để tạo container (giống class trong OOP)
- **Container**: Instance của image đang chạy (giống object trong OOP)
- Nhiều container có thể được tạo từ cùng một image
- Mỗi image có nhiều layers, được cache và có thể tái sử dụng

### 5.4 Dockerfile vs docker-compose.yml

- **Dockerfile**: Định nghĩa cách build image cho một service
- **docker-compose.yml**: Định nghĩa cách các service tương tác với nhau
- Trong docker-compose.yml, bạn có thể sử dụng `build: .` để build từ Dockerfile hoặc `image: name` để sử dụng image có sẵn

### 5.5 MySQL và Docker

Docker sẽ tự động thiết lập MySQL thông qua các biến môi trường:

- `MYSQL_DATABASE=dev`: Tự động tạo database "dev"
- `MYSQL_ROOT_PASSWORD=12345`: Thiết lập mật khẩu root
- `MYSQL_USER`, `MYSQL_PASSWORD`: Tạo user mới (nếu cần)

## 6. Workflow phát triển với Docker

1. **Phát triển**: Sửa code trên máy host
2. **Build**: `docker-compose build` hoặc `docker-compose up --build -d`
3. **Chạy**: `docker-compose up -d`
4. **Kiểm tra**: `docker-compose logs -f app`
5. **Debug**: Truy cập vào container `docker-compose exec app /bin/sh`
6. **Dừng**: `docker-compose down` khi hoàn tất

## 7. Quyết định sử dụng Docker hay Docker Compose

- **Chỉ Docker**: Phù hợp khi chỉ cần một container đơn lẻ
- **Docker Compose**: Phù hợp khi cần nhiều service tương tác với nhau (như trong dự án này)

## 8. Khắc phục sự cố

### Xung đột cổng

```zsh
# Kiểm tra cổng đang sử dụng
sudo lsof -i :3055
sudo lsof -i :3306

# Dừng tiến trình sử dụng cổng
kill -9 PID
```

### Container không khởi động

```zsh
# Xem log chi tiết
docker logs ecommerce-nodejs-app

# Kiểm tra lỗi
docker-compose ps
```

### Database không kết nối

```zsh
# Kiểm tra network
docker network inspect ecommerce-network

# Thử kết nối thủ công từ container app
docker-compose exec app /bin/sh
ping mongodb  # hoặc ping mysql, ping redis
```

## 9. Best practices

1. Luôn sử dụng Docker volumes cho dữ liệu cần lưu trữ lâu dài
2. Sử dụng user non-root trong production
3. Tận dụng Docker layer cache bằng cách đặt các lệnh ít thay đổi lên đầu Dockerfile
4. Sử dụng `.dockerignore` để giảm kích thước context build
5. Thiết lập biến môi trường thông qua docker-compose.yml thay vì hard-code trong Dockerfile
