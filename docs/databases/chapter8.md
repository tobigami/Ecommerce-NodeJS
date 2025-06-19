 **Chương 8: Thủ tục lưu trữ hệ thống và kích hoạt (Stored Procedure & Trigger)**. Chương này tập trung vào hai khái niệm quan trọng trong quản trị và thao tác dữ liệu trong các hệ quản trị cơ sở dữ liệu.


### 1. Thủ tục lưu trữ (Stored Procedure - SP)

#### 1.1. Khái niệm
*   **Thủ tục lưu trữ (SP)** là một tập hợp các phát biểu T-SQL (hoặc ngôn ngữ tương tự tùy theo hệ quản trị CSDL) mà hệ quản trị CSDL biên dịch thành một kế hoạch thực thi và được **lưu trữ trực tiếp trong cơ sở dữ liệu**.
*   Khi một SP được chạy lần đầu, mô hình truy vấn của nó sẽ được đặt vào bộ nhớ, giúp các lần chạy sau đó **nhanh hơn**.
*   SP được coi là các tập lệnh chạy nhanh.

#### 1.2. Các loại Stored Procedure
*   **SP hệ thống**: Do SQL Server cung cấp, có tên bắt đầu bằng tiền tố `sp_`. Chúng được dùng để quản lý SQL Server và hiển thị thông tin về CSDL và người dùng.
*   **SP mở rộng**: Là các thư viện liên kết động (DLL) được viết bằng các ngôn ngữ như C, C++ và có thể được SQL Server nạp và thực thi. SP bên ngoài có tên bắt đầu bằng `xp_`.
*   **SP người dùng định nghĩa**: Do người dùng tự tạo.

#### 1.3. Lợi ích của việc sử dụng SP
*   **Hiệu quả cao**: Lược đồ của thủ tục được lưu trữ trong vùng đệm sau lần thực hiện đầu tiên, cải thiện hiệu suất nếu sử dụng nhiều lần trong cùng phiên làm việc.
*   **Đóng gói quy tắc nghiệp vụ**: Giúp nhiều ứng dụng có thể sử dụng cùng một quy tắc, và việc thay đổi quy tắc chỉ cần thực hiện ở một nơi.
*   **Truyền đối số và nhận dữ liệu trả về**: SP có thể nhận các tham số đầu vào và trả về dữ liệu hoặc giá trị qua tham số OUTPUT hoặc RETURN.
*   **Chạy tự động**: Có thể thiết lập SP chạy tự động khi SQL Server khởi động.
*   **Được gọi rõ ràng**: Không như trigger, SP phải được gọi trực tiếp bởi ứng dụng, kịch bản, batch, hoặc tác vụ.
*   **Hữu ích trong quản trị và bảo trì CSDL**.
*   **Phân quyền linh hoạt**: Có thể gán quyền cho một người dùng chạy SP ngay cả khi người đó không có quyền trực tiếp trên các bảng cơ sở mà SP tương tác.

#### 1.4. Cú pháp cơ bản và ví dụ
*   **Cú pháp tạo SP** (trong SQL Server):
    ```sql
    CREATE PROC[EDURE] procedure_name
    {;number}
    [@parameter data_type][=default | NULL][VARYING][OUT PUT]]
    [WITH {RECOMPILE | ENCRYPTION | RECOMPILE,ENCRYPTION}]
    [FOR REPLICATION]
    AS sql_statement
    ```
*   **Ví dụ tạo SP đơn giản**:
    ```sql
    CREATE PROCEDURE pAuthors
    AS
    SELECT au_fname, au_lname FROM authors ORDER BY au_fname DESC
    GO
    ```
    Để chạy thủ tục này, dùng `EXEC pAuthors`.
*   **SP với tham số**: Có thể khai báo đến 1024 tham số. Tham số `OUTPUT` được dùng để trả về giá trị.
    ```sql
    CREATE PROCEDURE scores
        @score1 smallint, @score2 smallint, @score3 smallint,
        @score4 smallint, @score5 smallint, @myAvg smallint OUTPUT
    AS
    SELECT @myAvg = (@score1 + @score2 + @score3 + @score4 + @score5) / 5
    ```
    Để gọi và nhận giá trị:
    ```sql
    DECLARE @AvgScore smallint
    EXEC scores 10, 9, 8, 8, 10, @AvgScore OUTPUT
    SELECT 'The Average Score is: ', @AvgScore
    ```
    Hoặc truyền tham số không theo thứ tự.
*   **Từ khóa RETURN**: SP có thể trả về một giá trị nguyên (integer) bằng từ khóa `RETURN`.
*   **Tùy chọn `WITH RECOMPILE`**: Buộc thủ tục được biên dịch lại mỗi khi chạy, tối ưu cho các tham số mới. Có thể sử dụng khi tạo SP hoặc khi thực thi SP.
*   **Tùy chọn `ENCRYPTION`**: Khi tạo SP với tùy chọn này, không thể xem được nội dung của SP.
*   **Xóa thủ tục**: `DROP PROCEDURE procedure_name`.

