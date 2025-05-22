'use strict';

const tarotModel = require('../tarot.model');
const tarotFeedbackModel = require('../tarot.feedback.model');

const tarotAdd = async ({ name, age, question, ip, isDev, result }) => {
	return await tarotModel.create({
		name: name,
		question: question,
		age: age,
		ip: ip,
		isDev: isDev,
		result: result,
	});
};

const addTarotFeedback = async ({ name, age, content }) => {
	return await tarotFeedbackModel.create({
		name: name,
		age: age,
		content: content || '',
	});
};

module.exports = { tarotAdd, addTarotFeedback };
