# Các dạng chuẩn trong thiết kế cơ sở dữ liệu quan hệ

## Phụ thuộc hàm (Functional Dependency)

Phụ thuộc hàm là một khái niệm quan trọng trong thiết kế cơ sở dữ liệu quan hệ, đặc biệt trong quá trình chuẩn hóa. Đây là mối quan hệ giữa các thuộc tính trong một bảng dữ liệu.

### Định nghĩa

Trong một quan hệ R, một tập thuộc tính Y được gọi là **phụ thuộc hàm** vào một tập thuộc tính X (ký hiệu: X → Y) khi và chỉ khi với mỗi giá trị x của X luôn xác định duy nhất một giá trị y của Y tại mọi thời điểm.

### Đặc điểm chính của phụ thuộc hàm

1. **Tính xác định**: Nếu X → Y, thì giá trị của X xác định duy nhất giá trị của Y
2. **Tính đơn ánh**: Mỗi giá trị của X ánh xạ đến một và chỉ một giá trị của Y

### Các loại phụ thuộc hàm

1. **Phụ thuộc hàm đầy đủ**: Y phụ thuộc đầy đủ vào X khi Y phụ thuộc hàm vào X, nhưng không phụ thuộc vào bất kỳ tập con nào của X.

2. **Phụ thuộc hàm bộ phận**: Y phụ thuộc bộ phận vào X khi Y phụ thuộc hàm vào X, nhưng cũng phụ thuộc vào một tập con của X.

3. **Phụ thuộc hàm bắc cầu**: Nếu X → Y và Y → Z, thì X → Z (qua bắc cầu Y).

## Các dạng chuẩn (Normal Forms)

Các dạng chuẩn là những quy tắc được sử dụng trong quá trình chuẩn hóa cơ sở dữ liệu quan hệ nhằm loại bỏ dư thừa dữ liệu và các dị thường.

### 1. Dạng chuẩn 1 (1NF - First Normal Form)

#### Vai trò:

- Loại bỏ các nhóm lặp lại (repeated groups)
- Đảm bảo mỗi ô giao giữa một hàng và một cột chỉ chứa một giá trị đơn (atomic value)
- Đảm bảo mỗi bảng đều có khóa chính (primary key)

#### Ví dụ:

**Bảng chưa đạt 1NF:**
| StudentID | Name | Courses |
|-----------|-----------|----------------------------|
| S001 | Nguyen A | Math, Physics, Chemistry |
| S002 | Tran B | Literature, History |

**Vấn đề:** Cột Courses chứa nhiều giá trị trong một ô.

**Bảng đã đạt 1NF:**
| StudentID | Name | Course |
|-----------|-----------|-------------|
| S001 | Nguyen A | Math |
| S001 | Nguyen A | Physics |
| S001 | Nguyen A | Chemistry |
| S002 | Tran B | Literature |
| S002 | Tran B | History |

### 2. Dạng chuẩn 2 (2NF - Second Normal Form)

#### Vai trò:

- Đã đạt 1NF
- Loại bỏ các phụ thuộc hàm bộ phận (partial dependency): các thuộc tính không khóa phải phụ thuộc đầy đủ vào khóa chính (nếu khóa chính là khóa tổ hợp)

#### Ví dụ:

**Bảng đạt 1NF nhưng chưa đạt 2NF:**
| StudentID | CourseID | CourseName | StudentName | Grade |
|-----------|----------|-------------|-------------|-------|
| S001 | C001 | Math | Nguyen A | 8.5 |
| S001 | C002 | Physics | Nguyen A | 7.0 |
| S002 | C001 | Math | Tran B | 9.0 |
| S002 | C003 | Chemistry | Tran B | 8.0 |

**Vấn đề:** Khóa chính là tổ hợp (StudentID, CourseID), nhưng CourseName chỉ phụ thuộc vào CourseID, và StudentName chỉ phụ thuộc vào StudentID.

**Bảng đã đạt 2NF:**

1. Bảng Students:
   | StudentID | StudentName |
   |-----------|-------------|
   | S001 | Nguyen A |
   | S002 | Tran B |

2. Bảng Courses:
   | CourseID | CourseName |
   |----------|-------------|
   | C001 | Math |
   | C002 | Physics |
   | C003 | Chemistry |

3. Bảng Enrollments:
   | StudentID | CourseID | Grade |
   |-----------|----------|-------|
   | S001 | C001 | 8.5 |
   | S001 | C002 | 7.0 |
   | S002 | C001 | 9.0 |
   | S002 | C003 | 8.0 |

### 3. Dạng chuẩn 3 (3NF - Third Normal Form)

