'use strict';

class UserService {
	static getInfo = async (userId) => {
		return {
			id: userId,
			email: 'john.doe@example.com',
			birthday: '12-12-2022',
			phoneNumber: '0918273645',
			displayName: 'Black cat',
			createTime: '',
			updateTime: '',
			deleteTime: '',
			username: 'Sephiroth',
			address: '123 Main'
		};
	};
}

module.exports = UserService;
