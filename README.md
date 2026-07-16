# QL_AnToanVeSinhLaoDong

Dự án quản lý an toàn vệ sinh lao động gồm 2 phần:

- Backend: NestJS, TypeORM, PostgreSQL, Redis, Swagger
- Frontend: Next.js, React, TypeScript

## 1. Yêu Cầu Môi Trường

Khuyến nghị cài sẵn:

- Node.js 22 trở lên
- npm 10 trở lên
- Docker và Docker Compose
- PostgreSQL 15 nếu chạy local không dùng Docker
- Redis 7 nếu chạy local không dùng Docker

## 2. Cấu Trúc Dự Án

- `backend/`: API NestJS, seed SQL, mail, Redis, Swagger
- `frontend/`: giao diện Next.js
- `docker-compose.yml`: chạy đồng thời PostgreSQL, Redis, backend, frontend

## 3. Các File Cấu Hình Cần Tạo

### 3.1. Backend

Tạo file `backend/.env` từ `backend/.env.example`.

Nếu chưa có file mẫu, có thể tạo thủ công với nội dung bên dưới:

```env
NODE_ENV=development
VNA_PORT=3010

VNA_TOKEN_SECRET_KEY=your-secret-key
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-refresh-secret

VNA_DB_HOST=localhost
VNA_DB_PORT=5432
VNA_DB_USER=postgres
VNA_DB_PASSWORD=postgres
VNA_DB_DATABASE=vna_db

VNA_S3_ACCESS_ID=
VNA_S3_ACCESS_KEY=
VNA_S3_BUCKET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

REDIS_HOST=localhost
REDIS_PORT=6379

OTP_EXPIRATION_TIME=300
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=

dirTemp=src/templates
```

### 3.2. Frontend

Tạo file `frontend/.env.local` từ `frontend/.env.example`.

Nội dung tối thiểu:

```env
NEXT_PUBLIC_API_ENDPOINT=http://localhost:3010
```

## 4. Chạy Local Bằng Terminal

### 4.1. Khởi động PostgreSQL và Redis

Nếu muốn dùng Docker cho database và cache:

```bash
docker compose up -d db redis
```

### 4.2. Chạy Backend

Backend dùng NestJS và có cơ chế seed dữ liệu từ các file SQL trong `src/sql` khi khởi động. Để tránh lỗi thiếu thư mục build, nên build trước rồi mới chạy.

```bash
cd backend
npm install
npm run build
npm run start:prod
```

Nếu muốn chạy ở chế độ phát triển sau khi đã build ít nhất một lần:

```bash
npm run start:dev
```

Backend sẽ chạy tại:

- API: `http://localhost:3010`
- Swagger: `http://localhost:3010/api/v1/api-docs`

### 4.3. Chạy Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend sẽ chạy tại:

- `http://localhost:3000`

## 5. Chạy Bằng Docker

### 5.1. Chuẩn bị

Đảm bảo đã tạo sẵn:

- `backend/.env`
- `frontend/.env.local` hoặc truyền biến khi build frontend

### 5.2. Build Và Chạy Toàn Bộ Hệ Thống

```bash
docker compose up --build
```

Compose sẽ khởi động:

- PostgreSQL tại cổng `5432`
- Redis tại cổng `6379`
- Backend tại cổng `3010`
- Frontend tại cổng `3000`

### 5.3. Dừng Hệ Thống

```bash
docker compose down
```

Nếu muốn xóa luôn dữ liệu PostgreSQL đã lưu trong volume:

```bash
docker compose down -v
```

## 6. Biến Môi Trường Quan Trọng

### Backend

- `NODE_ENV`: môi trường chạy, ví dụ `development` hoặc `production`
- `VNA_PORT`: cổng backend, mặc định `3010`
- `VNA_TOKEN_SECRET_KEY`: secret dùng ký JWT
- `JWT_ACCESS_EXPIRES_IN`: thời gian hết hạn access token
- `JWT_REFRESH_EXPIRES_IN`: thời gian hết hạn refresh token
- `JWT_REFRESH_SECRET`: secret cho refresh token
- `VNA_DB_HOST`: host PostgreSQL, `localhost` khi chạy local, `db` khi chạy Docker Compose
- `VNA_DB_PORT`: cổng PostgreSQL, mặc định `5432`
- `VNA_DB_USER`: username PostgreSQL
- `VNA_DB_PASSWORD`: mật khẩu PostgreSQL
- `VNA_DB_DATABASE`: tên database PostgreSQL
- `REDIS_HOST`: host Redis, `localhost` khi chạy local, `redis` khi chạy Docker Compose
- `REDIS_PORT`: cổng Redis, mặc định `6379`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`: cấu hình gửi email
- `CLOUDINARY_*`: cấu hình upload ảnh nếu sử dụng Cloudinary
- `VNA_S3_*`: cấu hình S3 nếu module upload dùng S3
- `OTP_EXPIRATION_TIME`: thời gian sống OTP
- `dirTemp`: thư mục template email

### Frontend

- `NEXT_PUBLIC_API_ENDPOINT`: địa chỉ backend, mặc định `http://localhost:3010`

## 7. API Và Tài Liệu Kỹ Thuật

- Prefix API của backend: `api/v1`
- Swagger: `http://localhost:3010/api/v1/api-docs`
- Frontend gọi API qua biến `NEXT_PUBLIC_API_ENDPOINT`

## 8. Ghi Chú Quan Trọng Khi Chạy Dự Án

- Backend đang tự seed dữ liệu từ các file SQL trong `src/sql` khi khởi động.
- Khi chạy local, nên build backend trước để thư mục `dist/src/sql` tồn tại.
- Trong Docker, `docker-compose.yml` đã cấu hình sẵn backend dùng PostgreSQL và Redis theo tên service `db` và `redis`.
- Không nên commit file `.env` thật chứa secret lên GitHub.

## 9. Gợi Ý Cấu Hình Nhanh

1. Tạo `backend/.env` theo mẫu.
2. Tạo `frontend/.env.local` với `NEXT_PUBLIC_API_ENDPOINT=http://localhost:3010`.
3. Chạy `docker compose up -d db redis`.
4. Chạy backend bằng `npm run build && npm run start:prod`.
5. Chạy frontend bằng `npm run dev`.

## 10. Tình Huống Thường Gặp

- Nếu backend báo lỗi kết nối database, kiểm tra lại `VNA_DB_HOST` và `VNA_DB_PORT`.
- Nếu frontend không gọi được API, kiểm tra `NEXT_PUBLIC_API_ENDPOINT`.
- Nếu backend không seed được dữ liệu SQL, chắc chắn đã build ra thư mục `dist` trước khi start.
- Nếu cổng `3000` hoặc `3010` bị chiếm, đổi lại trong file `.env` và cấu hình Docker Compose tương ứng.
