const _Product = require('../models/product.model')
const _Color = require('../models/Color.model')
const dotenv = require('dotenv');
dotenv.config();
const {
    home,
    product,
    productNew,
    detailProduct,
    feedBacks
} = require('../services/home.services');

const {
    buyNow,
    checkoutpost,
    historyBuy,
    cartAdd,
    checkoutCart
} = require('../services/buyProduct.services')

const { render } = require('ejs');

var that = module.exports = {
    home: async (req, res, next) => {
        try {
            const {
                code,
                message,
                element
            } = await home({})
            if (code != 200) {
                return res.status(code).json(message);
            } else {
                const user = req.user;
                res.render('client/home', { product: element, user: user });
            }
        } catch (error) {
            console.log(error);
            next(error);
        }

    },
    newProduct: async (req, res, next) => {
        try {
            const category = req.query.category
            const {
                code,
                message,
                element
            } = await productNew({ category })
            if (code != 200) {
                return res.status(code).json(message);
            } else {
                const user = req.user;
                res.render('client/newProduct', { user: user, product: element })
            }
        } catch (error) {
            console.log(error);
            next(error);
        }

    },
    cart: async (req, res, next) => {
        try {
            const user = req.user;
            var result;
            const cart = req.session.cart;
            if (cart) {
                const ids = cart.map(item => item.id);
                const carts = await _Product.find({ _id: { $in: ids } }).exec();
                result = carts.map(obj => {
                    const quantityObj = cart.find(item => item.id === obj.id);
                    return { ...obj.toObject(), quantityCart: quantityObj.quantity };
                });
            }
            res.render('client/cart', { user: user, carts: result });
        } catch (error) {
            console.log(error);
            next(error);
        }

    },
    carts: async (req, res, next) => {
        try {
            const user = req.user;
            if (!user) {
                const cart = req.session.cart;
                var result;
                if (cart) {
                    const ids = cart.map(item => item.id);
                    const carts = await _Product.find({ _id: { $in: ids } }).exec();
                    result = carts.map(obj => {
                        const quantityObj = cart.find(item => item.id === obj.id);
                        return { ...obj.toObject(), quantityCart: quantityObj.quantity };
                    });
                }
                res.json(result);
            } else {
                res.render('client/cart', { user: user });
            }
        } catch (error) {
            console.log(error);
            next(error);
        }

    },
    test: async (req, res, next) => {
        res.render('client/test')
    },
    product: async (req, res, next) => {

        try {
            const {
                search,
                page
            } = req.query;

            const {
                code,
                message,
                totalPage,
                element
            } = await product({
                search,
                page
            });
            if (code != 200) {
                return res.status(code).json(message);
            } else {
                const user = req.user;
                res.render('client/product', { search: search, totalPage: totalPage, product: element, user: user });
            }
        } catch (error) {
            console.log(error);
            next(error);
        }

    },
    products: async (req, res, next) => {

        try {
            const {
                search,
                page
            } = req.query;

            const {
                code,
                message,
                totalPage,
                element
            } = await product({
                search,
                page
            });
            res.json({ totalPage, element })



        } catch (error) {
            console.log(error);
            next(error);
        }

    },
    detailProduct: async (req, res, next) => {
        try {
            const id = req.params._id
            const {
                code,
                message,
                element,
                size,
                color,
                image
            } = await detailProduct({ id })
            const user = req.user;
            res.render('client/detailProduct', { product: element, size: size, color: color, image: image, user: user })
        } catch (error) {
            console.log(error);
            next(error);
        }
    },
    buyNow: async (req, res, next) => {
        try {
            const {
                size,
                productID,
                quantityvalue
            } = req.body
            const {
                code,
                message,
                element
            } = await buyNow({
                productID,
                size
            })
            const redirectUrl = '/checkout?productID=' + element + '&quantity=' + quantityvalue
            if (code != 200) {
                return res.status(code).json(message);
            } else {
                res.redirect(redirectUrl);
            }
        } catch (error) {
            console.log(error);
            next(error);
        }
    },
    buyCart: async (req, res, next) => {
        try {
            res.redirect('/checkout');
        } catch (error) {
            console.log(error);
            next(error);
        }
    },
    checkout: async (req, res, next) => {
        try {
            const {
                productID,
                quantity
            } = req.query
            res.render('client/checkout', { productID: productID, quantity: quantity })
        } catch (error) {
            console.log(error);
            next(error);
        }
    },
    checkoutpost: async (req, res, next) => {
        try {
            const {
                fullname,
                email,
                phone,
                address,
                note,
                quantity,
                productID
            } = req.body
            const userID = req.user.id
            if (quantity) {
                checkoutpost({
                    userID,
                    fullname,
                    email,
                    phone,
                    address,
                    note,
                    quantity,
                    productID
                })
            } else {
                const carts = req.session.cart;
                checkoutCart({
                    userID,
                    fullname,
                    email,
                    phone,
                    address,
                    note,
                    carts
                })
                req.session.cart = null;
            }
            res.redirect('/historyBuy')
        } catch (error) {
            console.log(error);
            next(error);
        }
    },
    historyBuy: async (req, res, next) => {
        try {
            const userID = req.user.id;
            const {
                code,
                message,
                element
            } = await historyBuy({
                userID
            })
            const user = req.user
            if (code != 200) {
                return res.status(code).json(message);
            } else {
                res.render('client/historyBuy', { orders: element, user: user });
            }
        } catch (error) {
            console.log(error);
            next(error);
        }
    },
    cartAdd: async (req, res, next) => {
        const {
            size,
            quantityvalue,
            productID,
            price,
            color
        } = req.body
        const user = req.user
        const {
            code,
            message,
            element
        } = await cartAdd({
            size,
            quantityvalue,
            productID,
            price,
            color
        })
        if (code != 200) {
            return res.status(code).json(message);
        } else {

            if (!req.session.cart) {
                req.session.cart = []; 
            }
            const cart = req.session.cart;
            let check = true;

            for (let i = 0; i < cart.length; i++) {
                if (cart[i].id === element.id) {
                    const cartQuantity = parseInt(cart[i].quantity);
                    const quantity = parseInt(quantityvalue)
                    const sumQuantity = cartQuantity + quantity
                    cart[i].quantity = sumQuantity;
                    check = false;
                    break;
                }

            }
            if (check) {
                req.session.cart.push(element);
                res.redirect('/cart');
            } else {
                res.redirect('/cart');
            }
        }
    },
    updateCart: async (req, res, next) => {
        try {
            const quantityNew = req.body.quantity;
            const id = req.params.id;
            const cart = req.session.cart;
            for (let i = 0; i < cart.length; i++) {
                if (cart[i].id === id) {
                    cart[i].quantity = quantityNew;
                    break;
                }
            }
            req.session.cart = cart
            res.json({ success: true });
        } catch (error) {
            console.log(error);
            next(error);
        }
    },
    feedBack: async (req, res, next) => {
        try {
            const user = req.user
            res.render('client/feedback', { user: user })
        } catch (error) {
            console.log(error);
            next(error);
        }
    },
    feedBacks: async (req, res, next) => {
        try {
            const {
                fullname,
                email,
                phone_number,
                subject_name,
                note
            } = req.body
            await feedBacks({
                fullname,
                email,
                phone_number,
                subject_name,
                note
            })
            res.json('Gửi phản hồi thành công');
        } catch (error) {
            console.log(error);
            next(error);
        }
    }


}