#### Vai trò:

- Đã đạt 2NF
- Loại bỏ các phụ thuộc hàm bắc cầu (transitive dependency): các thuộc tính không khóa không được phụ thuộc vào thuộc tính không khóa khác

#### Ví dụ:

**Bảng đạt 2NF nhưng chưa đạt 3NF:**
| DepartmentID | DepartmentName | ManagerID | ManagerName | ManagerStartDate |
|--------------|----------------|-----------|-------------|------------------|
| D001 | IT | M001 | Le Van C | 2022-01-15 |
| D002 | Sales | M002 | Pham Thi D | 2020-06-22 |

**Vấn đề:** ManagerName và ManagerStartDate phụ thuộc vào ManagerID (không phải khóa chính), tạo ra phụ thuộc bắc cầu.

**Bảng đã đạt 3NF:**

1. Bảng Departments:
   | DepartmentID | DepartmentName | ManagerID |
   |--------------|----------------|-----------|
   | D001 | IT | M001 |
   | D002 | Sales | M002 |

2. Bảng Managers:
   | ManagerID | ManagerName | ManagerStartDate |
   |-----------|-------------|------------------|
   | M001 | Le Van C | 2022-01-15 |
   | M002 | Pham Thi D | 2020-06-22 |

## Dạng chuẩn Boyce-Codd (BCNF)

BCNF là một dạng chuẩn mạnh hơn 3NF. Một quan hệ đạt BCNF nếu mọi phụ thuộc hàm X → Y, thì X phải là siêu khóa (superkey).

### Ví dụ:

**Bảng đạt 3NF nhưng chưa đạt BCNF:**
| StudentID | CourseID | Professor |
|-----------|----------|-----------|
| S001 | C001 | Prof. X |
| S002 | C001 | Prof. X |
| S001 | C002 | Prof. Y |
| S002 | C003 | Prof. Z |

Giả sử rằng:

- (StudentID, CourseID) là khóa chính
- Mỗi khóa học chỉ được dạy bởi một giáo sư: CourseID → Professor
- Giáo sư chỉ dạy một khóa học: Professor → CourseID

**Vấn đề:** CourseID là thuộc tính không khóa nhưng lại quyết định giá trị của Professor.

**Bảng đã đạt BCNF:**

1. Bảng Course_Professor:
   | CourseID | Professor |
   |----------|-----------|
   | C001 | Prof. X |
   | C002 | Prof. Y |
   | C003 | Prof. Z |

2. Bảng Student_Course:
   | StudentID | CourseID |
   |-----------|----------|
   | S001 | C001 |
   | S002 | C001 |
   | S001 | C002 |
   | S002 | C003 |

## 5. Dạng chuẩn 4 (4NF) và 5 (5NF)

Các dạng chuẩn 4NF và 5NF xử lý các vấn đề phức tạp hơn liên quan đến phụ thuộc đa trị (multivalued dependency) và kết nối (join dependency).

## Lợi ích của việc chuẩn hóa CSDL

1. **Giảm dư thừa dữ liệu**: Mỗi loại thông tin chỉ được lưu trữ một lần.
2. **Tránh dị thường khi thêm dữ liệu**: Có thể thêm thông tin mới mà không cần phụ thuộc vào dữ liệu khác.
3. **Tránh dị thường khi cập nhật**: Chỉ cần cập nhật thông tin tại một nơi.
4. **Tránh dị thường khi xóa**: Không làm mất thông tin liên quan khi xóa dữ liệu ở một bảng.
5. **Tính nhất quán dữ liệu**: Dữ liệu luôn được đảm bảo tính nhất quán trong toàn bộ hệ thống.
6. **Hiệu suất truy vấn tốt hơn**: Các bảng nhỏ hơn nên việc tìm kiếm và truy vấn nhanh hơn.

## Kết luận

Các dạng chuẩn trong thiết kế CSDL quan hệ là những quy tắc giúp tổ chức dữ liệu một cách hiệu quả, giảm thiểu dư thừa và đảm bảo tính nhất quán. Việc chuẩn hóa CSDL đến một mức độ phù hợp (thường là 3NF hoặc BCNF) là một thực hành tốt trong thiết kế cơ sở dữ liệu.

Tuy nhiên, trong một số trường hợp thực tế, người ta có thể chấp nhận một số dư thừa có kiểm soát để tối ưu hóa hiệu suất truy vấn, đặc biệt trong các hệ thống có tần suất đọc cao và tần suất cập nhật thấp. Quá trình này được gọi là phi chuẩn hóa (denormalization).

