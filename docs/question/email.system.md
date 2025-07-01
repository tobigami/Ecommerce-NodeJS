# Hệ Thống Gửi Email Theo Lịch Trình

## Thiết Kế Cơ Sở Dữ Liệu

### Bảng `scheduled_emails`

| Cột          | Kiểu Dữ Liệu | Mô Tả                                   |
| ------------ | ------------ | --------------------------------------- |
| id           | INT          | Khóa chính, tự động tăng                |
| from_email   | VARCHAR(255) | Email người gửi                         |
| to_email     | VARCHAR(255) | Email người nhận                        |
| subject      | VARCHAR(255) | Tiêu đề email                           |
| body         | TEXT         | Nội dung email (plain text)             |
| html_body    | TEXT         | Nội dung email (định dạng HTML)         |
| scheduled_at | DATETIME     | Thời gian dự kiến gửi email             |
| status       | ENUM         | Trạng thái: 'pending', 'sent', 'failed' |
| retry_count  | INT          | Số lần thử gửi lại                      |
| max_retries  | INT          | Số lần thử gửi lại tối đa               |
| cc           | VARCHAR(255) | Email CC (carbon copy)                  |
| bcc          | VARCHAR(255) | Email BCC (blind carbon copy)           |
| attachments  | JSON         | Tệp đính kèm (định dạng JSON)           |
| created_at   | TIMESTAMP    | Thời gian tạo bản ghi                   |
| updated_at   | TIMESTAMP    | Thời gian cập nhật bản ghi              |

## Ý Tưởng Triển Khai

### 1. Sử Dụng Cron Job (Đơn Giản)

- Tạo một cron job (ví dụ: node-cron) chạy mỗi phút hoặc mỗi 5 phút.
- Cron job sẽ truy vấn các bản ghi có `scheduled_at <= NOW()` và `status = 'pending'`.
- Gửi email qua service (ví dụ: nodemailer).
- Cập nhật trạng thái bản ghi thành 'sent' hoặc 'failed' nếu gửi lỗi.
- Có thể tăng số lần retry nếu gửi lỗi, và dừng khi vượt quá `max_retries`.
- Phù hợp với hệ thống nhỏ, số lượng email không quá lớn.

### 2. Sử Dụng Queue (Khuyến Nghị Cho Hệ Thống Lớn)

- Khi tạo bản ghi email mới, thêm vào hàng đợi (queue) như Bull (Redis).
- Đặt delay cho job dựa trên thời gian `scheduled_at`.
- Worker sẽ tự động lấy job đúng thời điểm và gửi email.
- Hỗ trợ retry, phân tán tải, mở rộng dễ dàng.
- Giảm tải cho database, không cần truy vấn liên tục.

### 3. Lưu Ý Hiệu Năng

- Cron job mỗi phút không ảnh hưởng nhiều nếu số lượng bản ghi nhỏ và truy vấn tối ưu (có index cho trường `scheduled_at`, `status`).
- Nếu số lượng lớn, nên chuyển sang queue để tối ưu hiệu năng và khả năng mở rộng.

### 4. Ví Dụ Code (Node.js + Sequelize hoặc Mongoose)

- Đảm bảo chọn một công nghệ nhất quán giữa database và ORM/ODM.
- Tham khảo các ví dụ code ở trên để triển khai với Sequelize (MySQL/PostgreSQL) hoặc Mongoose (MongoDB).

### 5. Tổng Kết

- Hệ thống nhỏ: Cron job đơn giản là đủ.
- Hệ thống lớn: Nên dùng queue để đảm bảo hiệu năng và độ tin cậy.
- Luôn index các trường truy vấn nhiều như `scheduled_at`, `status`.
