// Function to generate a random string of specified length
function randomString(length) {
	const chars = 'abcdefghijklmnopqrstuvwxyz';
	let result = '';
	for (let i = 0; i < length; i++) {
		result += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return result;
}

// Function to generate a random name
function randomName() {
	const firstNames = [
		'Anh',
		'Binh',
		'Cuc',
		'Dung',
		'Hai',
		'Hoa',
		'Khanh',
		'Lan',
		'Minh',
		'Nam',
		'Phong',
		'Quyen',
		'Son',
		'Thuy',
		'Van',
		'Xuan',
		'John',
		'Mary',
		'David',
		'Sarah',
		'Michael',
		'Lisa',
		'Robert',
		'Emma',
		'William',
		'Olivia',
	];

	const lastNames = [
		'Nguyen',
		'Tran',
		'Le',
		'Pham',
		'Hoang',
		'Huynh',
		'Vu',
		'Vo',
		'Phan',
		'Truong',
		'Smith',
		'Johnson',
		'Brown',
		'Lee',
		'Garcia',
		'Miller',
		'Davis',
		'Rodriguez',
		'Martinez',
		'Wilson',
		'Anderson',
		'Taylor',
		'Thomas',
		'Moore',
		'Martin',
	];

	return (
		lastNames[Math.floor(Math.random() * lastNames.length)] +
		' ' +
		firstNames[Math.floor(Math.random() * firstNames.length)]
	);
}

// Function to generate a random email
function randomEmail(name) {
	const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'example.com'];
	const nameNoSpace = name.toLowerCase().replace(/\s+/g, '.');
	return (
		nameNoSpace +
		Math.floor(Math.random() * 1000) +
		'@' +
		domains[Math.floor(Math.random() * domains.length)]
	);
}

// Function to generate a random age between 18 and 80
function randomAge() {
	return Math.floor(Math.random() * (80 - 18 + 1)) + 18;
}

// Function to generate a random phone number
function randomPhone() {
	return '0' + Math.floor(Math.random() * 10) + Math.random().toString().slice(2, 10);
}

// Function to generate a random address
function randomAddress() {
	const streets = ['Nguyen Hue', 'Le Loi', 'Tran Hung Dao', 'Vo Van Kiet', 'Phan Xich Long'];
	const cities = ['Ho Chi Minh', 'Ha Noi', 'Da Nang', 'Can Tho', 'Hue'];

	return (
		Math.floor(Math.random() * 200) +
		' ' +
		streets[Math.floor(Math.random() * streets.length)] +
		', ' +
		cities[Math.floor(Math.random() * cities.length)]
	);
}

// Main function to create customer documents
function generateCustomers(count) {
	const batchSize = 10000; // Insert documents in batches for better performance
	const totalBatches = Math.ceil(count / batchSize);

	print(`Starting to generate ${count} customer documents in ${totalBatches} batches...`);

	for (let batchNum = 0; batchNum < totalBatches; batchNum++) {
		const currentBatchSize = Math.min(batchSize, count - batchNum * batchSize);
		const customers = [];

		for (let i = 0; i < currentBatchSize; i++) {
			const name = randomName();
			const customer = {
				name: name,
				email: randomEmail(name),
				age: randomAge(),
				phone: randomPhone(),
				address: randomAddress(),
				createdAt: new Date(),
				isActive: Math.random() > 0.2, // 80% customers are active
			};
			customers.push(customer);
		}

		db.customers.insertMany(customers);
		print(
			`Batch ${batchNum + 1}/${totalBatches} completed: Inserted ${customers.length} documents`,
		);
	}

	print(`Finished generating ${count} customer documents.`);
}

// Run the generator with 5 million documents
print('Starting customer document generation...');
generateCustomers(5000000);
print('Customer document generation completed!');
