# Các vấn đề trong thiết kế Cơ sở dữ liệu quan hệ không tối ưu

Thiết kế cơ sở dữ liệu quan hệ (CSDL QH) là một quá trình quan trọng trong việc phát triển hệ thống thông tin. Khi thiết kế không tốt, CSDL có thể gặp nhiều vấn đề nghiêm trọng như dư thừa dữ liệu và các dị thường (anomalies) khi thực hiện các thao tác thêm, sửa, xóa. Trong tài liệu này, chúng ta sẽ xem xét một ví dụ cụ thể về một CSDL được thiết kế chưa tốt, phân tích các vấn đề và cách khắc phục.

## 1. Ví dụ về thiết kế CSDL chưa tối ưu

Giả sử chúng ta đang xây dựng một hệ thống quản lý đơn hàng cho một cửa hàng trực tuyến. Dưới đây là một thiết kế bảng dữ liệu chưa được chuẩn hóa:

### Bảng `ORDERS`

| OrderID | CustomerName | CustomerAddress | CustomerPhone | ProductID | ProductName | ProductPrice | Quantity | OrderDate  | EmployeeID | EmployeeName | EmployeeDepartment |
| ------- | ------------ | --------------- | ------------- | --------- | ----------- | ------------ | -------- | ---------- | ---------- | ------------ | ------------------ |
| 1001    | Nguyen Van A | Ha Noi          | 0901234567    | P001      | Laptop      | 15000000     | 1        | 2025-05-10 | E001       | Tran Van B   | Sales              |
| 1002    | Nguyen Van A | Ha Noi          | 0901234567    | P002      | Mouse       | 200000       | 2        | 2025-05-10 | E001       | Tran Van B   | Sales              |
| 1003    | Le Thi C     | Ho Chi Minh     | 0909876543    | P001      | Laptop      | 15000000     | 1        | 2025-05-12 | E002       | Pham Thi D   | Support            |
| 1004    | Le Thi C     | Ho Chi Minh     | 0909876543    | P003      | Keyboard    | 500000       | 1        | 2025-05-12 | E002       | Pham Thi D   | Support            |

## 2. Các vấn đề trong thiết kế CSDL trên

### 2.1. Dư thừa dữ liệu (Data Redundancy)

Trong bảng trên, chúng ta có thể thấy nhiều thông tin được lặp lại không cần thiết:

1. **Thông tin khách hàng**: Dữ liệu như `CustomerName`, `CustomerAddress`, và `CustomerPhone` được lặp lại cho mỗi sản phẩm mà khách hàng mua. Ví dụ, thông tin của "Nguyen Van A" xuất hiện trong cả hai đơn hàng 1001 và 1002.

2. **Thông tin sản phẩm**: Dữ liệu như `ProductName` và `ProductPrice` được lặp lại mỗi khi sản phẩm đó được đặt hàng. Ví dụ, thông tin về "Laptop" xuất hiện trong cả đơn hàng 1001 và 1003.

3. **Thông tin nhân viên**: Dữ liệu như `EmployeeName` và `EmployeeDepartment` được lặp lại cho mỗi đơn hàng mà nhân viên xử lý.

Những dư thừa này gây ra:

- Tốn không gian lưu trữ
- Khó khăn trong việc duy trì tính nhất quán dữ liệu
- Tăng khả năng xảy ra lỗi khi nhập liệu

### 2.2. Dị thường khi thêm dữ liệu (Insertion Anomalies)

1. **Không thể thêm thông tin sản phẩm mới**: Không thể thêm một sản phẩm mới vào cơ sở dữ liệu nếu chưa có ai đặt hàng sản phẩm đó, vì bảng ORDERS chỉ ghi nhận thông tin sản phẩm khi có đơn hàng.

2. **Không thể thêm khách hàng tiềm năng**: Không thể lưu trữ thông tin của khách hàng tiềm năng nếu họ chưa thực hiện đặt hàng.

### 2.3. Dị thường khi cập nhật dữ liệu (Update Anomalies)

1. **Khó khăn khi cập nhật thông tin**: Ví dụ, nếu "Nguyen Van A" thay đổi số điện thoại, chúng ta phải cập nhật tất cả các dòng chứa thông tin của khách hàng này. Nếu cập nhật không đồng bộ, có thể dẫn đến mâu thuẫn dữ liệu.

