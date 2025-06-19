# Các loại `type` trong `EXPLAIN` của MySQL

Khi sử dụng lệnh `EXPLAIN` trong MySQL để phân tích một câu lệnh `SELECT`, cột `type` cho biết cách MySQL sẽ join các bảng. Đây là một trong những cột quan trọng nhất để đánh giá hiệu năng của query. Các giá trị của `type` được sắp xếp từ tốt nhất đến tệ nhất như sau: `system`, `const`, `eq_ref`, `ref`, `range`, `index`, `all`.

---

### 1. `system`

- **Mô tả:** Bảng chỉ có một hàng (hoặc không có hàng nào). Đây là một trường hợp đặc biệt của kiểu `const`. Đây là loại join nhanh nhất.
- **Hiệu năng:** Cực kỳ nhanh.
- **Ví dụ:**
  ```sql
  -- Bảng chỉ có một hàng.
  EXPLAIN
  SELECT *
  FROM (SELECT 1) AS single_row_table;
  ```

---

### 2. `const`

- **Mô tả:** Bảng có tối đa một hàng khớp, được đọc vào đầu của query và được coi như một hằng số. Điều này xảy ra khi bạn so sánh tất cả các phần của một `PRIMARY KEY` hoặc `UNIQUE` index với các giá trị hằng số.
- **Hiệu năng:** Rất nhanh, vì bảng chỉ được đọc một lần.
- **Ví dụ:**
  ```sql
  -- Query trên một PRIMARY KEY hoặc UNIQUE index với giá trị cụ thể.
  EXPLAIN
  SELECT *
  FROM orders
  WHERE OrderID = 10248; -- OrderID là PRIMARY KEY
  ```

---

### 3. `eq_ref`

- **Mô tả:** Một hàng được đọc từ bảng này cho mỗi sự kết hợp của các hàng từ các bảng trước đó. Kiểu join này được sử dụng khi tất cả các phần của một index là một phần của join và index đó là `PRIMARY KEY` hoặc `UNIQUE NOT NULL`.
- **Hiệu năng:** Rất tốt. Chỉ sau `system` và `const`.
- **Ví dụ:**
  ```sql
  -- Join hai bảng qua một PRIMARY KEY hoặc UNIQUE index.
  EXPLAIN
  SELECT *
  FROM orders AS o
  JOIN customers AS c ON o.CustomerID = c.CustomerID; -- Giả sử c.CustomerID là PRIMARY KEY
  ```

---

### 4. `ref`

- **Mô tả:** Tất cả các hàng có giá trị index khớp sẽ được đọc từ bảng này cho mỗi sự kết hợp của các hàng từ các bảng trước đó. `ref` được sử dụng nếu join chỉ sử dụng tiền tố ngoài cùng bên trái của key hoặc nếu key không phải là `PRIMARY KEY` hoặc `UNIQUE` index (nói cách khác, join không thể chọn ra một hàng duy nhất).
- **Hiệu năng:** Tốt. Nhanh hơn `range`, nhưng chậm hơn `eq_ref`.
- **Ví dụ:**

  ```sql
  CREATE TABLE t1 (
      id INT,
      name VARCHAR(30),
      INDEX(id)
  );

  CREATE TABLE t2 (
      id INT,
      name VARCHAR(20),
      INDEX(id)
  );

  -- Join trên một cột được đánh index nhưng không phải là UNIQUE.
  EXPLAIN
  SELECT *
  FROM t1, t2
  WHERE t1.id = t2.id;
  ```

---

### 5. `range`

- **Mô tả:** Chỉ các hàng nằm trong một phạm vi nhất định được truy xuất, sử dụng một index để chọn các hàng. Cột `key` trong output của `EXPLAIN` cho biết index nào được sử dụng.
- **Hiệu năng:** Khá. Tốt hơn `index` và `all`. Thường xảy ra với các toán tử như `BETWEEN`, `IN()`, `>`, `<`, `>=`...
- **Ví dụ:**
  ```sql
  -- Query sử dụng điều kiện trong một khoảng (range).
  EXPLAIN
  SELECT *
  FROM orders
  WHERE OrderID BETWEEN 10248 AND 10250;
  ```

---

### 6. `index`

- **Mô tả:** Tương tự như `ALL`, ngoại trừ việc chỉ quét cây index. Điều này thường nhanh hơn `ALL` vì file index thường nhỏ hơn file dữ liệu. MySQL có thể sử dụng kiểu join này khi query chỉ sử dụng các cột là một phần của một index duy nhất (covering index).
- **Hiệu năng:** Chậm. Tốt hơn `ALL` một chút nếu index nhỏ hơn dữ liệu bảng.
- **Ví dụ:**
  ```sql
  -- Quét toàn bộ index thay vì toàn bộ bảng.
  -- Thường xảy ra khi query chỉ cần dữ liệu từ index (Covering Index).
  EXPLAIN
  SELECT COUNT(*) FROM orders; -- Giả sử có một index bất kỳ trên bảng orders.
  ```

---

### 7. `ALL`

- **Mô tả:** Quét toàn bộ bảng (full table scan) được thực hiện cho mỗi sự kết hợp của các hàng từ các bảng trước đó. Đây là kiểu join tệ nhất và thường cho thấy hiệu năng rất kém.
- **Hiệu năng:** Rất chậm. Cần được tối ưu hóa bằng cách thêm index cho các cột được sử dụng trong điều kiện `WHERE` hoặc `JOIN`.
- **Ví dụ:**
  ```sql
  -- Quét toàn bộ bảng.
  EXPLAIN
  SELECT * FROM orders; -- Khi không có điều kiện WHERE hoặc điều kiện WHERE không sử dụng index.
  ```

  ---
  [docs](https://dev.mysql.com/doc/refman/8.4/en/explain-output.html)
