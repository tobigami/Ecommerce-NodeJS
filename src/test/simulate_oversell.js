const axios = require('axios');

// Cấu hình chung
const API_URL = 'http://localhost:3055/v1/api/checkout/final'; // Thay đổi nếu endpoint của bạn khác
const CONCURRENT_REQUESTS = 5; // Số lượng yêu cầu đồng thời
const PRODUCT_ID_TO_TEST = '68254e230727d517bdb3621e'; // ID của sản phẩm có số lượng tồn kho thấp
const USER_ID = 1411;
const CART_ID = '682567d5e4b4d9608d4f426d';

// Payload cho API finalCheckoutByUser
const checkoutPayload = {
	cartId: '682567d5e4b4d9608d4f426d',
	userId: 1411,
	shopOrderIds: [
		{
			shopId: '6824be9d585aca2878b7c00b',
			shopDiscounts: ['s1-20', 's1-10'],
			itemProducts: [
				{
					productId: '68254e230727d517bdb3621e',
					price: 280,
					quantity: 8,
				},
			],
		},
		{
			shopId: '6824be9d585aca2878b7c00b',
			shopDiscounts: [],
			itemProducts: [
				{
					productId: '68254e450727d517bdb36232',
					price: 150,
					quantity: 2,
				},
			],
		},
	],
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