2. **Không nhất quán dữ liệu**: Giả sử giá của "Laptop" tăng lên 16000000 đồng, chúng ta phải cập nhật giá này trên tất cả các đơn hàng có sản phẩm là Laptop. Nếu chỉ cập nhật một phần, dữ liệu sẽ không nhất quán.

### 2.4. Dị thường khi xóa dữ liệu (Deletion Anomalies)

1. **Mất thông tin**: Nếu xóa tất cả các đơn hàng của sản phẩm "Keyboard" (vì sản phẩm không còn bán nữa), chúng ta cũng vô tình xóa luôn thông tin về sản phẩm này, không còn cách nào để biết sản phẩm này từng tồn tại.

2. **Mất lịch sử**: Nếu xóa đơn hàng cuối cùng của một khách hàng, thông tin của khách hàng đó cũng biến mất khỏi hệ thống.

## 3. Giải pháp: Chuẩn hóa CSDL

Để khắc phục các vấn đề trên, chúng ta cần chuẩn hóa CSDL bằng cách chia nhỏ thành nhiều bảng có liên kết với nhau:

### Bảng `CUSTOMERS`

| CustomerID | CustomerName | CustomerAddress | CustomerPhone |
| ---------- | ------------ | --------------- | ------------- |
| C001       | Nguyen Van A | Ha Noi          | 0901234567    |
| C002       | Le Thi C     | Ho Chi Minh     | 0909876543    |

### Bảng `PRODUCTS`

| ProductID | ProductName | ProductPrice |
| --------- | ----------- | ------------ |
| P001      | Laptop      | 15000000     |
| P002      | Mouse       | 200000       |
| P003      | Keyboard    | 500000       |

### Bảng `EMPLOYEES`

| EmployeeID | EmployeeName | EmployeeDepartment |
| ---------- | ------------ | ------------------ |
| E001       | Tran Van B   | Sales              |
| E002       | Pham Thi D   | Support            |

### Bảng `ORDERS`

| OrderID | CustomerID | EmployeeID | OrderDate  |
| ------- | ---------- | ---------- | ---------- |
| 1001    | C001       | E001       | 2025-05-10 |
| 1002    | C001       | E001       | 2025-05-10 |
| 1003    | C002       | E002       | 2025-05-12 |
| 1004    | C002       | E002       | 2025-05-12 |

### Bảng `ORDER_ITEMS`

| OrderItemID | OrderID | ProductID | Quantity | PriceAtOrder |
| ----------- | ------- | --------- | -------- | ------------ |
| OI001       | 1001    | P001      | 1        | 15000000     |
| OI002       | 1002    | P002      | 2        | 200000       |
| OI003       | 1003    | P001      | 1        | 15000000     |
| OI004       | 1004    | P003      | 1        | 500000       |

## 4. Lợi ích của thiết kế đã chuẩn hóa

1. **Giảm dư thừa dữ liệu**: Mỗi loại thông tin chỉ được lưu trữ một lần.
2. **Tránh dị thường khi thêm dữ liệu**: Có thể thêm thông tin sản phẩm mới, khách hàng mới mà không cần có đơn hàng.
3. **Tránh dị thường khi cập nhật**: Chỉ cần cập nhật thông tin tại một nơi.
4. **Tránh dị thường khi xóa**: Không làm mất thông tin liên quan khi xóa dữ liệu ở một bảng.
5. **Tính nhất quán dữ liệu**: Dữ liệu luôn được đảm bảo tính nhất quán trong toàn bộ hệ thống.
6. **Hiệu suất truy vấn tốt hơn**: Các bảng nhỏ hơn nên việc tìm kiếm và truy vấn nhanh hơn.

## 5. Kết luận

Thiết kế CSDL quan hệ là một quá trình cần được thực hiện cẩn thận để tránh các vấn đề về dư thừa dữ liệu và dị thường khi thêm, sửa, xóa. Việc chuẩn hóa CSDL giúp tạo ra một hệ thống dữ liệu hiệu quả, dễ bảo trì và mở rộng.

Qua ví dụ trên, chúng ta thấy rằng một thiết kế CSDL tốt không chỉ giúp tiết kiệm không gian lưu trữ mà còn đảm bảo tính toàn vẹn và nhất quán của dữ liệu, cũng như làm đơn giản hóa các thao tác trên dữ liệu.
