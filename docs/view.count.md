- giới hạn theo user-id
- Thời gian trung bình để đọc hết 1 trang tài liệu rơi vào khoảng 2-3phut (120s - 180s) || lấy 180
- Sử dụng redis và hash-redis tính atom trong redis (NX) only set the key if it does not already exist
- Only set the key if it does not already exist.
- Kiểm soát theo user-id là chưa đủ có, có thể thay thế nó bằng ip-address

- lấy ip-add bằng cách nào

1. getRemoteAddr() ip
2. lấy từ header x-forwarded-for
