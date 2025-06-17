-- Vertical Sharding Example for Products table
-- Tách bảng products thành 2 bảng: product_base và product_detail

-- Xóa bảng nếu đã tồn tại để tránh lỗi
DROP TABLE IF EXISTS product_detail;
DROP TABLE IF EXISTS product_base;

-- Tạo bảng product_base để lưu trữ thông tin cơ bản và thường xuyên truy vấn
CREATE TABLE product_base (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    shop_id VARCHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    price DECIMAL(15, 2) NOT NULL,
    status ENUM('draft', 'published', 'blocked') DEFAULT 'draft',
    quantity INT DEFAULT 0,
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_shop (shop_id),
    INDEX idx_category (category),
    INDEX idx_status (status)
);

-- Tạo bảng product_detail để lưu trữ thông tin chi tiết ít được truy vấn hơn
CREATE TABLE product_detail (
    id VARCHAR(36) NOT NULL,
    description TEXT,
    thumbnail VARCHAR(255),
    product_images JSON,  -- Lưu trữ danh sách hình ảnh dưới dạng JSON
    product_attributes JSON,  -- Các thuộc tính sản phẩm (màu sắc, kích thước...)
    product_specifications TEXT,  -- Thông số kỹ thuật
    sku VARCHAR(100),
    brand VARCHAR(100),
    product_tags JSON,
    PRIMARY KEY (id),
    CONSTRAINT fk_product_detail_base
        FOREIGN KEY (id) REFERENCES product_base(id)
        ON DELETE CASCADE
);

-- Tạo view để kết hợp 2 bảng khi cần truy vấn đầy đủ thông tin
CREATE OR REPLACE VIEW products_view AS
SELECT
    b.*,
    d.description,
    d.thumbnail,
    d.product_images,
    d.product_attributes,
    d.product_specifications,
    d.sku,
    d.brand,
    d.product_tags
FROM product_base b
LEFT JOIN product_detail d ON b.id = d.id;

-- Ví dụ thêm dữ liệu mẫu
INSERT INTO product_base (id, shop_id, title, price, status, quantity, category)
VALUES 
('p001', 's001', 'Điện thoại iPhone 13', 20000000, 'published', 100, 'phone'),
('p002', 's001', 'Laptop MacBook Pro 2023', 35000000, 'published', 50, 'laptop'),
('p003', 's002', 'Tai nghe AirPods Pro', 6000000, 'published', 200, 'audio');

INSERT INTO product_detail (id, description, thumbnail, product_images, product_attributes)
VALUES 
(
    'p001', 
    'iPhone 13 với chip A15 Bionic mạnh mẽ và camera cải tiến', 
    'thumbnails/iphone13.jpg',
    '["images/iphone13_1.jpg", "images/iphone13_2.jpg", "images/iphone13_3.jpg"]',
    '{"color": ["Black", "White", "Blue"], "storage": ["128GB", "256GB", "512GB"]}'
),
(
    'p002', 
    'MacBook Pro 2023 với chip M2 Pro, màn hình Liquid Retina XDR', 
    'thumbnails/macbook-pro-2023.jpg',
    '["images/macbook_1.jpg", "images/macbook_2.jpg"]',
    '{"color": ["Space Gray", "Silver"], "ram": ["16GB", "32GB"], "storage": ["512GB", "1TB", "2TB"]}'
),
(
    'p003', 
    'AirPods Pro với công nghệ khử tiếng ồn chủ động', 
    'thumbnails/airpods-pro.jpg',
    '["images/airpods_1.jpg", "images/airpods_2.jpg"]',
    '{"color": ["White"]}'
);

-- Ví dụ các câu truy vấn sử dụng vertical sharding

-- 1. Truy vấn thông tin cơ bản (chỉ dùng bảng product_base)
-- SELECT id, title, price, quantity FROM product_base WHERE category = 'phone';

-- 2. Truy vấn chi tiết một sản phẩm (kết hợp 2 bảng)
-- SELECT b.id, b.title, b.price, b.quantity, d.description, d.thumbnail 
-- FROM product_base b
-- JOIN product_detail d ON b.id = d.id
-- WHERE b.id = 'p001';

-- 3. Hoặc sử dụng view đã tạo
-- SELECT id, title, price, description FROM products_view WHERE id = 'p001';

-- 4. Tìm kiếm sản phẩm theo danh mục và sắp xếp theo giá (chỉ dùng bảng product_base)
-- SELECT id, title, price FROM product_base 
-- WHERE category = 'phone' 
-- ORDER BY price DESC;
