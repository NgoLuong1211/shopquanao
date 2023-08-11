const _Revenue = require('../models/revenue.model')
const _User = require('../models/users.model');
const _Product = require('../models/product.model');
const _Category = require('../models/category.model');
const _Supplier = require('../models/supplier.model');
const _Size = require('../models/Size.model');
const _Color = require('../models/Color.model')
const _Oder = require('../models/order.model');
const _OderDetail = require('../models/order_detail.model');

var that = module.exports = {
    detailProduct: async({
        id
    }) => {
        const products = await _Product.find({productID: id})
        if (!products) {
            return {
                code: 404,
                message: 'not found'
            }
        } else {
            return {
                code: 200,
                element: products
            }
        }
    },
    
    createProduct: async({
        productID,
        title,
        categoryID,
        price,
        discount,
        supplierID,
        size,
        image,
        quantity,
        couleur,
        description
    }) => {
        await _Product.create({
            productID: productID,
            title: title,
            category_id: categoryID,
            price: price,
            discount: discount,
            supplier_id: supplierID,
            size: size,
            image: image,
            quantity: quantity,
            couleur: couleur,
            description: description
        })
    }
}