- khi order thì cần check những thứ sau
  1. Kiểm tra xem order có đúng hay không
  2. Kiểm tra xem số lượng hàng tồn tại trong stock có đủ hay không
- sử dụng optimistic lock (khóa lạc quan) để tránh xảy ra hiện tượng quá bán
  khóa này sẽ chặn các luồng đi của nhiều luồng cho phép 1 luông đi vào xong trả về lại giá trị rồi mới đến các luồng khác
-
