const _User = require('../models/users.model');
const _Product = require('../models/product.model');
const _Category = require('../models/category.model');
const _Supplier = require('../models/supplier.model');
const _Size = require('../models/Size.model');
const _Color = require('../models/Color.model')
const _Order = require('../models/order.model');
const _OrderDetail = require('../models/order_detail.model');

var that = module.exports = {
    order: async ({

    }) => {
        var order = await _Order.find({ status: '64d574081519606f815686b4' });
        const total = await _OrderDetail.aggregate([
            {
                $group: {
                    _id: "$order_id",
                    total: { $sum: "$total" }
                }
            }
        ]);
        for (var i = 0; i < order.length; i++) {
            for (var j = 0; j < total.length; j++) {
                if (order[i].id === total[j]._id) {
                    order[i].total = total[j].total;
                    break;
                }
            }
        }
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
    statusOrder: async ({
        id,
        status
    }) => {
        const order = await _Order.findOne({ _id: id });
        const OrderDetail = await _OrderDetail.find({ order_id: order.id });
        OrderDetail.forEach(async function (item, index) {
            const product = await _Product.findOne({ productID: item.productID, size: item.size, couleur: item.color });
            const UpdateQuantity = product.quantity + item.quantity;
            await _Product.updateOne({ productID: item.productID, size: item.size, couleur: item.color }, { quantity: UpdateQuantity });
        })
        if(status==='2'){
            await _Order.deleteOne({ _id: id })
            await _OrderDetail.deleteMany({ order_id: order.id })
        }
        if(status==='3'){
            await _Order.updateOne({ _id: id }, {status: '64d653a6be255b3e53313cdf'});
        }
    },
    bill: async ({

    }) => {
        var order = await _Order.find({ status: '64d5743510f370f1167746fc' }).populate('status');
        const total = await _OrderDetail.aggregate([
            {
                $group: {
                    _id: "$order_id",
                    total: { $sum: "$total" }
                }
            }
        ]);
        for (var i = 0; i < order.length; i++) {
            for (var j = 0; j < total.length; j++) {
                if (order[i].id === total[j]._id) {
                    order[i].total = total[j].total;
                    break;
                }
            }
        }
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
    searchBill: async ({
        search
    }) => {
        const infoBill = await _Order.findOne({ orderID: search }).populate('status').populate('user_id');
        var BillDetail
        if(infoBill){
            BillDetail = await _OrderDetail.find({ order_id: infoBill.id });
        }
        return {
            infoBill: infoBill,
            BillDetail: BillDetail
        }
    }


}