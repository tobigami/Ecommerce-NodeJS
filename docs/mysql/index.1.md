# Tối ưu hóa truy vấn MySQL với Index

Tài liệu này giải thích các khái niệm cơ bản và nâng cao về chỉ mục (Index) trong MySQL, giúp bạn hiểu rõ cách chúng hoạt động và làm thế nào để sử dụng chúng một cách hiệu quả nhằm tăng tốc độ truy vấn cơ sở dữ liệu.

**Video tham khảo:**

- [MySQL Index | Tối ưu hoá câu lệnh truy vấn cho người mới bắt đầu](https://www.youtube.com/watch?v=UYmCFPVx-XY&t=9s)
- [MySQL Indexing: How to Choose the Best Index?](https://www.youtube.com/watch?v=XPtlC1YeRwU)

---

## I. Index là gì?

Tưởng tượng Index giống như mục lục ở cuối một cuốn sách. Thay vì phải lật từng trang để tìm một chủ đề, bạn chỉ cần nhìn vào mục lục, tìm chủ đề đó và đi thẳng đến số trang tương ứng.

Trong MySQL, Index là một cấu trúc dữ liệu đặc biệt giúp tăng tốc độ các hoạt động truy xuất dữ liệu trên một bảng. Khi bạn thực hiện một câu lệnh `SELECT` với điều kiện `WHERE`, MySQL có thể sử dụng Index để nhanh chóng xác định vị trí của các hàng dữ liệu thỏa mãn điều kiện mà không cần phải quét toàn bộ bảng (Full Table Scan).

---

## II. Các loại Index phổ biến trong MySQL

Dưới đây là các loại chỉ mục chính được sử dụng trong MySQL. Chúng ta sẽ sử dụng bảng `students` sau đây làm ví dụ:

```sql
CREATE TABLE students (
    id INT AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    bio TEXT,
    location GEOMETRY, -- Ví dụ cho Spatial Index
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 1. Primary Key Index (Chỉ mục Khóa chính)

Đây là chỉ mục quan trọng nhất, được tự động tạo khi bạn định nghĩa một `PRIMARY KEY` cho bảng.

- **Đặc điểm:**
  - **Duy nhất:** Mỗi giá trị trong cột khóa chính phải là duy nhất.
  - **Không NULL:** Không được phép chứa giá trị `NULL`.
  - **Một và chỉ một:** Mỗi bảng chỉ có thể có một khóa chính.
- **Mục đích:** Dùng để định danh duy nhất cho mỗi hàng trong bảng.
- **Ví dụ:** Cột `id` trong bảng `students` đã tự động trở thành Primary Key Index.

### 2. Normal Index (Chỉ mục Thông thường)

Còn được gọi là `Single-Column Index`, đây là loại chỉ mục cơ bản nhất.

- **Đặc điểm:** Không có ràng buộc đặc biệt nào. Giá trị có thể trùng lặp và có thể là `NULL`.
- **Mục đích:** Chỉ đơn giản là để tăng tốc độ truy vấn trên một cột cụ thể.
- **Cú pháp:**
  ```sql
  -- Tạo index trên cột username để tăng tốc tìm kiếm theo username
  CREATE INDEX idx_username ON students(username);
  ```

### 3. Unique Index (Chỉ mục Duy nhất)

Tương tự như Normal Index nhưng yêu cầu tất cả các giá trị trong cột phải khác nhau.

- **Đặc điểm:**
  - **Duy nhất:** Đảm bảo không có giá trị nào bị trùng lặp.
  - **Cho phép NULL:** Thường thì bạn có thể có nhiều giá trị `NULL` (tùy thuộc vào phiên bản MySQL và Storage Engine).
- **Mục đích:** Vừa tăng tốc truy vấn, vừa đảm bảo tính toàn vẹn dữ liệu.
- **Cú pháp:**
  ```sql
  -- Đảm bảo mỗi email là duy nhất trong bảng
  CREATE UNIQUE INDEX idx_email ON students(email);
  ```

### 4. Composite Index (Chỉ mục Kết hợp)

Là chỉ mục được tạo trên nhiều cột cùng một lúc (tối đa 16 cột).

- **Đặc điểm:** Thứ tự các cột trong chỉ mục rất quan trọng. Nó tuân theo **nguyên tắc tiền tố ngoài cùng bên trái (left-most prefix)**.
- **Mục đích:** Tăng tốc các truy vấn lọc trên nhiều cột cùng lúc.
- **Cú pháp:**
  ```sql
  -- Tối ưu cho các truy vấn tìm kiếm theo cả username và email
  CREATE INDEX idx_username_email ON students(username, email);
  ```

### 5. Full-Text Index (Chỉ mục Toàn văn)

Được sử dụng cho các tác vụ tìm kiếm phức tạp trên các cột văn bản (`TEXT`, `VARCHAR`).

- **Đặc điểm:** Cho phép tìm kiếm từ hoặc cụm từ trong nội dung văn bản một cách tự nhiên, thay vì so khớp chính xác.
- **Mục đích:** Phục vụ các tính năng tìm kiếm giống như Google Search.
- **Cú pháp:**
  ```sql
  -- Tạo index để tìm kiếm nội dung trong cột "bio"
  CREATE FULLTEXT INDEX idx_fulltext_bio ON students(bio);
  ```

### 6. Spatial Index (Chỉ mục Không gian) - (Nâng cao)

Dành cho các cột chứa dữ liệu không gian/địa lý (`GEOMETRY`, `POINT`, `POLYGON`).

- **Mục đích:** Tối ưu hóa các truy vấn về vị trí, ví dụ: "tìm tất cả các địa điểm trong vòng bán kính 5km".
- **Cú pháp:**
  ```sql
  CREATE SPATIAL INDEX idx_spatial_location ON students(location);
  ```

### 7. Descending Index (Chỉ mục Giảm dần) - (MySQL 8.0+)

Cho phép chỉ định thứ tự sắp xếp (giảm dần `DESC`) cho cột trong chỉ mục.

- **Mục đích:** Tăng tốc các truy vấn có mệnh đề `ORDER BY ... DESC` bằng cách loại bỏ bước sắp xếp (filesort).
- **Cú pháp:**
  ```sql
  -- Tối ưu cho việc lấy sinh viên mới nhất
  CREATE INDEX idx_created_at_desc ON students(created_at DESC);
  ```

---

## III. So sánh Primary Key và Normal Index

| Tiêu chí             | Primary Key Index                                                 | Normal Index                                                  |
| :------------------- | :---------------------------------------------------------------- | :------------------------------------------------------------ |
| **Tính duy nhất**    | **Bắt buộc** duy nhất                                             | **Không bắt buộc**                                            |
| **Giá trị NULL**     | **Không cho phép** `NULL`                                         | **Cho phép** `NULL`                                           |
| **Số lượng / Bảng**  | Chỉ **một**                                                       | Có thể có **nhiều**                                           |
| **Vai trò chính**    | **Định danh** hàng                                                | **Tăng tốc** truy vấn                                         |
| **Lưu trữ (InnoDB)** | Là **Clustered Index** (Dữ liệu bảng được sắp xếp vật lý theo nó) | Là **Secondary Index** (Chứa con trỏ trỏ đến Clustered Index) |

---

## IV. Nguyên tắc "Left-Most Prefix" (Tiền tố ngoài cùng bên trái)

Đây là nguyên tắc quan trọng nhất khi làm việc với **Composite Index**.

- **Nội dung:** Một truy vấn chỉ có thể sử dụng Composite Index nếu nó sử dụng ít nhất **cột đầu tiên** (cột ngoài cùng bên trái) của chỉ mục đó trong mệnh đề `WHERE`.

- **Ví dụ:** Với chỉ mục `idx_username_email(username, email)`:

  - `WHERE username = '...'` -> **Có** sử dụng index.
  - `WHERE username = '...' AND email = '...'` -> **Có** sử dụng index.
  - `WHERE email = '...'` -> **Không** sử dụng index (vì bỏ qua cột `username` ở đầu).

- **Mẹo chọn thứ tự cột:** Khi tạo Composite Index, hãy đặt cột có **độ chọn lọc cao nhất** (ít giá trị trùng lặp nhất) ra ngoài cùng bên trái. Ví dụ, `email` thường có độ chọn lọc cao hơn `username`. Vì vậy, `INDEX(email, username)` có thể sẽ tốt hơn.

---

**Ví dụ về left-most prefix**

```sql
create table test
(
    id int auto_increment primary key,
    a  int,
    b  int,
    c  int,
    index idx_abc (a, b, c)
);

show index from test;

explain select * from test where a = 1; -- OK

explain select * from test where a = 1 and b = 2; -- OK

explain select * from test where b = 4 and a = 2; -- OK

explain select * from test where b = 1 and c = 18; -- NOT

explain select * from test where a = 1 and c = 18; -- NOT case này chỉ sử dụng chỉ mục của a
```

---

**Cách để tính toán lựa chọn xem col nào sẽ được đặt lên trước **

```sql
select count(distinct user_id)/ count(1) as o, count(distinct user_password)/ count(1) as s from users;
```

**Giải thích câu lệnh:**

Câu lệnh trên giúp bạn tính toán **tỷ lệ duy nhất (độ chọn lọc)** của mỗi cột. Nguyên tắc là: **cột nào có độ chọn lọc cao hơn (tức là có nhiều giá trị khác nhau hơn) thì nên được đặt ở vị trí đầu tiên** trong chỉ mục kết hợp.

1.  `COUNT(DISTINCT ten_cot)`: Đếm số lượng giá trị **duy nhất** trong cột đó.
2.  `COUNT(1)`: Đếm **tổng số hàng** của bảng.
3.  `Tỷ lệ = COUNT(DISTINCT ten_cot) / COUNT(1)`:
    - **Tỷ lệ càng gần 1**: Cột có tính duy nhất cao (ví dụ: cột `email`, `cmnd`). Đây là ứng cử viên tốt nhất cho vị trí đầu tiên trong index.
    - **Tỷ lệ càng gần 0**: Cột có nhiều giá trị trùng lặp (ví dụ: cột `gioi_tinh`, `trang_thai`). Cột này nên được xếp sau.

**Cách áp dụng:**

Sau khi chạy câu lệnh, bạn hãy so sánh kết quả của `o` và `s`. Giá trị nào lớn hơn thì cột tương ứng nên được đặt trước trong `CREATE INDEX`. Việc này giúp MySQL thu hẹp phạm vi tìm kiếm một cách hiệu quả nhất ngay từ bước đầu tiên, từ đó tăng tốc độ truy vấn đáng kể.
