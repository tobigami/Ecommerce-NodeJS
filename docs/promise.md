# Tìm Hiểu Về Promise Trong Node.js

## Giới thiệu về Promise

Promise là một đối tượng đại diện cho kết quả của một hoạt động bất đồng bộ (asynchronous), có thể hoàn thành (fulfilled) hoặc thất bại (rejected) trong tương lai. Promise giúp xử lý các tác vụ bất đồng bộ một cách dễ dàng và hiệu quả hơn so với callback truyền thống, tránh được "callback hell".

### Cú pháp cơ bản

```javascript
const promise = new Promise((resolve, reject) => {
  // Thực hiện các hoạt động bất đồng bộ
  if (/* điều kiện thành công */) {
    resolve(value); // Thành công và trả về giá trị
  } else {
    reject(error); // Thất bại và trả về lỗi
  }
});

// Sử dụng promise
promise
  .then(value => {
    // Xử lý khi promise hoàn thành thành công
  })
  .catch(error => {
    // Xử lý khi promise thất bại
  })
  .finally(() => {
    // Luôn được thực thi, bất kể thành công hay thất bại
  });
```

### Trạng thái của Promise

Promise có ba trạng thái:

1. **Pending**: Trạng thái khởi tạo, promise chưa hoàn thành hoặc thất bại
2. **Fulfilled**: Hoạt động đã hoàn thành thành công
3. **Rejected**: Hoạt động thất bại

## Các Phương Thức Tĩnh Của Promise

### 1. Promise.all()

`Promise.all()` nhận một mảng các promise và trả về một promise mới. Promise mới này sẽ hoàn thành khi **tất cả** các promise trong mảng đều hoàn thành, hoặc sẽ thất bại ngay khi **có bất kỳ** promise nào trong mảng thất bại.

```javascript
const promise1 = Promise.resolve(1);
const promise2 = new Promise((resolve) => setTimeout(() => resolve(2), 100));
const promise3 = new Promise((resolve) => setTimeout(() => resolve(3), 200));

Promise.all([promise1, promise2, promise3])
  .then(values => {
    console.log(values); // [1, 2, 3]
  })
  .catch(error => {
    console.error(error); // Nếu có bất kỳ promise nào reject
  });
```

**Đặc điểm:**
- Trả về kết quả là mảng các giá trị theo đúng thứ tự của các promise đầu vào
- Nếu một promise thất bại, `Promise.all()` sẽ reject ngay lập tức với lỗi của promise đầu tiên bị thất bại
- Phù hợp khi cần đảm bảo tất cả các thao tác bất đồng bộ đều hoàn thành thành công

### 2. Promise.allSettled()

`Promise.allSettled()` cũng nhận một mảng các promise, nhưng sẽ luôn hoàn thành sau khi **tất cả** các promise đã hoàn thành (dù thành công hay thất bại). Kết quả trả về là một mảng các đối tượng mô tả kết quả của từng promise.

```javascript
const promise1 = Promise.resolve(1);
const promise2 = Promise.reject('Lỗi');
const promise3 = new Promise((resolve) => setTimeout(() => resolve(3), 100));

Promise.allSettled([promise1, promise2, promise3])
  .then(results => {
    console.log(results);
    // [
    //   { status: "fulfilled", value: 1 },
    //   { status: "rejected", reason: "Lỗi" },
    //   { status: "fulfilled", value: 3 }
    // ]
  });
```

**Đặc điểm:**
- Luôn hoàn thành thành công, không bao giờ reject
- Trả về thông tin chi tiết về trạng thái (status) và giá trị/lỗi (value/reason) của từng promise
- Phù hợp khi cần biết kết quả của tất cả các thao tác bất đồng bộ, kể cả khi có lỗi xảy ra

### 3. Promise.race()

`Promise.race()` nhận một mảng các promise và trả về một promise mới. Promise mới này sẽ hoàn thành hoặc thất bại ngay khi có **promise đầu tiên** trong mảng hoàn thành hoặc thất bại.

```javascript
const promise1 = new Promise((resolve) => setTimeout(() => resolve('nhanh'), 100));
const promise2 = new Promise((resolve) => setTimeout(() => resolve('chậm'), 500));

Promise.race([promise1, promise2])
  .then(value => {
    console.log(value); // 'nhanh', vì promise1 hoàn thành trước
  })
  .catch(error => {
    console.error(error); // Nếu promise đầu tiên hoàn thành là một rejection
  });
```

**Đặc điểm:**
- Chỉ quan tâm đến promise đầu tiên hoàn thành (dù thành công hay thất bại)
- Kết quả trả về là giá trị hoặc lỗi của promise đầu tiên đó
- Phù hợp cho các tác vụ timeout hoặc khi chỉ cần kết quả nhanh nhất

### 4. Promise.any()

`Promise.any()` nhận một mảng các promise và trả về một promise mới. Promise mới này sẽ hoàn thành ngay khi có **promise đầu tiên** trong mảng hoàn thành thành công. Nếu tất cả các promise đều thất bại, nó sẽ reject với một `AggregateError`.

