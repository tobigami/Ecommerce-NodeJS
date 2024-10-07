'use strict';
const _ = require('lodash');
const { Types } = require('mongoose');

const getInfoData = ({ fields = [], object = {} }) => {
	return _.pick(object, fields);
};

// ['a', 'b'] => {a: 1, b: 1}
const getSelectData = (select = []) => {
	return Object.fromEntries(select.map((el) => [el, 1]));
};

// ['a', 'b'] => {a: 0, b: 0}
const unGetSelectData = (select = []) => {
	return Object.fromEntries(select.map((el) => [el, 0]));
};

// { a: 'a', b: null, c: { d: 'd', e: undefined }} => { a: 'a', c: { d: 'd'}}
const removeUndefinedObject = (obj) => {
	Object.keys(obj).forEach((k) => {
		if (obj[k] == null || obj[k] === 'undefined') {
			delete obj[k];
		} else if (typeof obj[k] === 'object' && !Array.isArray(obj[k])) {
			removeUndefinedObject(obj[k]);
		}
	});
	return obj;
};

const updateNestedObjectParse = (obj) => {
	const result = {};
	Object.keys(obj).forEach((k) => {
		if (typeof obj[k] === 'object' && !Array.isArray(obj[k])) {
			const res = updateNestedObjectParse(obj[k]);
			Object.keys(res).forEach((a) => {
				result[`${k}.${a}`] = res[a];
			});
		} else {
			result[k] = obj[k];
		}
	});
	return result;
};

const convertToObjectIdMongodb = (id) => new Types.ObjectId(id);

module.exports = {
	getInfoData,
	getSelectData,
	unGetSelectData,
	removeUndefinedObject,
	updateNestedObjectParse,
	convertToObjectIdMongodb
};
