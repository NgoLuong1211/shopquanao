const _User = require('../models/users.model');
const _Product = require('../models/product.model');
const _Category = require('../models/category.model');
const _Supplier = require('../models/supplier.model');
const _Size = require('../models/Size.model');
const _Color = require('../models/Color.model')
const _Oder = require('../models/order.model');
const _OderDetail = require('../models/order_detail.model');

var that = module.exports = {
    productDisplay: async({
        products
    }) => {
        try {
            const uniqueObjects = [];
            const fetchedProductIDs = [];
            products.forEach(obj => {
                if (!fetchedProductIDs.includes(obj.productID)) {
                  uniqueObjects.push(obj);
                  fetchedProductIDs.push(obj.productID);
                }
              });
            return uniqueObjects;
        } catch (error) {
            console.log(error)
        }
    },
    

}