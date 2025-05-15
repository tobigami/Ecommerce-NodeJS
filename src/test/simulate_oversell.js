const axios = require('axios');

// Cấu hình chung
const API_URL = 'http://localhost:3055/v1/api/checkout/order'; // Thay đổi nếu endpoint của bạn khác
const CONCURRENT_REQUESTS = 5; // Số lượng yêu cầu đồng thời
const PRODUCT_ID_TO_TEST = 'product_abc_123'; // ID của sản phẩm có số lượng tồn kho thấp
const USER_ID = 'user_test_1';
const CART_ID = 'cart_test_1';

// Dữ liệu mẫu cho một shop order - bạn cần điều chỉnh cho phù hợp với sản phẩm và shop của bạn
const sampleShopOrder = {
	shopId: 'shop_xyz_789', // ID của shop chứa sản phẩm
	shopDiscounts: [], // Mã giảm giá nếu có
	itemProducts: [
		{
			productId: PRODUCT_ID_TO_TEST,
			price: 100, // Giá sản phẩm (có thể không quan trọng bằng quantity cho test này)
			quantity: 1, // Số lượng mỗi người dùng cố gắng mua
		},
	],
};

// Payload cho API finalCheckoutByUser
const checkoutPayload = {
	cartId: CART_ID,
	userId: USER_ID,
	shopOrderIds: [sampleShopOrder],
	userAddress: { city: 'Test City', street: 'Test Street' },
	usePayment: { method: 'COD' },
};

// Headers (nếu cần, ví dụ: token xác thực)
const headers = {
	// 'x-api-key': 'YOUR_API_KEY',
	// 'authorization': 'Bearer YOUR_AUTH_TOKEN',
	// 'x-client-id': USER_ID
};

async function makeRequest(requestNumber) {
	console.log(`[Request ${requestNumber}] Sending checkout request...`);
	try {
		const response = await axios.post(API_URL, checkoutPayload, { headers });
		console.log(`[Request ${requestNumber}] Success:`, response.data);
	} catch (error) {
		if (error.response) {
			console.error(
				`[Request ${requestNumber}] Failed with status ${error.response.status}:`,
				error.response.data,
			);
		} else if (error.request) {
			console.error(
				`[Request ${requestNumber}] Failed: No response received. Is the server running?`,
				error.request,
			);
		} else {
			console.error(`[Request ${requestNumber}] Failed with error:`, error.message);
		}
	}
}

async function simulate() {
	console.log(
		`Simulating ${CONCURRENT_REQUESTS} concurrent checkouts for product ${PRODUCT_ID_TO_TEST}...`,
	);
	console.log('Ensure the product has a low stock (e.g., 1 or 2 units).');
	console.log('--------------------------------------------------------');

	const requests = [];
	for (let i = 1; i <= CONCURRENT_REQUESTS; i++) {
		requests.push(makeRequest(i));
	}

	await Promise.all(requests);
	console.log('--------------------------------------------------------');
	console.log('Simulation finished. Check server logs and database for results.');
}

simulate();
