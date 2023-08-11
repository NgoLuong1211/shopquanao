const _User = require('../models/users.model');
const _Product = require('../models/product.model');
const _Category = require('../models/category.model');
const _Supplier = require('../models/supplier.model');
const _Size = require('../models/Size.model');
const _Color = require('../models/Color.model');
const _Order = require('../models/order.model');
const _OrderDetail = require('../models/order_detail.model')
const _StatusOrder = require('../models/status_order.model')
const otpGenerator = require('otp-generator');

var that = module.exports = {
    buyNow: async ({
        productID,
        size
    }) => {
        const product = await _Product.findOne({ productID: productID, size: size });
        if (!product) {
            return {
                code: 404,
                message: 'not found'
            }
        } else {
            return {
                code: 200,
                element: product.id
            }
        }
    },
    checkoutpost: async ({
        userID,
        fullname,
        email,
        phone,
        address,
        note,
        quantity,
        productID
    }) => {
        let orderID = otpGenerator.generate(6, {
            digits: true,
            lowerCaseAlphabets: true,
            upperCaseAlphabets: false,
            specialChars: false
        });

        let existingOrder = await _Order.findOne({ otp: orderID });
      
        while (existingOrder) {
          orderID = otpGenerator.generate(6, {
            digits: true,
            lowerCaseAlphabets: true,
            upperCaseAlphabets: false,
            specialChars: false
        });
          existingOrder = await _Order.findOne({ otp: orderID });
        }
        const order = await _Order.create({
            orderID: orderID,
            user_id: userID,
            fullname: fullname,
            email: email,
            phone_number: phone,
            address: address,
            note: note,
            status: '64d574081519606f815686b4',
            total: 0
        })
        const product = await _Product.findOne({ _id: productID });
        const UpdateQuantity = product.quantity - quantity;
        const OrderDetail = await _OrderDetail.create({
            order_id: order.id,
            productName: product.title,
            productID: product.productID,
            size: product.size,
            color: product.couleur,
            price: product.price,
            quantity: quantity,
            total: product.price * quantity
        })
        await _Product.updateOne({_id: productID}, {quantity: UpdateQuantity})
    },
    historyBuy: async ({
        userID
    }) => {
        const order = await _Order.find({ user_id: userID }).populate('status');
        const OrderDetail = await _OrderDetail.find();
        const resultMap = {};

        OrderDetail.forEach((item) => {
            const { order_id, total } = item;
            if (resultMap[order_id]) {
                resultMap[order_id] += total;
            } else {
                resultMap[order_id] = total;
            }
        });

        order.forEach((item) => {
            const { id } = item;
            if (resultMap[id]) {
                item.total = resultMap[id];
            }   
        });

        if (!order) {
            return {
                code: 404,
                message: 'not found'
            }
        } else {
            return {
                code: 200,
                element: order
            }
        }
    },
    cartAdd: async ({
        size,
        quantityvalue,
        productID,
        price,
        color
    }) => {
        const product = await _Product.findOne({ productID: productID, size: size, couleur: color });
        if(product){
            var carts = {};
            carts.id = product.id
            carts.quantity = quantityvalue
            carts.price = price
        }
        if (!carts) {
                return {
                    code: 404,
                    message: `Sản phẩm này hết size của màu ${color} hoặc đã hết màu của size ${size}`
                }

        } else {
            return {
                code: 200,
                element: carts
            }
        }
    },
    checkoutCart: async ({
        userID,
        fullname,
        email,
        phone,
        address,
        note,
        carts
    }) => {
        let orderID = otpGenerator.generate(6, {
            digits: true,
            lowerCaseAlphabets: true,
            upperCaseAlphabets: false,
            specialChars: false
        });

        let existingOrder = await _Order.findOne({ otp: orderID });
      
        while (existingOrder) {
          orderID = otpGenerator.generate(6, {
            digits: true,
            lowerCaseAlphabets: true,
            upperCaseAlphabets: false,
            specialChars: false
        });
          existingOrder = await _Order.findOne({ otp: orderID });
        }

        const order = await _Order.create({
            orderID: orderID,
            user_id: userID,
            fullname: fullname,
            email: email,
            phone_number: phone,
            address: address,
            note: note,
            status: '64d574081519606f815686b4',
            total: 0
        })
        const transformedData = await Promise.all(carts.map(async (item) => {
            const product = await _Product.findOne({ _id: item.id });
            const UpdateQuantity = product.quantity - item.quantity;
            await _Product.updateOne({ _id: item.id }, { quantity: UpdateQuantity });
            return {
              order_id: order.id,
              productName: product.title,
              productID: product.productID,
              size: product.size,
              color: product.couleur,
              quantity: item.quantity,
              price: item.price,
              total: item.price * item.quantity
            };
          }));
        await _OrderDetail.insertMany(transformedData)
    }



}