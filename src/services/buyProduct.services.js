const _User = require('../models/users.model');
const _Product = require('../models/product.model');
const _Category = require('../models/category.model');
const _Supplier = require('../models/supplier.model');
const _Size = require('../models/Size.model');
const _Color = require('../models/Color.model');
const _Oder = require('../models/oder.model');
const _OderDetail = require('../models/oder_detail.model')
const _StatusOder = require('../models/status_oder.model')
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
        let oderID = otpGenerator.generate(6, {
            digits: true,
            lowerCaseAlphabets: true,
            upperCaseAlphabets: false,
            specialChars: false
        });

        // Kiểm tra số ngẫu nhiên có tồn tại trong cơ sở dữ liệu hay không
        let existingOrder = await _Oder.findOne({ otp: oderID });
      
        // Nếu số ngẫu nhiên đã tồn tại, tạo lại số mới
        while (existingOrder) {
          oderID = otpGenerator.generate(6, {
            digits: true,
            lowerCaseAlphabets: true,
            upperCaseAlphabets: false,
            specialChars: false
        });
          existingOrder = await _Oder.findOne({ otp: oderID });
        }
        const oder = await _Oder.create({
            oderID: oderID,
            user_id: userID,
            fullname: fullname,
            email: email,
            phone_number: phone,
            address: address,
            note: note,
            status: '649246a5bbc25be2fda3863a',
            total: 0
        })
        const product = await _Product.findOne({ _id: productID });
        const UpdateQuantity = product.quantity - quantity;
        const OderDetail = await _OderDetail.create({
            oder_id: oder.id,
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
        const oder = await _Oder.find({ user_id: userID }).populate('status');
        const OderDetail = await _OderDetail.find();
        const resultMap = {};

        OderDetail.forEach((item) => {
            const { oder_id, total } = item;
            if (resultMap[oder_id]) {
                resultMap[oder_id] += total;
            } else {
                resultMap[oder_id] = total;
            }
        });

        oder.forEach((item) => {
            const { id } = item;
            if (resultMap[id]) {
                item.total = resultMap[id];
            }   
        });

        if (!oder) {
            return {
                code: 404,
                message: 'not found'
            }
        } else {
            return {
                code: 200,
                element: oder
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
        let oderID = otpGenerator.generate(6, {
            digits: true,
            lowerCaseAlphabets: true,
            upperCaseAlphabets: false,
            specialChars: false
        });

        // Kiểm tra số ngẫu nhiên có tồn tại trong cơ sở dữ liệu hay không
        let existingOrder = await _Oder.findOne({ otp: oderID });
      
        // Nếu số ngẫu nhiên đã tồn tại, tạo lại số mới
        while (existingOrder) {
          oderID = otpGenerator.generate(6, {
            digits: true,
            lowerCaseAlphabets: true,
            upperCaseAlphabets: false,
            specialChars: false
        });
          existingOrder = await _Oder.findOne({ otp: oderID });
        }

        const oder = await _Oder.create({
            oderID: oderID,
            user_id: userID,
            fullname: fullname,
            email: email,
            phone_number: phone,
            address: address,
            note: note,
            status: '649246a5bbc25be2fda3863a',
            total: 0
        })
        const transformedData = await Promise.all(carts.map(async (item) => {
            const product = await _Product.findOne({ _id: item.id });
            const UpdateQuantity = product.quantity - item.quantity;
            await _Product.updateOne({ _id: item.id }, { quantity: UpdateQuantity });
            return {
              oder_id: oder.id,
              productName: product.title,
              productID: product.productID,
              size: product.size,
              color: product.couleur,
              quantity: item.quantity,
              price: item.price,
              total: item.price * item.quantity
            };
          }));
        await _OderDetail.insertMany(transformedData)
    }



}