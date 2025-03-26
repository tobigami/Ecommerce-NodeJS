async function testConcurrentRequests(productId, userId, numberOfRequests = 1000) {
	// Tạo mảng các promise để thực hiện các request
	const requests = Array.from({ length: numberOfRequests }, () => {
		const myHeaders = new Headers();
		myHeaders.append('Content-Type', 'application/json');

		const raw = JSON.stringify({
			productId: productId,
			userId: userId,
		});

		const requestOptions = {
			method: 'POST',
			headers: myHeaders,
			body: raw,
			redirect: 'follow',
		};

		return fetch('http://localhost:3055/v1/api/test/click/add', requestOptions)
			.then((response) => response.text())
			.catch((error) => {
				console.error(`Request failed: ${error}`);
				return null;
			});
	});

	// Đo thời gian bắt đầu
	const startTime = performance.now();

	// Thực hiện tất cả các request đồng thời
	const results = await Promise.allSettled(requests);

	// Đo thời gian kết thúc
	const endTime = performance.now();

	// Phân tích kết quả
	const successfulRequests = results.filter((result) => result.status === 'fulfilled' && result.value !== null).length;

	const failedRequests = results.filter((result) => result.status === 'rejected' || result.value === null).length;

	console.log(`Tổng số request: ${numberOfRequests}`);
	console.log(`Số request thành công: ${successfulRequests}`);
	console.log(`Số request thất bại: ${failedRequests}`);
	console.log(`Tổng thời gian thực hiện: ${(endTime - startTime).toFixed(2)} ms`);

	// In ra một số kết quả mẫu
	console.log('Một số kết quả mẫu:');
	results.slice(0, 5).forEach((result, index) => {
		console.log(`Request ${index + 1}: ${result.status === 'fulfilled' ? result.value : 'Failed'}`);
	});

	return results;
}

// Cách sử dụng
testConcurrentRequests(33, 222)
	.then((results) => {
		// Xử lý kết quả nếu cần
	})
	.catch((error) => {
		console.error('Lỗi trong quá trình thực thi:', error);
	});
