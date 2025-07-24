[video]('https://www.youtube.com/watch?v=D6-xKguNpWg&list=PLw0w5s5b9NK5xE6lmH85ge8dFXHheYV2o&index=4')

## 4 Vấn đề cần phải làm rõ
1. Vì sao ứng dụng x tháng lại cần đổi password 1 lần ?
   - Vì mk của người dùng luôn tiềm ẩn rủi ro bị rò rỉ, và người dùng thường có thói quen đặt mk của nhiều accout giống nhau, nên để hạn chế việc này thì việc thay đỏi mk thường xuyên là giúp bảo vệ người dùng
2. Pass mới không được giống pass cũ ?
   - Vì ở trên đã cần phải yêu cầu thay đổi mk sau x tháng mà mk thay đổi lại giống với mk cũ thì vô tác dụng
3. So sánh pass mới và pass cũ ntn do pass cũ đã được hash ?
   - Trong hệ thống sẽ lưu lại hash_old_pass và so sánh với hash_new_pass nếu trùng nhau thì nghĩa là mk mới và cũ giống nhau
4. Vì sao thuật toán hash có sức mạnh bảo mật