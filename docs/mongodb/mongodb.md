# MongoDB Commands Reference

## 1. Database Operations

### Hiển thị danh sách databases

```shell
show dbs;
```

### Chọn database để làm việc

```shell
use db_name;
```

### Hiển thị collections trong database hiện tại

```shell
show collections;
```

## 2. Document Operations

### Đếm số lượng documents

```shell
db.customers.countDocuments({});
```

### Hiển thị documents (có giới hạn)

```shell
db.customers.find().limit(5);
```

### Tìm kiếm documents với điều kiện

```shell
db.customers.find({age: 20});
```

## 3. Index Management

### Kiểm tra indexes hiện có

```shell
db.customers.getIndexes();
```

### Xóa index

```shell
db.customers.dropIndex("idx_age");
```

## 4. Query Performance Analysis

### Xem chiến lược thực thi của câu lệnh

```shell
db.customers.find({age: 20}).explain("executionStats");
```

### Các thông số quan trọng cần kiểm tra trong executionStats:

| Thông số                       | Mô tả                                 |
| ------------------------------ | ------------------------------------- |
| `totalDocsExamined`            | Số lượng bản ghi phải quét            |
| `nReturned`                    | Số lượng document kết quả trả về      |
| `executionTimeMillis`          | Thời gian để hoàn thành câu lệnh (ms) |
| `winningPlan.inputStage.stage` | Giải thuật được sử dụng để query      |

### Các loại execution stages phổ biến:

- **COLLSCAN**: Quét toàn bộ collection (không tối ưu)
- **IXSCAN**: Sử dụng index để tìm kiếm (tối ưu)
- **FETCH**: Lấy document từ disk sau khi tìm thấy qua index

## 5. Best Practices

### Performance Tips:

1. **Luôn sử dụng index** cho các trường thường xuyên query
2. **Kiểm tra execution plan** trước khi deploy query lên production
3. **Giới hạn số lượng documents** trả về với `.limit()`
4. **Sử dụng projection** để chỉ lấy các field cần thiết

### Example với projection:

```shell
db.customers.find({age: 20}, {name: 1, email: 1, _id: 0}).limit(10);
```
