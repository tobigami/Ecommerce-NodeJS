**Chương 6: An toàn và toàn vẹn dữ liệu**.

Chương này đi sâu vào các khía cạnh quan trọng để đảm bảo dữ liệu trong Cơ sở dữ liệu (CSDL) luôn được bảo vệ và chính xác, đặc biệt trong môi trường đa người dùng.

Dưới đây là các nội dung chính của Chương 6:

### 1. Đặt vấn đề
Chương này mở đầu bằng việc nêu ra một số yêu cầu cần thiết đối với việc thiết kế, cài đặt và quản trị CSDL:
*   **Đảm bảo tính an toàn của dữ liệu**: Mục tiêu là tránh các truy nhập không hợp lệ từ phía người dùng, thông qua việc **phân quyền**, **xác minh** và **kiểm tra quyền hạn** của người sử dụng.
*   **Đảm bảo tính đúng đắn của dữ liệu**: Điều này liên quan đến việc tránh sai sót khi cập nhật dữ liệu bằng cách **định nghĩa và kiểm tra các ràng buộc dữ liệu**, cũng như tránh sai sót trong quá trình thao tác dữ liệu thông qua **kiểm tra tính toàn vẹn của các thao tác**.

### 2. An toàn dữ liệu (Data Security)
*   **Định nghĩa**: Tính an toàn dữ liệu là sự bảo vệ dữ liệu trong CSDL chống lại những truy nhập, sửa đổi hay phá hủy bất hợp pháp. Người sử dụng hợp pháp là những người được cấp phép, ủy quyền.
*   **Quản lý người dùng**: Một cơ chế quản lý người dùng hợp lý là cần thiết, vì các nhóm người dùng khác nhau có quyền sử dụng khác nhau đối với các đối tượng dữ liệu (như bảng, khung nhìn).
*   **Các quyền truy nhập**:
    *   **Đối với người khai thác CSDL**: Quyền đọc, cập nhật, xóa, và bổ sung dữ liệu.
    *   **Đối với người quản trị CSDL**: Quyền tạo chỉ dẫn (index), thay đổi sơ đồ CSDL, loại bỏ quan hệ, và quản lý tài nguyên (thêm quan hệ mới).
*   **Trách nhiệm của người quản trị hệ thống**:
    *   **Xác minh người sử dụng**: Hệ thống cần nhận biết được người dùng thông qua các kỹ thuật như tài khoản (tên và mật khẩu), hàm kiểm tra, thẻ điện tử, hoặc nhận dạng sinh trắc học (tiếng nói, vân tay).
    *   **Phân quyền người sử dụng**: Xác định các quyền cụ thể mà mỗi người/nhóm người dùng được phép thực hiện, kiểm soát phần dữ liệu mà họ được truy nhập và các quyền thao tác (đọc, thêm, xóa, sửa đổi).
    *   **Kiểm soát sự lưu chuyển dữ liệu**: Bảo trì danh sách các quyền chặt chẽ, vì người dùng có thể được quyền lan truyền các quyền cho người khác.
*   **Các câu lệnh an toàn dữ liệu trong SQL**:
    *   **CREATE VIEW**: Dùng để tạo ra một **khung nhìn (view)**, tức là một bảng ảo dựa trên kết quả của một câu truy vấn SQL. Khung nhìn có thể được sử dụng để giới hạn quyền truy cập của người dùng vào một phần dữ liệu nhất định.
    *   **GRANT**: Dùng để **phân quyền** cho người sử dụng các thao tác như `Insert`, `Update`, `Delete`, `Select`, `Create`, `Alter`, `Drop`, `Read/Write` trên một đối tượng (bảng hoặc khung nhìn). Từ khóa `WITH GRANT OPTION` cho phép người được cấp quyền có thể lan truyền quyền đó cho người khác.
    *   **REVOKE**: Dùng để **thu hồi quyền** đã cấp. Khi thu hồi, có thể dùng `RESTRICT` (chỉ hủy bỏ quyền của người trong danh sách) hoặc `CASCADE` (hủy bỏ quyền của người đó và cả những quyền mà người đó đã lan truyền).