```javascript
const promise1 = Promise.reject('Lỗi 1');
const promise2 = new Promise((resolve) => setTimeout(() => resolve('thành công'), 100));
const promise3 = Promise.reject('Lỗi 3');

Promise.any([promise1, promise2, promise3])
  .then(value => {
    console.log(value); // 'thành công', vì promise2 là promise đầu tiên hoàn thành thành công
  })
  .catch(error => {
    console.error(error); // AggregateError nếu tất cả promise đều thất bại
  });
```

**Đặc điểm:**
- Trả về giá trị của promise đầu tiên hoàn thành thành công
- Chỉ reject khi tất cả các promise đều thất bại
- Phù hợp khi cần kết quả từ bất kỳ nguồn nào hoàn thành thành công đầu tiên

## So Sánh Các Phương Thức Của Promise

| Phương thức | Khi nào hoàn thành | Khi nào thất bại | Kết quả trả về | Trường hợp sử dụng |
|-------------|-------------------|-----------------|---------------|-------------------|
| `Promise.all()` | Khi tất cả promise hoàn thành | Ngay khi có bất kỳ promise nào thất bại | Mảng các giá trị | Khi cần tất cả các tác vụ đều hoàn thành thành công |
| `Promise.allSettled()` | Luôn hoàn thành khi tất cả promise đã xử lý xong | Không bao giờ thất bại | Mảng các đối tượng mô tả trạng thái | Khi cần biết kết quả của tất cả các tác vụ, bất kể thành công hay thất bại |
| `Promise.race()` | Khi promise đầu tiên hoàn thành | Khi promise đầu tiên thất bại | Giá trị/lỗi của promise đầu tiên | Khi cần kết quả nhanh nhất hoặc thiết lập timeout |
| `Promise.any()` | Khi có bất kỳ promise nào hoàn thành thành công | Khi tất cả promise đều thất bại | Giá trị của promise thành công đầu tiên | Khi cần ít nhất một tác vụ hoàn thành thành công |

## Ví Dụ Thực Tế

### Ví dụ với Promise.all()
```javascript
// Tải nhiều dữ liệu từ các API khác nhau
async function fetchAllData() {
  try {
    const [users, products, orders] = await Promise.all([
      fetch('/api/users').then(res => res.json()),
      fetch('/api/products').then(res => res.json()),
      fetch('/api/orders').then(res => res.json())
    ]);
    
    console.log('Tất cả dữ liệu đã được tải:', { users, products, orders });
    return { users, products, orders };
  } catch (error) {
    console.error('Có lỗi khi tải dữ liệu:', error);
    throw error;
  }
}
```

### Ví dụ với Promise.allSettled()
```javascript
// Thử gửi thông báo đến nhiều người dùng, kể cả khi có người thất bại
async function sendNotificationToAll(userIds) {
  const notificationPromises = userIds.map(id => 
    sendNotification(id).catch(error => ({
      userId: id,
      error: error.message
    }))
  );
  
  const results = await Promise.allSettled(notificationPromises);
  
  const successful = results.filter(r => r.status === 'fulfilled').length;
  const failed = results.filter(r => r.status === 'rejected').length;
  
  console.log(`Đã gửi thành công ${successful} thông báo, thất bại ${failed} thông báo`);
  return results;
}
```

### Ví dụ với Promise.race()
```javascript
// Thiết lập timeout cho một request API
function fetchWithTimeout(url, timeout = 5000) {
  const fetchPromise = fetch(url).then(res => res.json());
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Request timeout')), timeout)
  );
  
  return Promise.race([fetchPromise, timeoutPromise]);
}

// Sử dụng
fetchWithTimeout('https://api.example.com/data', 3000)
  .then(data => console.log('Dữ liệu:', data))
  .catch(error => console.error('Lỗi:', error.message));
```

### Ví dụ với Promise.any()
```javascript
// Lấy dữ liệu từ server nhanh nhất
async function fetchFromFastestServer() {
  const servers = [
    'https://server1.example.com/data',
    'https://server2.example.com/data',
    'https://server3.example.com/data'
  ];
  
  try {
    const data = await Promise.any(
      servers.map(server => fetch(server).then(res => res.json()))
    );
    console.log('Dữ liệu từ server nhanh nhất:', data);
    return data;
  } catch (error) {
    console.error('Tất cả các server đều thất bại:', error);
    throw new Error('Không thể kết nối đến bất kỳ server nào');
  }
}
```

## Kết Luận

Promise là một công cụ mạnh mẽ trong JavaScript để xử lý các tác vụ bất đồng bộ. Các phương thức tĩnh như `Promise.all()`, `Promise.allSettled()`, `Promise.race()`, và `Promise.any()` cung cấp các cách khác nhau để kết hợp và điều khiển nhiều promise, phù hợp với các tình huống khác nhau:

- `Promise.all()`: Khi cần tất cả các tác vụ đều thành công.
- `Promise.allSettled()`: Khi cần biết kết quả của tất cả các tác vụ, bất kể thành công hay thất bại.
- `Promise.race()`: Khi chỉ cần kết quả của tác vụ nhanh nhất hoặc muốn thiết lập timeout.
- `Promise.any()`: Khi cần ít nhất một tác vụ hoàn thành thành công.

Việc hiểu rõ và sử dụng đúng các phương thức này sẽ giúp tối ưu hóa và nâng cao chất lượng code bất đồng bộ trong ứng dụng Node.js của bạn.