## Phương pháp xác định dạng chuẩn và chuẩn hóa CSDL

### 1. Cách xác định dạng chuẩn hiện tại của bảng

Để xác định một bảng đang ở dạng chuẩn nào, cần thực hiện các bước sau:

#### Bước 1: Xác định các thuộc tính của bảng và khóa chính

- Liệt kê tất cả các cột trong bảng
- Xác định khóa chính (đơn hoặc tổ hợp)

#### Bước 2: Xác định tất cả các phụ thuộc hàm

- Phân tích dữ liệu và yêu cầu nghiệp vụ
- Liệt kê tất cả các phụ thuộc hàm theo dạng X → Y

#### Bước 3: Kiểm tra các tiêu chí theo thứ tự

1. **Kiểm tra 1NF**:

   - Mỗi thuộc tính có chứa giá trị đơn (atomic) không?
   - Không có thuộc tính lặp lại hoặc nhóm lặp lại?
   - Có khóa chính được xác định?

2. **Kiểm tra 2NF** (nếu đã đạt 1NF):

   - Nếu khóa chính là khóa đơn, bảng đã đạt 2NF
   - Nếu khóa chính là khóa tổ hợp, kiểm tra các thuộc tính không khóa có phụ thuộc đầy đủ vào khóa chính không, hay chỉ phụ thuộc vào một phần của khóa?

3. **Kiểm tra 3NF** (nếu đã đạt 2NF):

   - Có thuộc tính không khóa nào phụ thuộc vào thuộc tính không khóa khác không?
   - Tìm các phụ thuộc hàm bắc cầu: X → Y → Z

4. **Kiểm tra BCNF** (nếu đã đạt 3NF):
   - Với mọi phụ thuộc hàm X → Y, X có phải là siêu khóa không?
   - Hay có trường hợp nào mà thuộc tính không khóa quyết định một thuộc tính khác?

### 2. Quy trình chuẩn hóa từ dạng thấp lên dạng cao hơn

#### 2.1. Chuẩn hóa từ bảng chưa chuẩn lên 1NF

1. **Xác định và loại bỏ các giá trị đa trị**:

   - Tách thành nhiều hàng để mỗi ô chỉ chứa một giá trị
   - Ví dụ: Tách Courses = "Math, Physics" thành hai hàng riêng biệt

2. **Xác định khóa chính** nếu chưa có

#### 2.2. Chuẩn hóa từ 1NF lên 2NF

1. **Xác định các phụ thuộc hàm bộ phận**:

   - Tìm các thuộc tính chỉ phụ thuộc vào một phần của khóa tổ hợp

2. **Phân tách thành nhiều bảng**:
   - Tạo bảng riêng cho mỗi phần của khóa tổ hợp với các thuộc tính phụ thuộc vào nó
   - Giữ lại bảng với khóa tổ hợp và các thuộc tính phụ thuộc đầy đủ

#### 2.3. Chuẩn hóa từ 2NF lên 3NF

1. **Xác định các phụ thuộc hàm bắc cầu**:

   - Tìm các thuộc tính không khóa phụ thuộc vào thuộc tính không khóa khác

2. **Phân tách thành nhiều bảng**:
   - Tạo bảng mới cho các thuộc tính có quan hệ bắc cầu
   - Giữ lại bản gốc với khóa chính và các thuộc tính phụ thuộc trực tiếp vào khóa

#### 2.4. Chuẩn hóa từ 3NF lên BCNF

1. **Xác định các phụ thuộc hàm có vế trái không phải siêu khóa**:

   - Tìm các X → Y trong đó X không phải siêu khóa

2. **Phân tách thành nhiều bảng**:
   - Tách thành bảng (X, Y) và bảng (X, các thuộc tính còn lại)
   - Loại bỏ Y từ bảng thứ hai

### 3. Ví dụ thực tế về quy trình chuẩn hóa

Xét bảng dữ liệu về hệ thống quản lý thư viện:

**Bảng ban đầu: Library_Records**

| BookID | BookTitle  | AuthorID | AuthorName | PublisherID | PublisherName | PublisherCity | StudentID | StudentName | BorrowDate | ReturnDate |
| ------ | ---------- | -------- | ---------- | ----------- | ------------- | ------------- | --------- | ----------- | ---------- | ---------- |
| B001   | SQL Basics | A001     | Nguyen A   | P001        | Tech Books    | Ha Noi        | S001      | Tran X      | 2025-05-01 | 2025-05-15 |
| B002   | Java Pro   | A002     | Le B       | P001        | Tech Books    | Ha Noi        | S001      | Tran X      | 2025-05-01 | 2025-05-15 |
| B001   | SQL Basics | A001     | Nguyen A   | P001        | Tech Books    | Ha Noi        | S002      | Pham Y      | 2025-05-10 | 2025-05-25 |
| B003   | Web Dev    | A002     | Le B       | P002        | Education Co  | Ho Chi Minh   | S003      | Hoang Z     | 2025-05-12 | 2025-05-27 |