### 2. Kích hoạt (Trigger)

#### 2.1. Khái niệm
*   **Trigger** là một thủ tục lưu trữ hệ thống đặc biệt, được **tự động thực thi** khi có một sự kiện gây biến đổi dữ liệu xảy ra (như **INSERT, UPDATE, DELETE**).
*   Trigger được sử dụng để đảm bảo **toàn vẹn dữ liệu** hoặc thực hiện các quy tắc nghiệp vụ phức tạp mà `CONSTRAINT` không thể đáp ứng.
*   Khác với `CONSTRAINT` (kiểm tra dữ liệu trước khi nhận vào bảng), trigger thuộc loại toàn vẹn dữ liệu thủ tục, nghĩa là nó được kích hoạt **sau khi** các thao tác Insert, Update, Delete xảy ra.

#### 2.2. Đặc điểm của Trigger
*   Một trigger có thể thực hiện nhiều công việc và được kích hoạt bởi nhiều sự kiện.
*   Trigger không thể được tạo ra trên bảng tạm hoặc bảng hệ thống.
*   Trigger chỉ có thể được kích hoạt tự động, không thể chạy thủ công.
*   Có thể áp dụng trigger cho view.
*   Khi trigger được kích hoạt, dữ liệu mới được `INSERT` sẽ nằm trong bảng tạm **`inserted`**, và dữ liệu bị `DELETE` sẽ nằm trong bảng tạm **`deleted`**.
    *   Các bảng tạm này được lưu trữ trong bộ nhớ và chỉ có giá trị bên trong phạm vi của trigger. Chúng không thể truy xuất được sau khi trigger hoàn tất.

#### 2.3. Cú pháp và ví dụ
*   **Cú pháp tạo Trigger** (có thể dùng T-SQL hoặc Enterprise Manager):
    ```sql
    CREATE TRIGGER trigger_name
    ON table_name
    [FOR | AFTER | INSTEAD OF] [INSERT, UPDATE, DELETE]
    AS
    sql_statement
    ```
    (Lưu ý: các phát biểu như ALTER DATABASE, CREATE DATABASE, DROP DATABASE, v.v. không được dùng trong định nghĩa trigger).
*   **Ví dụ tạo trigger `FOR INSERT`**:
    ```sql
    CREATE TRIGGER In_ThemNCC ON NHA_CC
    FOR INSERT
    AS
    PRINT 'BANG NHA_CC da duoc them du lieu'
    ```
    Trigger này sẽ in thông báo mỗi khi dữ liệu được thêm vào bảng `NHA_CC`.
*   **Ví dụ tạo `deleted` trigger**:
    ```sql
    CREATE TRIGGER tg_MatHangXoa ON MatHang
    FOR DELETE
    AS
    INSERT INTO tbl_MatHangXoa SELECT * FROM deleted
    ```
    Trigger này lưu trữ các mặt hàng bị xóa từ bảng `MatHang` vào bảng `tbl_MatHangXoa`.
*   **Ví dụ tạo `inserted` trigger (cập nhật số lượng)**:
    ```sql
    CREATE TRIGGER tg_CapNhatSoLuong ON BanHang
    FOR INSERT
    AS
    UPDATE MatHang SET MatHang.SoLuong = MatHang.SoLuong – inserted.SoLuong
    WHERE MatHang.MaHang = inserted.MaHang
    ```
    Trigger này tự động trừ số lượng sản phẩm trong bảng `MatHang` mỗi khi có một hàng mới (hàng được bán) được thêm vào bảng `BanHang`.
*   **Ví dụ tạo `update` trigger (kiểm tra giá)**:
    ```sql
    CREATE TRIGGER tg_KiemTraCapNhatGia ON MatHang
    FOR UPDATE
    AS
    DECLARE @gia_cu smallmoney, @gia_moi smallmoney
    SELECT @gia_cu = DonGia FROM deleted
    SELECT @gia_moi = DonGia FROM inserted
    IF(@gia_moi > (@gia_cu*1.10))
    BEGIN
        PRINT 'Gia moi tang qua 10%, khong cap nhat'
        ROLLBACK -- Hoàn tác nếu giá tăng quá 10%
    END
    ELSE
        PRINT 'Gia moi chap nhan duoc'
    ```
    Trigger này kiểm tra nếu giá mới tăng quá 10% so với giá cũ thì sẽ hoàn tác thay đổi.

Hy vọng phần tổng quan này giúp bạn nắm bắt rõ hơn về Chương 8!