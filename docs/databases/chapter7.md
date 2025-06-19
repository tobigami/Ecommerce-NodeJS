Chào bạn,

Tuyệt vời! Chúng ta sẽ tiếp tục với **Chương 7: Tổ chức dữ liệu vật lý**.

Chương này tập trung vào cách dữ liệu được tổ chức và lưu trữ trên các thiết bị nhớ vật lý để tối ưu hóa việc truy xuất và thao tác.

Dưới đây là các nội dung chính của Chương 7:

### 1. Mô hình tổ chức bộ nhớ
*   Hệ thống bộ nhớ của máy tính được phân thành hai loại chính:
    *   **Bộ nhớ sơ cấp (Primary Memory)**: Bao gồm các thiết bị nhớ mà CPU có thể thao tác trực tiếp (như bộ nhớ chính, bộ nhớ đệm cache). Loại này cung cấp cơ chế truy cập dữ liệu nhanh nhưng bị **giới hạn về dung lượng**.
    *   **Bộ nhớ thứ cấp (Secondary Memory hay bộ nhớ ngoài)**: Bao gồm các đĩa từ, đĩa quang, băng từ. Loại này có **dung lượng lớn hơn, chi phí rẻ hơn** nhưng cung cấp cơ chế truy cập dữ liệu chậm hơn. CPU không xử lý dữ liệu trực tiếp trên bộ nhớ thứ cấp mà dữ liệu cần được sao chép sang bộ nhớ sơ cấp trước khi CPU xử lý.
*   **Cấu trúc lưu trữ trên đĩa**:
    *   Đĩa được chia thành các **khối vật lý (sector)**, có kích thước từ 512 byte đến 4096 byte và được đánh địa chỉ khối tuyệt đối.
    *   Mỗi tệp dữ liệu chiếm một hoặc nhiều khối.
    *   Mỗi khối chứa một hoặc nhiều bản ghi.
    *   Địa chỉ của các bản ghi/khối có thể là địa chỉ tuyệt đối của byte đầu tiên hoặc địa chỉ khối kết hợp với số byte tính từ đầu khối đến vị trí đầu bản ghi.
    *   Địa chỉ của các bản ghi/khối thường được lưu trong một tệp khác, và **con trỏ (pointer)** được sử dụng để truy cập dữ liệu.

### 2. Tổ chức tệp đống (Heap file)
*   **Nguyên tắc tổ chức**: Các bản ghi được lưu trữ kế tiếp trong các khối **mà không tuân theo một thứ tự đặc biệt nào**.
*   **Các thao tác cơ bản**:
    *   **Tìm kiếm một bản ghi**: Cần quét toàn bộ tệp để tìm bản ghi có giá trị khóa cho trước.
    *   **Thêm một bản ghi**: Bản ghi mới được thêm vào sau bản ghi cuối cùng của tệp.
    *   **Xóa một bản ghi**: Thao tác này bao gồm tìm kiếm. Bản ghi cần xóa sẽ được đánh dấu là xóa, và hệ thống cần tổ chức lại đĩa định kỳ để loại bỏ các bản ghi đã xóa thực sự.
    *   **Sửa một bản ghi**: Tìm bản ghi và sửa đổi một hoặc nhiều trường.

### 3. Tổ chức tệp băm (Hashed files)
*   **Hàm băm**: Sử dụng một **hàm băm** `h(x)` để ánh xạ giá trị khóa `x` của bản ghi đến một cụm lưu trữ (ví dụ: `h(x) = x mod k`).
*   **Nguyên tắc tổ chức**: Phân chia các bản ghi vào các **cụm (cluster)**. Mỗi cụm bao gồm một hoặc nhiều khối, và mỗi khối chứa một số lượng bản ghi cố định. Cách tổ chức lưu trữ dữ liệu trong mỗi cụm thường áp dụng theo tổ chức tệp đống.
*   **Tiêu chí chọn hàm băm**: Đảm bảo phân bố các bản ghi tương đối đồng đều theo các cụm.
*   **Các thao tác cơ bản**:
    *   **Tìm kiếm một bản ghi**: Tính `h(x)` để xác định cụm chứa bản ghi, sau đó tìm kiếm trong cụm đó.
    *   **Thêm một bản ghi**: Nếu không có bản ghi trùng khóa, bản ghi được thêm vào khối còn chỗ trống đầu tiên trong cụm; nếu hết chỗ, tạo khối mới.
    *   **Xóa một bản ghi**: Tìm kiếm bản ghi và xóa.
    *   **Sửa đổi một bản ghi**: Nếu trường cần sửa có tham gia vào khóa, thao tác này sẽ là loại bỏ bản ghi cũ và thêm mới bản ghi. Nếu không thuộc khóa, chỉ cần tìm kiếm và sửa đổi.

