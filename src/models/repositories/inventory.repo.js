const inventoryModel = require('../inventory.model');

const insertInventory = async ({ productId, shopId, stock, location = 'unKnow' }) => {
	return inventoryModel.create({
		inven_productId: productId,
		inven_location: location,
		inven_shopId: shopId,
		inven_stock: stock,
	});
};

const reservationInventory = async ({ productId, quantity, cardId }) => {
	const query = {
			inven_productId: productId,
			inven_stock: { $gte: quantity },
		},
		updateSet = {
			$inc: {
				inven_stock: -quantity,
			},
			$push: {
				inven_reservations: {
					cardId: cardId,
					quantity: quantity,
					createOn: new Date(),
				},
			},
		},
		options = {
			new: true,
			upsert: true,
		};

	return await inventoryModel.updateOne(query, updateSet, options);
};

module.exports = {
	insertInventory,
	reservationInventory,
};
