**Q1**

```sql
DELETE FROM feeds WHERE id = 1 AND delete_at is NULL;
```

```sql
DELETE FROM feeds WHERE id = 1 AND delete_at = 0;
```

- 2 câu lệnh này khác gì ở điểm gì, và câu lệnh nào sẽ cho hiệu năng tối ưu hơn ?
- trong rule 3 khi su dung soft delete thì làm thế nào để có thể config được sau bao ngày thì những record đã được soft delete sẽ xóa vĩnh viên sau bao ngày ?

---
**Q2**

Tại sao table chưa 1 lúc nhiều field thì lại gây ra hiệu suất kém ?
video demo: https://www.youtube.com/watch?v=2sfOGqLKXq8

- Nếu 1 bảng quá 20 thì nên tìm cách tách bảng ra
- Sử giữ lại các field thường xuyên xuất hiện ví dụ như title, status, price .. 
- Còn những field ít xuất hiện hơn như des, tag, content thì tách ra thành 1 bảng detail.

- when sharding data base video demo: https://www.youtube.com/watch?v=xya2ClZWbNM

- 1 table khi quá 5m hoặc 2G thì sẽ tách table (chia ngang ) ví dụ 1 bảng có 10 triệu thì tách ra thành 2 bảng mỗi bảng 5 triệu 
- Chia dọc là t table có 10 field thì chia ra mỗi table sẽ có 5 field, và 2 table vẫn giữ nguyên số lượng record 

---

- Nguyên tắc khi đánh index là dùng cho những dữ liệu ít trùng lặp
- Những field luôn luôn đánh là 
  - created_at
  - delete_at

---
rule 9 3NF
video docs: https://www.youtube.com/watch?v=-N3x7ESpHrQ&t=75s