### 4. Tổ chức tệp chỉ dẫn (Indexed Files)
*   **Giả định**: Các giá trị khóa của các bản ghi được **sắp xếp tăng dần**.
*   **Tệp chỉ dẫn (Index file)**: Được tạo bằng cách chọn các giá trị khóa từ các bản ghi chính. Tệp chỉ dẫn bao gồm các cặp `(k, d)`, trong đó `k` là giá trị khóa của bản ghi đầu tiên trong một khối, và `d` là địa chỉ của khối đó (hay con trỏ khối).
*   **Tìm kiếm trên tệp chỉ dẫn**: Để tìm bản ghi với khóa `ki`, tìm một bản ghi `(km, d)` trong tệp chỉ dẫn sao cho `km <= ki` và `km` là giá trị khóa lớn nhất thỏa mãn điều kiện đó (ví dụ, `km` phủ `ki`). Tìm kiếm có thể là **tuần tự** hoặc **nhị phân**.
*   **Các thao tác cơ bản**:
    *   **Tìm kiếm một bản ghi**: Sử dụng tệp chỉ dẫn để xác định khối chứa bản ghi.
    *   **Thêm một bản ghi**: Xác định khối sẽ chứa bản ghi. Nếu còn chỗ, đặt bản ghi vào đúng chỗ theo thứ tự sắp xếp và dồn các bản ghi phía sau. Nếu khối hết chỗ, có thể phải tạo thêm khối mới và cập nhật tệp chỉ dẫn tương ứng.
    *   **Xóa một bản ghi**: Tương tự như thêm, nếu việc xóa tạo thành một khối rỗng, có thể loại bỏ khối đó.
    *   **Sửa một bản ghi**: Nếu trường không phải là khóa, sửa bình thường. Nếu trường tham gia vào khóa, quá trình sửa sẽ là một quá trình xóa bản ghi cũ và thêm bản ghi mới.

### 5. Cây cân bằng (Balanced-trees - B-tree)
*   **B-tree** là một cấu trúc dữ liệu dạng cây tự cân bằng, được tổ chức theo cấp `m` và có các tính chất sau:
    *   **Nút gốc** hoặc là một nút lá hoặc có ít nhất hai con.
    *   Mỗi nút (trừ nút gốc và nút lá) có từ `[m/2]` đến `m` con.
    *   Mỗi đường đi từ nút gốc đến bất kỳ nút lá nào đều có **độ dài như nhau** (tính cân bằng).
*   **Cấu trúc của mỗi nút**: Dạng `(p0, k1, p1, k2,...,kn, pn)`, trong đó `pi` là con trỏ trỏ tới khối `i` của nút có `ki` là khóa đầu tiên của khối đó. Các khóa `k` trong một nút được sắp xếp theo thứ tự tăng dần.
*   **Các mối quan hệ khóa trong cây con**: Mọi khóa trong cây con được trỏ bởi con trỏ `p0` đều nhỏ hơn `k1`; mọi khóa trong cây con được trỏ bởi con trỏ `pi` đều nhỏ hơn `ki+1`; và mọi khóa trong cây con được trỏ bởi con trỏ `pn` đều lớn hơn `kn`.
*   **Các thao tác cơ bản**:
    *   **Tìm kiếm một bản ghi**: Xác định đường dẫn từ nút gốc tới nút lá chứa bản ghi này.
    *   **Thêm một bản ghi**: Xác định vị trí nút lá sẽ chứa bản ghi. Nếu còn chỗ, thêm bình thường. Nếu hết chỗ, cần tạo thêm nút lá mới, chuyển một nửa dữ liệu cuối của nút lá hiện tại sang nút mới, sau đó thêm bản ghi mới vào vị trí phù hợp. Thao tác này có thể ảnh hưởng đến các nút cha hoặc nút gốc.
    *   **Loại bỏ một bản ghi**: Sử dụng thủ tục tìm kiếm để xác định nút lá chứa bản ghi đó. Thao tác này cũng có khả năng ảnh hưởng đến các nút cha hoặc nút gốc.

### Kết luận chương
*   **Tổ chức tệp chỉ dẫn** được áp dụng phổ biến, đặc biệt với các ứng dụng yêu cầu cả xử lý tuần tự và truy nhập trực tiếp đến các bản ghi. Khi kích thước tệp tăng, hiệu năng có thể giảm, vì vậy chỉ dẫn B-tree được ưu tiên sử dụng để khắc phục.
*   **Tổ chức băm** dựa trên một hàm băm, cho phép tìm thấy địa chỉ khoản mục dữ liệu một cách trực tiếp. Hiệu quả của nó phụ thuộc vào việc hàm băm có phân bố các bản ghi đồng đều trong các cụm hay không.

Hy vọng phần tổng quan này giúp bạn hiểu rõ hơn về Chương 7!