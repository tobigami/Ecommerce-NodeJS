'use strict';

const mongoose = require('mongoose');
const {
	db: { host, name },
} = require('../configs/config.mongodb');

// const connectString = `mongodb://${host}/${name}`;

// for mongodb atlas
const connectString = `mongodb+srv://root:123@cluster0.dikmvlw.mongodb.net/${name}?retryWrites=true&w=majority`;

const { countConnect } = require('../helper/check.connect');
class DataBase {
	constructor() {
		this.connect();
	}

	// connect
	connect(type = 'mongodb') {
		if (1 === 1) {
			// mongoose.set('debug', true);
			// mongoose.set('debug', { color: true });
		}
		mongoose
			.connect(connectString)
			.then((_) => {
				console.log('\x1b[35m connect Mongo DB:\x1b[32m success');
				countConnect();
			})
			.catch((err) => {
				console.log('connect mongoDB fail');
			});
	}

	static getInstance() {
		if (!DataBase.instance) {
			DataBase.instance = new DataBase();
		}

		return DataBase.instance;
	}
}

const instanceMongooseDB = DataBase.getInstance();
module.exports = instanceMongooseDB;
