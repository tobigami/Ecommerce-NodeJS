**RULE 1: TRACKING FIELDS**

```text
Rule 1: Luôn bổ sung các trường theo dõi (tracking fields) khi thiết kế bảng dữ liệu.

Khi thiết kế bảng dữ liệu, nên luôn bổ sung các trường sau để theo dõi lịch sử và phiên bản của dữ liệu:
- version: Phiên bản của bản ghi, hỗ trợ kiểm soát phiên bản và xử lý xung đột
- creator_id: ID của người tạo bản ghi, giúp truy vết nguồn gốc (optional)
- modifier_id: ID của người chỉnh sửa bản ghi gần nhất
- created_at: Thời điểm bản ghi được tạo
- updated_at: Thời điểm bản ghi được cập nhật gần nhất

Các trường này giúp đảm bảo tính minh bạch, kiểm soát và truy vết dữ liệu trong ứng dụng, đặc biệt quan trọng trong hệ thống thương mại điện tử.
```

**BAD**

```sql
CREATE TABLE feeds (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL
);
```

**GOOD**

```sql
CREATE TABLE feeds (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    version INT UNSIGNED NOT NULL DEFAULT 1,
    creator_id INT UNSIGNED,
    modifier_id INT UNSIGNED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

**RULE 2: COLUMN DOCUMENTATION**

```text
Rule 2: Luôn thêm COMMENT cho mỗi cột trong định nghĩa bảng dữ liệu.

Khi tạo các bảng dữ liệu, nên luôn bổ sung COMMENT cho mỗi cột để:
- Giải thích mục đích và ý nghĩa của từng cột
- Cung cấp thông tin về mối quan hệ với các bảng khác
- Tài liệu hóa ngay trong cấu trúc cơ sở dữ liệu
- Giúp các thành viên mới trong dự án dễ dàng hiểu được cấu trúc dữ liệu

