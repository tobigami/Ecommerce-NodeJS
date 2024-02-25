const inventoryModel = require('../inventory.model');

const insertInventory = async ({ productId, shopId, stock, location = 'unKnow' }) => {
    return inventoryModel.create({
        inven_productId: productId,
        inven_location: location,
        inven_shopId: shopId,
        inven_stock: stock
    });
};

module.exports = {
    insertInventory
};