### 3. Toàn vẹn dữ liệu (Data Integrity)
*   **Định nghĩa**: Tính toàn vẹn dữ liệu là sự bảo vệ dữ liệu trong CSDL chống lại những sự sửa đổi, phá hủy vô căn cứ để đảm bảo tính đúng đắn và chính xác của dữ liệu.
*   **Các ràng buộc toàn vẹn trong SQL**:
    *   **Ràng buộc về khóa chính, khóa ngoài, CHECK**: Đã được đề cập khi tạo bảng.
    *   **Khẳng định (Assertion)**: Là một vị từ biểu thị một điều kiện mà CSDL phải luôn luôn thỏa mãn, được tạo bằng lệnh `CREATE ASSERTION ... CHECK ...`. Ví dụ: Đảm bảo số lượng mặt hàng cung cấp bởi hãng nhỏ phải dưới 100.
    *   **Kích hoạt (Trigger)**: Là một thủ tục lưu trữ đặc biệt, **được thực thi tự động** khi có sự kiện biến đổi dữ liệu (như `Update`, `Insert` hay `Delete`).
        *   Trigger được sử dụng khi các biện pháp ràng buộc (`Constraint`) thông thường không đủ để thỏa mãn yêu cầu nghiệp vụ.
        *   `Constraint` là toàn vẹn dữ liệu khai báo (kiểm tra trước khi nhận dữ liệu), trong khi `Trigger` là toàn vẹn dữ liệu thủ tục (kích hoạt sau khi thao tác xảy ra).
        *   Đặc điểm của trigger: có thể làm nhiều việc, kích hoạt bởi nhiều sự kiện, không thể tạo trên bảng tạm/hệ thống, không chạy thủ công, có thể áp dụng cho view. Khi trigger kích hoạt, dữ liệu mới được chèn vào bảng "inserted" và dữ liệu bị xóa vào bảng "deleted" (đây là các bảng tạm trong bộ nhớ).

### 4. Điều khiển tương tranh (Concurrency Control)
*   **Mục đích**: Trong hệ CSDL đa người dùng, cần có giải pháp để tránh đụng độ giữa các giao dịch (một dãy các thao tác) được thực hiện đồng thời bởi nhiều người dùng, nhằm đảm bảo tính đúng đắn của dữ liệu trong quá trình cập nhật.
*   **Giao dịch (Transaction)**: Một đơn vị công việc trong DBMS, được coi là **không chia cắt được (atomic)**, đáng tin cậy và độc lập với các giao dịch khác. Nếu có sự cố, toàn bộ giao dịch phải được khôi phục về trạng thái ban đầu.
*   **Các tính chất ACID của giao dịch**:
    *   **Tính nguyên tố (Atomicity)**: Hoặc tất cả các thao tác được thực hiện, hoặc không thao tác nào.
    *   **Tính nhất quán (Consistency)**: Dữ liệu nhất quán sau khi giao dịch hoàn thành.
    *   **Tính cách ly (Isolation)**: Những thay đổi của một giao dịch được ẩn với các giao dịch đồng thời khác.
    *   **Tính bền vững (Durability)**: Kết quả của giao dịch đã được xác nhận (committed) phải tồn tại vĩnh viễn, ngay cả khi hệ thống gặp sự cố.
*   **Các vấn đề phát sinh khi không có điều khiển tương tranh**:
    *   **The Lost Update (Cập nhật bị mất)**: Xảy ra khi hai giao dịch truy cập cùng dữ liệu và các thao tác của chúng xen kẽ, dẫn đến giá trị dữ liệu bị sai lệch.
    *   **The Temporary Update (Dirty Read - Đọc dữ liệu bẩn)**: Một giao dịch cập nhật dữ liệu nhưng sau đó thất bại và phải hoàn tác, nhưng một giao dịch khác đã đọc giá trị tạm thời không đúng đó trước khi nó được hoàn tác.
    *   **The Incorrect Summary (Tổng kết không đúng)**: Một giao dịch tính toán hàm tổng hợp trên các bản ghi đang được cập nhật bởi giao dịch khác, dẫn đến kết quả tổng hợp có thể dựa trên cả giá trị cũ và mới.
    *   **The Unrepeatable Read (Đọc không lặp lại)**: Một giao dịch đọc cùng một mục dữ liệu hai lần, nhưng một giao dịch khác đã thay đổi mục đó giữa hai lần đọc, dẫn đến kết quả khác nhau.
*   **Các kỹ thuật điều khiển tương tranh**:
    *   **Kỹ thuật dùng khóa (Locking)**: Khi một giao dịch cần dữ liệu, nó sẽ xin một khóa trên phần dữ liệu đó. Các giao dịch khác phải đợi cho đến khi khóa được giải phóng. Có các loại khóa đọc (cho phép nhiều giao dịch đọc đồng thời) và khóa ghi (chỉ một giao dịch tại một thời điểm).
    *   **Kỹ thuật gán nhãn thời gian (Timestamping)**: Mỗi giao dịch được gán một nhãn thời gian. Giao dịch nào có nhãn thời gian nhỏ hơn sẽ được ưu tiên thực hiện trước, giúp chuyển đổi các yêu cầu đồng thời về thực hiện tuần tự.