Việc sử dụng COMMENT trong định nghĩa bảng rất hữu ích khi sử dụng lệnh SHOW FULL COLUMNS để xem thông tin chi tiết về các cột trong bảng.
```

**BAD**

```sql
CREATE TABLE feeds (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    version INT UNSIGNED NOT NULL DEFAULT 1,
    creator_id INT UNSIGNED,
    modifier_id INT UNSIGNED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**GOOD**

```sql
CREATE TABLE feeds
(
    id          INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Article Id',
    status      TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'active: 1, inactive: 0',
    title       VARCHAR(255)     NOT NULL COMMENT 'Article Title',
    content     TEXT             NOT NULL COMMENT 'Article Content',
    version     INT UNSIGNED     NOT NULL DEFAULT 1 COMMENT 'Optimistic key version',
    creator_id  INT UNSIGNED COMMENT 'Creator Id (users table reference)',
    modifier_id INT UNSIGNED COMMENT 'Last modifier Id',
    created_at  TIMESTAMP                 DEFAULT CURRENT_TIMESTAMP COMMENT 'Creation time',
    updated_at  TIMESTAMP                 DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update time'
);
```

```sql
SHOW FULL COLUMNS FROM feeds;
```

---

**RULE 3: SOFT DELETE**

```text
Rule 3: Sử dụng cơ chế Soft Delete thay vì xóa dữ liệu vĩnh viễn.

Khi thiết kế cơ sở dữ liệu, nên luôn áp dụng cơ chế Soft Delete bằng cách:
- Thêm trường delete_at để ghi lại thời điểm bản ghi bị đánh dấu là đã xóa

Lợi ích của Soft Delete:
- Bảo toàn dữ liệu lịch sử, không làm mất dữ liệu vĩnh viễn
- Có thể khôi phục dữ liệu khi cần
- Dễ dàng theo dõi và kiểm tra quá trình xóa dữ liệu
- Cải thiện tính toàn vẹn của dữ liệu, đặc biệt khi có các mối quan hệ với các bảng khác
- Hỗ trợ kiểm toán và tuân thủ các quy định về dữ liệu

Tất cả các truy vấn SELECT cần bổ sung điều kiện WHERE delete_at IS NULL để không lấy dữ liệu đã bị "xóa".
```

**BAD**

```sql
-- Thiết kế bảng không hỗ trợ soft delete
CREATE TABLE feeds (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Article Id',
    title VARCHAR(255) NOT NULL COMMENT 'Article Title',
    content TEXT NOT NULL COMMENT 'Article Content'
);

-- Khi xóa bản ghi, dữ liệu sẽ bị mất vĩnh viễn
DELETE FROM feeds WHERE id = 1;
```

**GOOD**

```sql
-- Thiết kế bảng có hỗ trợ soft delete
CREATE TABLE feeds
(
    id          INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Article Id',
    status      TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'active: 1, inactive: 0',
    title       VARCHAR(255)     NOT NULL COMMENT 'Article Title',
    content     TEXT             NOT NULL COMMENT 'Article Content',
    delete_at   TIMESTAMP        NULL     DEFAULT NULL COMMENT 'Deletion time',
    version     INT UNSIGNED     NOT NULL DEFAULT 1 COMMENT 'Optimistic key version',
    creator_id  INT UNSIGNED COMMENT 'Creator Id (users table reference)',
    modifier_id INT UNSIGNED COMMENT 'Last modifier Id',
    created_at  TIMESTAMP                 DEFAULT CURRENT_TIMESTAMP COMMENT 'Creation time',
    updated_at  TIMESTAMP                 DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update time'
);

-- Xóa mềm bằng cách cập nhật trạng thái và thời gian xóa
UPDATE feeds SET status = 0, delete_at = CURRENT_TIMESTAMP WHERE id = 1;

-- Truy vấn chỉ lấy các bản ghi chưa bị xóa
SELECT * FROM feeds WHERE delete_at IS NULL;

-- Khôi phục dữ liệu khi cần
UPDATE feeds SET delete_at = NULL WHERE id = 1;
```

---

**RULE 4: PREFIX NAMING**

```text
Rule 4: Sử dụng tiền tố tên bảng cho tên cột để tăng tính rõ ràng và tránh xung đột.

Khi thiết kế cơ sở dữ liệu, nên đặt tên cột với tiền tố là tên bảng để:
- Tránh xung đột tên cột khi join nhiều bảng trong các truy vấn phức tạp
- Cải thiện tính rõ ràng trong mã nguồn, giúp dễ dàng xác định cột thuộc bảng nào
- Dễ dàng trong việc tạo và đọc các truy vấn phức tạp
- Tạo tên cột có khả năng tự tài liệu hóa về nguồn gốc
- Duy trì tính nhất quán trong thiết kế cơ sở dữ liệu

Quy ước này đặc biệt hữu ích trong các ứng dụng lớn và phức tạp như hệ thống thương mại điện tử.
```

**BAD**

```sql
CREATE TABLE feeds (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Article Id',
    status TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'active: 1, inactive: 0',
    title VARCHAR(255) NOT NULL COMMENT 'Article Title',
    content TEXT NOT NULL COMMENT 'Article Content'
);

CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    content TEXT NOT NULL,
    user_id INT NOT NULL
);

-- Khi JOIN hai bảng, các tên cột trùng lặp gây khó khăn và nhầm lẫn
SELECT id, content FROM feeds JOIN comments USING(id);
```

**GOOD**

```sql
CREATE TABLE feeds
(
    feed_id          INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Article Id',
    feed_status      TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'active: 1, inactive: 0',
    feed_title       VARCHAR(255)     NOT NULL COMMENT 'Article Title',
    feed_content     TEXT             NOT NULL COMMENT 'Article Content',
    feed_delete_at   TIMESTAMP        NULL     DEFAULT NULL COMMENT 'Deletion time',
    feed_version     INT UNSIGNED     NOT NULL DEFAULT 1 COMMENT 'Optimistic key version',
    feed_creator_id  INT UNSIGNED COMMENT 'Creator Id (users table reference)',
    feed_modifier_id INT UNSIGNED COMMENT 'Last modifier Id',
    feed_created_at  TIMESTAMP                 DEFAULT CURRENT_TIMESTAMP COMMENT 'Creation time',
    feed_updated_at  TIMESTAMP                 DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update time'
);

CREATE TABLE comments
(
    comment_id       INT AUTO_INCREMENT PRIMARY KEY,
    comment_content  TEXT NOT NULL,
    comment_user_id  INT NOT NULL,
    comment_feed_id  INT NOT NULL
);

-- Khi JOIN hai bảng, các tên cột rõ ràng, không gây nhầm lẫn
SELECT feed_id, feed_content, comment_content
FROM feeds JOIN comments ON feed_id = comment_feed_id;
```

---

**RULE 5: TABLE SPLITTING**

```text
Rule 5: Tách bảng khi số lượng cột vượt quá 20 dựa trên tần suất truy cập và mức độ quan trọng.

Khi thiết kế cơ sở dữ liệu, nên hạn chế số lượng cột trong một bảng theo nguyên tắc:
- Một bảng không nên có quá 20 cột để đảm bảo hiệu suất và khả năng bảo trì
- Khi bảng vượt quá 20 cột, nên phân tích và tách thành các bảng nhỏ hơn
- Tách dựa trên tần suất truy cập: các cột thường xuyên được truy vấn nên giữ lại trong bảng chính
- Tách dựa trên mức độ quan trọng: các cột ít quan trọng hơn hoặc có dữ liệu lớn nên tách ra bảng riêng
- Sử dụng mối quan hệ 1-1 giữa bảng chính và bảng chi tiết

Lợi ích của việc tách bảng:
- Cải thiện hiệu suất truy vấn khi chỉ cần lấy thông tin cơ bản
- Tối ưu hóa bộ nhớ đệm và không gian lưu trữ
- Giảm thời gian thực thi các thao tác INSERT/UPDATE trên các bảng nhỏ hơn
- Tăng tính mô-đun và dễ duy trì của cấu trúc dữ liệu
- Linh hoạt trong việc mở rộng và phát triển ứng dụng
```

**BAD**

```sql
-- Bảng duy nhất có quá nhiều cột (>20)
CREATE TABLE feeds
(
    feed_id                 INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Article Id',
    feed_status             TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'active: 1, inactive: 0',
    feed_title              VARCHAR(255) NOT NULL COMMENT 'Article Title',
    feed_content            TEXT NOT NULL COMMENT 'Article Content',
    feed_description        TEXT COMMENT 'Feed Description',
    feed_thumbnail          VARCHAR(500) DEFAULT NULL COMMENT 'Feed Thumbnail',
    feed_tags               JSON DEFAULT NULL COMMENT 'Feed Tags',
    feed_category_id        INT UNSIGNED COMMENT 'Category Id',
    feed_author_name        VARCHAR(100) COMMENT 'Author Name',
    feed_author_bio         TEXT COMMENT 'Author Biography',
    feed_publish_date       DATETIME COMMENT 'Publish Date',
    feed_read_time          INT COMMENT 'Estimated read time in minutes',
    feed_view_count         INT UNSIGNED DEFAULT 0 COMMENT 'View Count',
    feed_like_count         INT UNSIGNED DEFAULT 0 COMMENT 'Like Count',
    feed_share_count        INT UNSIGNED DEFAULT 0 COMMENT 'Share Count',
    feed_comment_count      INT UNSIGNED DEFAULT 0 COMMENT 'Comment Count',
    feed_seo_title          VARCHAR(255) COMMENT 'SEO Title',
    feed_seo_description    VARCHAR(500) COMMENT 'SEO Description',
    feed_seo_keywords       VARCHAR(255) COMMENT 'SEO Keywords',
    feed_related_articles   JSON COMMENT 'Related Articles',
    feed_delete_at          TIMESTAMP NULL DEFAULT NULL COMMENT 'Deletion time',
    feed_version            INT UNSIGNED NOT NULL DEFAULT 1 COMMENT 'Optimistic key version',
    feed_creator_id         INT UNSIGNED COMMENT 'Creator Id',
    feed_modifier_id        INT UNSIGNED COMMENT 'Last modifier Id',
    feed_created_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Creation time',
    feed_updated_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update time'
) COMMENT = 'Table for storing all feed information';

-- Truy vấn đơn giản cũng phải lấy tất cả các cột, nhiều cột không cần thiết
SELECT * FROM feeds WHERE feed_id = 1;
```

**GOOD**

```sql
-- Bảng chính chỉ chứa thông tin cơ bản, thường xuyên truy cập
CREATE TABLE feeds
(
    feed_id          INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Article Id',
    feed_status      TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'active: 1, inactive: 0',
    feed_title       VARCHAR(255)     NOT NULL COMMENT 'Article Title',
    feed_delete_at   TIMESTAMP        NULL     DEFAULT NULL COMMENT 'Deletion time',
    feed_version     INT UNSIGNED     NOT NULL DEFAULT 1 COMMENT 'Optimistic key version',
    feed_creator_id  INT UNSIGNED COMMENT 'Creator Id (users table reference)',
    feed_modifier_id INT UNSIGNED COMMENT 'Last modifier Id',
    feed_created_at  TIMESTAMP                 DEFAULT CURRENT_TIMESTAMP COMMENT 'Creation time',
    feed_updated_at  TIMESTAMP                 DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update time'
) ENGINE = InnoDB
  DEFAULT CHARACTER SET = utf8mb4
  COLLATE = utf8mb4_unicode_ci COMMENT = 'Main table of feeds';


-- Bảng chi tiết chứa thông tin ít được truy cập hoặc dữ liệu lớn
CREATE TABLE feed_detail
(
    feed_detail_it         INT UNSIGNED PRIMARY KEY AUTO_INCREMENT COMMENT 'Feed Detail Id',
    feed_id                INT UNSIGNED NOT NULL COMMENT 'Feed Id (feeds table reference)',
    feed_detail_des        TEXT COMMENT 'Feed Detail Description',
    feed_detail_thumbnail  VARCHAR(500) DEFAULT NULL COMMENT 'Feed Detail Thumbnail',
    feed_tags              JSON         DEFAULT NULL COMMENT 'Feed Tags',
    feed_detail_created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP COMMENT 'Creation time',
    feed_detail_updated_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update time'
) ENGINE = InnoDB
  DEFAULT CHARACTER SET = utf8mb4
  COLLATE = utf8mb4_unicode_ci COMMENT = 'Feed detail table';

-- Truy vấn hiệu quả, chỉ lấy thông tin cần thiết
SELECT f.feed_id,
       f.feed_status,
       f.feed_title
FROM feeds AS f
WHERE f.feed_id = 1;

-- Khi cần thông tin chi tiết, mới JOIN với bảng chi tiết
SELECT f.feed_id,
       f.feed_title,
       d.feed_detail_des,
       d.feed_detail_thumbnail
FROM feeds AS f
JOIN feed_detail AS d ON f.feed_id = d.feed_id
WHERE f.feed_id = 1;
```

---

**RULE 6: OPTIMAL DATA TYPES**

```text
Rule 6: Lựa chọn kiểu dữ liệu phù hợp và tối ưu cho từng cột trong bảng dữ liệu.

Khi thiết kế cơ sở dữ liệu, cần lựa chọn kiểu dữ liệu phù hợp và tối ưu cho từng cột để:
- Tiết kiệm không gian lưu trữ
- Cải thiện hiệu suất cơ sở dữ liệu (đọc/ghi/tìm kiếm nhanh hơn)
- Tăng số lượng hàng trong một trang dữ liệu, giảm I/O
- Giảm lưu lượng mạng khi truyền dữ liệu
- Đảm bảo tính chính xác của dữ liệu

Các nguyên tắc khi lựa chọn kiểu dữ liệu:
1. Sử dụng kiểu số nhỏ nhất có thể (TINYINT thay vì INT khi phù hợp)
2. Chỉ định độ dài VARCHAR chính xác (VARCHAR(100) thay vì mặc định VARCHAR(255))
3. Sử dụng CHAR thay vì VARCHAR cho chuỗi có độ dài cố định
4. Cân nhắc giữa TEXT và VARCHAR cho dữ liệu văn bản dài
5. Sử dụng kiểu TIMESTAMP thay vì DATETIME khi có thể để tiết kiệm không gian
6. Chỉ sử dụng DECIMAL khi thực sự cần độ chính xác cao cho số thập phân
7. Sử dụng ENUM hoặc TINYINT thay vì VARCHAR cho các cột có giá trị có giới hạn
```

**BAD**

```sql
CREATE TABLE products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'Product Id', -- Quá lớn cho hầu hết các ứng dụng
    status VARCHAR(10) COMMENT 'Status (active/inactive)', -- Sử dụng VARCHAR cho giá trị enum
    title VARCHAR(255) NOT NULL COMMENT 'Product Title', -- Độ dài mặc định không cần thiết
    price DECIMAL(20,6) COMMENT 'Product Price', -- Độ chính xác quá cao không cần thiết
    description TEXT COMMENT 'Product Description',
    code CHAR(50) COMMENT 'Product Code', -- CHAR quá lớn cho mã sản phẩm có độ dài thay đổi
    created_date DATETIME COMMENT 'Creation date', -- Sử dụng DATETIME thay vì TIMESTAMP
    is_available INTEGER COMMENT 'Available flag (0/1)', -- Sử dụng INTEGER cho giá trị boolean
    view_count BIGINT COMMENT 'View Count', -- Quá lớn cho số lượt xem
    user_id VARCHAR(36) COMMENT 'User Id (FK)', -- Sử dụng VARCHAR cho ID
    metadata TEXT COMMENT 'Additional metadata' -- Không cấu trúc
);

-- Lãng phí không gian và giảm hiệu suất truy vấn
```

**GOOD**

```sql
CREATE TABLE feeds
(
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'Article Id', -- INT đủ cho hầu hết các ứng dụng
    status      TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'active: 1, inactive: 0', -- TINYINT thay vì VARCHAR
    title       VARCHAR(100)     NOT NULL COMMENT 'Article Title', -- Giới hạn độ dài phù hợp
    content     TEXT             NOT NULL COMMENT 'Article Content', -- TEXT cho nội dung dài
    version     INT UNSIGNED     NOT NULL DEFAULT 1 COMMENT 'Optimistic key version',
    creator_id  INT UNSIGNED COMMENT 'Creator Id (users table reference)', -- INT UNSIGNED thay vì VARCHAR
    modifier_id INT UNSIGNED COMMENT 'Last modifier Id',
    created_at  TIMESTAMP                 DEFAULT CURRENT_TIMESTAMP COMMENT 'Creation time', -- TIMESTAMP thay vì DATETIME
    updated_at  TIMESTAMP                 DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update time'
);

-- Ví dụ cho các trường hợp đặc biệt
CREATE TABLE product_details
(
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id      INT UNSIGNED NOT NULL,
    sku             CHAR(12) NOT NULL COMMENT 'Fixed length product code', -- CHAR cho chuỗi có độ dài cố định
    price           DECIMAL(10,2) NOT NULL COMMENT 'Product Price', -- Độ chính xác hợp lý
    tax_rate        DECIMAL(5,2) DEFAULT 10.00 COMMENT 'Tax rate in percentage',
    status          ENUM('active', 'inactive', 'out_of_stock') DEFAULT 'active' COMMENT 'Product status', -- ENUM cho giá trị có giới hạn
    is_featured     TINYINT(1) DEFAULT 0 COMMENT 'Featured flag (0/1)', -- TINYINT(1) cho boolean
    country_code    CHAR(2) COMMENT 'ISO country code', -- CHAR(2) đủ cho mã quốc gia
    metadata        JSON COMMENT 'Additional metadata in structured format' -- JSON thay vì TEXT cho dữ liệu có cấu trúc
);
```

```sql
-- Truy vấn hiệu quả, cải thiện hiệu suất IO và tối ưu bộ nhớ đệm
SELECT id, title, status FROM feeds WHERE id = 1;

-- Tìm kiếm nhanh hơn với kiểu dữ liệu phù hợp
SELECT id, title FROM feeds WHERE status = 1 LIMIT 10;
```

---

**RULE 7: NOT NULL CONSTRAINTS**

```text
Rule 7: Sử dụng NOT NULL và giá trị DEFAULT khi thiết kế cột trong bảng dữ liệu.

Khi thiết kế cơ sở dữ liệu, nên ưu tiên sử dụng ràng buộc NOT NULL kết hợp với giá trị DEFAULT khi có thể để:
- Đảm bảo tính toàn vẹn dữ liệu, tránh các lỗi do giá trị NULL
- Cải thiện hiệu suất cơ sở dữ liệu khi truy vấn và tìm kiếm
- Loại bỏ nhu cầu xử lý NULL trong mã nguồn ứng dụng
- Đơn giản hóa các truy vấn, không cần kiểm tra NULL
- Tăng độ tin cậy của các chỉ mục (index)

Các nguyên tắc khi sử dụng NOT NULL và DEFAULT:
1. Đặt NOT NULL cho tất cả các cột khi có thể
2. Luôn cung cấp giá trị DEFAULT có ý nghĩa cho các cột NOT NULL
3. Chỉ cho phép NULL khi thực sự cần thiết (ví dụ: trường tùy chọn không có giá trị mặc định hợp lý)
4. Đặc biệt quan trọng với các cột được sử dụng trong điều kiện JOIN và WHERE
5. Xem xét cẩn thận tác động của NULL đối với các hàm tổng hợp (SUM, AVG, COUNT)
```

**BAD**

```sql
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100), -- Thiếu NOT NULL, title không nên là NULL
    price DECIMAL(10,2), -- Thiếu NOT NULL, sản phẩm luôn cần có giá
    description TEXT, -- Có thể NULL, nhưng không có chỉ định rõ ràng
    status VARCHAR(10), -- Không có giá trị mặc định và có thể NULL
    stock_quantity INT, -- Không có giá trị mặc định, có thể dẫn đến giá trị NULL
    created_at TIMESTAMP, -- Không có giá trị mặc định
    updated_at TIMESTAMP -- Không có giá trị mặc định
);

-- Truy vấn phải xử lý NULL trong điều kiện
SELECT * FROM products WHERE price IS NOT NULL AND title IS NOT NULL;

-- Khi chèn dữ liệu, có thể vô tình chèn NULL
INSERT INTO products (id, title) VALUES (1, 'Product A');
-- Kết quả: price, status, stock_quantity đều là NULL
```

**GOOD**

```sql
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL, -- Bắt buộc phải có title
    price DECIMAL(10,2) NOT NULL DEFAULT 0.00, -- Bắt buộc phải có price, mặc định là 0
    description TEXT NULL, -- Chỉ định rõ ràng là có thể NULL
    status VARCHAR(10) NOT NULL DEFAULT 'inactive', -- Có giá trị mặc định có ý nghĩa
    stock_quantity INT NOT NULL DEFAULT 0, -- Mặc định là 0 khi không cung cấp
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Tự động sử dụng thời điểm hiện tại
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Tự động cập nhật
);

-- Truy vấn đơn giản, không cần xử lý NULL
SELECT * FROM products WHERE price > 0 AND status = 'active';

-- Khi chèn dữ liệu, các giá trị mặc định sẽ được sử dụng
INSERT INTO products (title) VALUES ('Product A');
-- Kết quả: price = 0.00, status = 'inactive', stock_quantity = 0
```

```sql
-- Index hoạt động hiệu quả hơn trên cột NOT NULL
CREATE INDEX idx_products_status ON products(status);

-- Các hàm tổng hợp đáng tin cậy hơn khi không có NULL
SELECT COUNT(id), AVG(price), SUM(stock_quantity) FROM products;
```

---

**RULE 8: STRATEGIC INDEXING**

```text
Rule 8: Sử dụng INDEX hợp lý cho các cột thường xuyên được sử dụng trong truy vấn và có độ chọn lọc cao.

Khi thiết kế cơ sở dữ liệu, việc đánh index cần được cân nhắc kỹ lưỡng dựa trên các tiêu chí:
- Tạo INDEX cho các cột thường xuyên xuất hiện trong mệnh đề WHERE, JOIN, ORDER BY
- Ưu tiên đánh INDEX cho các cột có độ chọn lọc cao (ít giá trị trùng lặp)
- Tạo INDEX kết hợp (composite index) cho các cột thường được sử dụng cùng nhau
- Thứ tự các cột trong INDEX kết hợp phải phù hợp với các điều kiện tìm kiếm
- Đặt tên INDEX theo quy ước rõ ràng (idx_tên_cột)
- Tránh đánh quá nhiều INDEX không cần thiết vì có thể làm chậm thao tác INSERT/UPDATE/DELETE

Các tiêu chí để đánh giá độ thích hợp khi đánh INDEX:
1. Độ chọn lọc cao (High Selectivity): Ưu tiên đánh index cho các cột có ít giá trị trùng lặp
2. Tần suất truy vấn: Index hiệu quả nhất trên các cột thường xuyên được sử dụng trong điều kiện WHERE
3. Kích thước dữ liệu: Index hiệu quả trên các cột nhỏ gọn
4. Loại truy vấn: Phân tích các truy vấn phổ biến để xác định cột cần index
5. Chi phí bảo trì: Cân nhắc tác động của index đến thao tác ghi dữ liệu
```

**BAD**

```sql
-- Không đánh index cho bất kỳ cột nào ngoài khóa chính
CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    order_status TINYINT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP NULL
);

-- Truy vấn chậm vì không có index trên các cột tìm kiếm
SELECT * FROM orders WHERE customer_id = 1000 AND order_status = 1;

-- Hoặc đánh index cho mọi cột mà không cân nhắc (quá nhiều index)
ALTER TABLE products
    ADD INDEX idx_name (name),
    ADD INDEX idx_price (price),
    ADD INDEX idx_created_at (created_at),
    ADD INDEX idx_updated_at (updated_at),
    ADD INDEX idx_status (status), -- status chỉ có vài giá trị, độ chọn lọc thấp
    ADD INDEX idx_category (category_id),
    ADD INDEX idx_name_price (name, price),
    ADD INDEX idx_price_name (price, name); -- Thêm index dư thừa
```

**GOOD**

```sql
CREATE TABLE feeds
(
    feed_id          INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Article Id',
    feed_status      TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'active: 1, inactive: 0',
    feed_title       VARCHAR(255)     NOT NULL COMMENT 'Article Title',
    feed_content     TEXT             NOT NULL COMMENT 'Article Content',
    feed_delete_at   TIMESTAMP        NULL     DEFAULT NULL COMMENT 'Deletion time',
    feed_version     INT UNSIGNED     NOT NULL DEFAULT 1 COMMENT 'Optimistic key version',
    feed_creator_id  INT UNSIGNED COMMENT 'Creator Id (users table reference)',
    feed_modifier_id INT UNSIGNED COMMENT 'Last modifier Id',
    feed_created_at  TIMESTAMP                 DEFAULT CURRENT_TIMESTAMP COMMENT 'Creation time',
    feed_updated_at  TIMESTAMP                 DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update time',
    -- PRIMARY
    PRIMARY KEY (feed_id),
    -- INDEXES
    KEY idx_status_created_at (feed_status, feed_created_at), -- Index kết hợp cho các truy vấn theo status và sắp xếp theo thời gian
    KEY idx_delete_at (feed_delete_at), -- Index cho điều kiện soft delete
    KEY idx_creator_created_at (feed_creator_id, feed_created_at) -- Index cho truy vấn theo người tạo và thời gian
) ENGINE = InnoDB
  DEFAULT CHAR SET = utf8mb4
  collate = utf8mb4_unicode_ci
  comment = 'Feeds Table';

-- Ví dụ về các truy vấn hiệu quả sử dụng index
SELECT * FROM feeds WHERE feed_delete_at IS NULL; -- Sử dụng idx_delete_at

-- Tìm bài viết theo trạng thái và sắp xếp theo thời gian
SELECT * FROM feeds
WHERE feed_status = 1 AND feed_delete_at IS NULL
ORDER BY feed_created_at DESC; -- Sử dụng idx_status_created_at

-- Tìm bài viết theo người tạo
SELECT * FROM feeds
WHERE feed_creator_id = 10
ORDER BY feed_created_at DESC; -- Sử dụng idx_creator_created_at
```

```sql
-- Ví dụ về độ chọn lọc (selectivity) và cách đánh index phù hợp
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    status TINYINT NOT NULL DEFAULT 1, -- active=1, inactive=0 (độ chọn lọc thấp)
    gender CHAR(1), -- 'M', 'F', 'O' (độ chọn lọc thấp)
    country_code CHAR(2), -- Độ chọn lọc trung bình
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY idx_username (username), -- Độ chọn lọc cao, giá trị duy nhất
    UNIQUE KEY idx_email (email), -- Độ chọn lọc cao, giá trị duy nhất
    KEY idx_country_created_at (country_code, created_at) -- index kết hợp, các giá trị có ít trùng lặp đặt trước
);

-- KHÔNG đánh index riêng cho status và gender vì độ chọn lọc thấp
-- Chỉ nên đưa chúng vào composite index nếu cần thiết, nhưng không nên để ở vị trí đầu tiên

-- Bố trí thứ tự các cột trong index kết hợp dựa trên độ chọn lọc
-- Index hiệu quả: độ chọn lọc cao đặt trước
KEY idx_efficient (email, status); -- email có độ chọn lọc cao

-- Index kém hiệu quả: độ chọn lọc thấp đặt trước
KEY idx_inefficient (status, email); -- status có độ chọn lọc thấp
```

---

**RULE 9: THIRD NORMAL FORM**

```text
Rule 9: Thiết kế cơ sở dữ liệu tuân thủ Dạng chuẩn thứ ba (Third Normal Form - 3NF)

Khi thiết kế cơ sở dữ liệu cho ứng dụng thương mại điện tử, cần tuân thủ Dạng chuẩn thứ ba (3NF) để:
- Loại bỏ sự phụ thuộc chuyển tiếp (transitive dependencies) trong dữ liệu
- Giảm thiểu sự dư thừa dữ liệu và tối ưu không gian lưu trữ
- Tăng tính nhất quán và toàn vẹn dữ liệu
- Đơn giản hóa việc cập nhật và bảo trì dữ liệu
- Tối ưu hiệu suất truy vấn cho các ứng dụng phức tạp

Để đạt được Dạng chuẩn thứ ba (3NF), cần đảm bảo các điều kiện:
1. Đã đạt Dạng chuẩn thứ hai (2NF): không tồn tại phụ thuộc một phần vào khóa chính
2. Không tồn tại phụ thuộc chuyển tiếp: các thuộc tính không khóa phải phụ thuộc trực tiếp vào khóa chính, không thông qua thuộc tính trung gian

Quá trình chuẩn hóa dữ liệu đến 3NF giúp cấu trúc dữ liệu trở nên mạch lạc, dễ hiểu và dễ mở rộng, đặc biệt quan trọng trong các hệ thống thương mại điện tử phức tạp với nhiều mối quan hệ dữ liệu.
```

**BAD**

```sql
-- Bảng chứa phụ thuộc chuyển tiếp, vi phạm 3NF
CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    customer_name VARCHAR(100) NOT NULL, -- Phụ thuộc vào customer_id, không phải order_id
    customer_email VARCHAR(100) NOT NULL, -- Phụ thuộc vào customer_id, không phải order_id
    customer_phone VARCHAR(20) NOT NULL, -- Phụ thuộc vào customer_id, không phải order_id
    product_id INT NOT NULL,
    product_name VARCHAR(100) NOT NULL, -- Phụ thuộc vào product_id, không phải order_id
    product_price DECIMAL(10,2) NOT NULL, -- Phụ thuộc vào product_id, không phải order_id
    product_category VARCHAR(50) NOT NULL, -- Phụ thuộc vào product_id, không phải order_id
    quantity INT NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    shipping_address VARCHAR(255) NOT NULL,
    shipping_city VARCHAR(100) NOT NULL,
    shipping_country VARCHAR(50) NOT NULL
);

-- Vấn đề khi sử dụng bảng vi phạm 3NF
-- 1. Dư thừa dữ liệu: thông tin khách hàng và sản phẩm được lưu trữ nhiều lần
-- 2. Bất thường khi cập nhật: cần cập nhật nhiều bản ghi nếu thông tin sản phẩm thay đổi
-- 3. Bất thường khi xóa: không thể lưu thông tin sản phẩm mà không có đơn hàng
-- 4. Bất thường khi chèn: không thể thêm sản phẩm mà không có đơn hàng

-- Ví dụ về dữ liệu trùng lặp khi vi phạm 3NF
INSERT INTO orders (customer_id, customer_name, customer_email, customer_phone, product_id, product_name, product_price, product_category, quantity, shipping_address, shipping_city, shipping_country)
VALUES
(1, 'John Doe', 'john@example.com', '1234567890', 101, 'Smartphone X', 999.99, 'Electronics', 1, '123 Main St', 'New York', 'USA'),
(1, 'John Doe', 'john@example.com', '1234567890', 102, 'Laptop Y', 1499.99, 'Electronics', 1, '123 Main St', 'New York', 'USA');
-- Thông tin khách hàng John Doe bị lưu trữ trùng lặp

-- Khi cập nhật thông tin khách hàng, phải cập nhật tất cả các hàng
UPDATE orders SET customer_email = 'john.doe@example.com' WHERE customer_id = 1;
-- Không hiệu quả và dễ gây mất nhất quán dữ liệu
```

**GOOD**

```sql
-- Thiết kế tuân thủ 3NF với các bảng riêng biệt
-- Bảng khách hàng
CREATE TABLE customers (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY idx_customer_email (customer_email)
) COMMENT = 'Lưu trữ thông tin khách hàng';

-- Bảng sản phẩm
CREATE TABLE products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    product_price DECIMAL(10,2) NOT NULL,
    product_category_id INT NOT NULL, -- Tham chiếu đến bảng categories
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    KEY idx_product_category (product_category_id)
) COMMENT = 'Lưu trữ thông tin sản phẩm';

-- Bảng danh mục sản phẩm
CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY idx_category_name (category_name)
) COMMENT = 'Lưu trữ thông tin danh mục sản phẩm';

-- Bảng địa chỉ giao hàng
CREATE TABLE shipping_addresses (
    address_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(50) NOT NULL,
    is_default TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    KEY idx_customer_address (customer_id),
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
) COMMENT = 'Lưu trữ thông tin địa chỉ giao hàng';

-- Bảng đơn hàng
CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    address_id INT NOT NULL,
    order_status TINYINT NOT NULL DEFAULT 0,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    KEY idx_customer_order (customer_id),
    KEY idx_order_status (order_status),
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY (address_id) REFERENCES shipping_addresses(address_id)
) COMMENT = 'Lưu trữ thông tin đơn hàng';

-- Bảng chi tiết đơn hàng
CREATE TABLE order_items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL, -- Lưu giá tại thời điểm đặt hàng
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    KEY idx_order_product (order_id, product_id),
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
) COMMENT = 'Lưu trữ thông tin chi tiết đơn hàng';

-- Lợi ích khi sử dụng thiết kế 3NF:
-- 1. Không có dữ liệu trùng lặp: mỗi thông tin chỉ được lưu một lần
-- 2. Cập nhật dễ dàng: chỉ cần cập nhật một bản ghi
-- 3. Dễ dàng mở rộng: có thể thêm nhiều loại sản phẩm, khách hàng mà không ảnh hưởng cấu trúc
-- 4. Tính nhất quán cao: giữ liên kết chặt chẽ giữa các bảng

-- Ví dụ truy vấn dữ liệu từ các bảng tuân thủ 3NF
SELECT o.order_id, c.customer_name, c.customer_email, p.product_name,
       oi.quantity, oi.unit_price, sa.address, sa.city, sa.country
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
JOIN order_items oi ON o.order_id = oi.order_id
JOIN products p ON oi.product_id = p.product_id
JOIN shipping_addresses sa ON o.address_id = sa.address_id
WHERE o.order_id = 1;
```

```sql
-- Ví dụ về thêm mới đơn hàng trong cơ sở dữ liệu 3NF
-- 1. Đối với khách hàng mới, thêm thông tin khách hàng
INSERT INTO customers (customer_name, customer_email, customer_phone)
VALUES ('Jane Smith', 'jane@example.com', '9876543210');
SET @customer_id = LAST_INSERT_ID();

-- 2. Thêm địa chỉ giao hàng
INSERT INTO shipping_addresses (customer_id, address, city, country, is_default)
VALUES (@customer_id, '456 Elm St', 'Los Angeles', 'USA', 1);
SET @address_id = LAST_INSERT_ID();

-- 3. Tạo đơn hàng mới
INSERT INTO orders (customer_id, address_id, order_status)
VALUES (@customer_id, @address_id, 1);
SET @order_id = LAST_INSERT_ID();

-- 4. Thêm các mặt hàng vào đơn hàng
INSERT INTO order_items (order_id, product_id, quantity, unit_price)
VALUES
(@order_id, 101, 2, (SELECT product_price FROM products WHERE product_id = 101)),
(@order_id, 102, 1, (SELECT product_price FROM products WHERE product_id = 102));

-- Khi cập nhật thông tin khách hàng, chỉ cần cập nhật một nơi duy nhất
UPDATE customers SET customer_email = 'jane.smith@example.com' WHERE customer_id = @customer_id;
```
