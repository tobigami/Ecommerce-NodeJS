'use strict';

class UserService {
	static getInfo = async (userId) => {
		console.log('get user info', userId);

		return {
			name: 'John Doe',
			age: 30,
			id: userId,
			email: 'john.doe@example.com',
			birthday: '12-12-2022',
			phoneNumber: '0918273645',
			displayName: 'Black cat',
			username: 'sephiroth',
			address: '123 Main'
		};
	};
}

module.exports = UserService;
