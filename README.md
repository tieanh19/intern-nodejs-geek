# REST API - Report for GeekUp
- Ứng viên thực hiện: Phạm Tiến Anh

## Yêu cầu hệ thống

- Node.js >= 18.x
- PostgreSQL
- RabbitMQ
- Elasticsearch
- npm (hoặc yarn)

## Cài đặt

1. **Cài đặt dependencies:**
   ```sh
   npm install
   ```

2. **Khởi động các service phụ trợ**  
   (PostgreSQL, RabbitMQ, Elasticsearch, Redis)  
   ```sh
   docker compose up -d
   ```

## Khởi tạo database & seed dữ liệu

Chạy các lệnh sau để tạo bảng, seed dữ liệu và đồng bộ dữ liệu async:

```sh
npx prisma generate
npx prisma migrate reset --force
npm run seed
npm run async-data
```

## Chạy server ở môi trường phát triển

```sh
npm run dev
```

Server sẽ chạy ở cổng mặc định (ví dụ: `http://localhost:4000`).

## Các endpoint chính

- `GET /products` — Lấy danh sách sản phẩm (có phân trang)
- `GET /products/search` — Tìm kiếm sản phẩm theo query

## Ghi chú

- Đảm bảo các service phụ trợ đã chạy trước khi khởi động server.
- Nếu gặp lỗi kết nối, kiểm tra lại cấu hình `.env`.

---