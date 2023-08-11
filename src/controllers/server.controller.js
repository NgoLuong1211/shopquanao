const _Revenue = require('../models/revenue.model');
const _Category = require('../models/category.model');
const _Supplier = require('../models/supplier.model');
const _Product = require('../models/product.model');
const _Feedback = require('../models/feedback.model');
const _Order = require('../models/order.model');

const {
    revenues,
} = require('../services/revenue.services')
const {
    detailProduct,
    createProduct,
} = require('../services/productServer.services');

const {
    order,
    statusOrder,
    bill,
    searchBill
} = require('../services/orderServer.services')

const {
    product
} = require('../services/home.services')

var that = module.exports = {
    revenue: async(req, res, next)=>{
        const date = await _Revenue.findOne({_id : '64a3368ece9c580ccd12dd08'})
        var currentDate = new Date();
        res.render('server/revenue')
    },
    revenues: async(req, res, next)=>{
        try {
            
            const month = 8
            const data = await revenues({month});
            const labels = [];
            const amount = [];
            for(var i=0; i<data.length; i++){
                labels.push(data[i].createdAt.getDate());
                amount.push(data[i].amount)
            }
    
            res.json({labels, amount})
        } catch (error) {
            console.log(error);
            next(error);
        }
    },
    product: async(req, res, next) =>{
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
                res.render('server/product', { search: search, totalPage: totalPage, product: element })
            }
        } catch (error) {
            console.log(error);
            next(error);
        }
    },
    detailProduct: async(req, res, next) =>{
        try {
            const id = req.params._id;
            const {
                code,
                message,
                element
            } = await detailProduct({id});
            if (code != 200) {
                return res.status(code).json(message);
            } else {
                res.render('server/detailProduct', {product: element});
            }
        } catch (error) {
            console.log(error);
            next(error);
        }
    },
    createProduct: async(req, res, next) =>{
        try {
            const category = await _Category.find();
            const supplier = await _Supplier.find();
            res.render('server/createProduct', {category: category, supplier: supplier});
        } catch (error) {
            console.log(error);
            next(error);
        }
    },
    createProducts: async(req, res, next) =>{
        try {
            const {
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
            } = req.body
            createProduct({
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
            })
            res.redirect('back')
        } catch (error) {
            console.log(error);
            next(error);
        }
    },
    updateProductQuantity: async(req, res, next) => {
        try {
            const id = req.params._id;
            const product = await _Product.findOne({_id: id});
            res.render('server/updateProductQuantity', {product: product});
        } catch (error) {
            console.log(error);
            next(error);
        }
    },
    updateProductQuantitys: async(req, res, next) => {
        try {
            const {
                quantity,
                id
            } = req.body;
            await _Product.updateOne({_id: id}, {quantity: quantity});
            res.redirect('/server/product');
        } catch (error) {
            console.log(error);
            next(error);
        }
    },
    deleteProduct: async(req, res, next) => {
        try {
            const id = req.params._id;
            await _Product.deleteOne({_id: id});
            res.redirect('/server/product/');
        } catch (error) {
            console.log(error);
            next(error);
        }
    },
    feedback: async(req, res, next) => {
        try {
            const feedback = await _Feedback.find().sort({ createdAt: -1 });
            res.render('server/feedback', {feedback: feedback});
        } catch (error) {
            console.log(error);
            next(error);
        }
    },
    order: async(req, res, next) => {
        try {
            const {
                code,
                message,
                element
            } = await order({});
            if (code != 200) {
                return res.status(code).json(message);
            } else {
                res.render('server/order', {orders: element});
            }
        } catch (error) {
            console.log(error);
            next(error);
        }
    },
    statusOrder: async(req, res, next) => {
        try {
            const{
                id,
                status
            } = req.query
            if(status==='1'){
                await _Order.updateOne({_id: id}, {status: '64d5741f494ae4cd8d46222e'})
            }
            if(status==='2'){
                await statusOrder({
                    id,
                    status
                })
            }
            if(status==='3'){
                await statusOrder({
                    id,
                    status
                })
            }
            res.redirect('back')
        } catch (error) {
            console.log(error);
            next(error);
        }
    },
    bill: async(req, res, next) => {
        try {
            const {
                code,
                message,
                element
            } = await bill({});
            if (code != 200) {
                return res.status(code).json(message);
            } else {
                res.render('server/bill', {orders: element});
            }
        } catch (error) {
            console.log(error);
            next(error);
        }
    },
    searchBill: async(req, res, next) => {
        try {
            const search = req.query.search;
            const {
                infoBill,
                BillDetail
            } = await searchBill({search});
            res.render('server/searchBill', {search: search, infoBill: infoBill, BillDetail: BillDetail});
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
}