#### Bước 1: Xác định phụ thuộc hàm

- BookID → BookTitle, AuthorID
- AuthorID → AuthorName
- PublisherID → PublisherName, PublisherCity
- StudentID → StudentName
- BookID, StudentID → BorrowDate, ReturnDate

#### Bước 2: Kiểm tra 1NF

Bảng đã đạt 1NF vì:

- Mỗi ô chứa một giá trị đơn
- Không có nhóm lặp lại
- Có khóa chính (BookID, StudentID)

#### Bước 3: Chuẩn hóa lên 2NF

Bảng chưa đạt 2NF vì:

- BookTitle phụ thuộc vào một phần của khóa chính (BookID)
- AuthorID, AuthorName phụ thuộc vào một phần của khóa chính (BookID)
- PublisherID, PublisherName, PublisherCity phụ thuộc vào một phần của khóa chính (BookID)
- StudentName phụ thuộc vào một phần của khóa chính (StudentID)

Tách thành các bảng:

1. **Books**
   | BookID | BookTitle | AuthorID | PublisherID |
   |--------|-----------|----------|-------------|
   | B001 | SQL Basics| A001 | P001 |
   | B002 | Java Pro | A002 | P001 |
   | B003 | Web Dev | A002 | P002 |

2. **Authors**
   | AuthorID | AuthorName |
   |----------|------------|
   | A001 | Nguyen A |
   | A002 | Le B |

3. **Publishers**
   | PublisherID | PublisherName | PublisherCity |
   |-------------|---------------|---------------|
   | P001 | Tech Books | Ha Noi |
   | P002 | Education Co | Ho Chi Minh |

4. **Students**
   | StudentID | StudentName |
   |-----------|-------------|
   | S001 | Tran X |
   | S002 | Pham Y |
   | S003 | Hoang Z |

5. **Borrowings**
   | BookID | StudentID | BorrowDate | ReturnDate |
   |--------|-----------|------------|------------|
   | B001 | S001 | 2025-05-01 | 2025-05-15 |
   | B002 | S001 | 2025-05-01 | 2025-05-15 |
   | B001 | S002 | 2025-05-10 | 2025-05-25 |
   | B003 | S003 | 2025-05-12 | 2025-05-27 |

#### Bước 4: Kiểm tra 3NF

Kiểm tra xem còn phụ thuộc hàm bắc cầu không:

- Trong bảng Books: BookID → AuthorID → AuthorName (phụ thuộc bắc cầu)
- Trong bảng Books: BookID → PublisherID → PublisherName, PublisherCity (phụ thuộc bắc cầu)

Nhưng các phụ thuộc bắc cầu này đã được xử lý khi tách thành các bảng riêng biệt. Các bảng hiện tại đã đạt 3NF.

#### Bước 5: Kiểm tra BCNF

Xem xét mỗi bảng:

- Books: Với mọi phụ thuộc hàm, vế trái đều là khóa (BookID)
- Authors: Với mọi phụ thuộc hàm, vế trái đều là khóa (AuthorID)
- Publishers: Với mọi phụ thuộc hàm, vế trái đều là khóa (PublisherID)
- Students: Với mọi phụ thuộc hàm, vế trái đều là khóa (StudentID)
- Borrowings: Với mọi phụ thuộc hàm, vế trái đều là khóa (BookID, StudentID)

Tất cả các bảng đã đạt BCNF.

### 4. Lưu ý khi chuẩn hóa CSDL

1. **Cân nhắc hiệu suất**: Đôi khi chuẩn hóa hoàn toàn có thể làm giảm hiệu suất truy vấn do cần JOIN nhiều bảng

2. **Cân nhắc phi chuẩn hóa có kiểm soát**: Trong một số trường hợp, có thể chấp nhận dư thừa có kiểm soát để tối ưu hiệu suất đọc

3. **Đảm bảo tính toàn vẹn dữ liệu**: Khi tách bảng, phải đảm bảo thiết lập đúng các ràng buộc khóa ngoại

4. **Hiểu rõ ngữ cảnh nghiệp vụ**: Không phải lúc nào cũng cần chuẩn hóa đến mức cao nhất, tùy thuộc vào yêu cầu thực tế
