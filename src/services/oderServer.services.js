const _User = require('../models/users.model');
const _Product = require('../models/product.model');
const _Category = require('../models/category.model');
const _Supplier = require('../models/supplier.model');
const _Size = require('../models/Size.model');
const _Color = require('../models/Color.model')
const _Oder = require('../models/oder.model');
const _OderDetail = require('../models/oder_detail.model');
const mongoose = require('mongoose');

var that = module.exports = {
    oder: async ({

    }) => {
        var oder = await _Oder.find({ status: '649246a5bbc25be2fda3863a' });
        const total = await _OderDetail.aggregate([
            {
                $group: {
                    _id: "$oder_id",
                    total: { $sum: "$total" }
                }
            }
        ]);
        for (var i = 0; i < oder.length; i++) {
            for (var j = 0; j < total.length; j++) {
                if (oder[i].id === total[j]._id) {
                    oder[i].total = total[j].total;
                    break; // Nếu tìm thấy sự trùng khớp, thoát khỏi vòng lặp trong mảng 2
                }
            }
        }
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
    statusOder: async ({
        id,
        status
    }) => {
        const oder = await _Oder.findOne({ _id: id });
        const OderDetail = await _OderDetail.find({ oder_id: oder.id });
        OderDetail.forEach(async function (item, index) {
            const product = await _Product.findOne({ productID: item.productID, size: item.size, couleur: item.color });
            const UpdateQuantity = product.quantity + item.quantity;
            await _Product.updateOne({ productID: item.productID, size: item.size, couleur: item.color }, { quantity: UpdateQuantity });
        })
        if(status==='2'){
            await _Oder.deleteOne({ _id: id })
            await _OderDetail.deleteMany({ oder_id: oder.id })
        }
        if(status==='3'){
            await _Oder.updateOne({ _id: id }, {status: '64ac2741a3b817d920237d50'});
        }
    },
    bill: async ({

    }) => {
        var oder = await _Oder.find({ status: '649246edbbc25be2fda3863c' });
        const total = await _OderDetail.aggregate([
            {
                $group: {
                    _id: "$oder_id",
                    total: { $sum: "$total" }
                }
            }
        ]);
        for (var i = 0; i < oder.length; i++) {
            for (var j = 0; j < total.length; j++) {
                if (oder[i].id === total[j]._id) {
                    oder[i].total = total[j].total;
                    break; // Nếu tìm thấy sự trùng khớp, thoát khỏi vòng lặp trong mảng 2
                }
            }
        }
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
    searchBill: async ({
        search
    }) => {
        const infoBill = await _Oder.findOne({ oderID: search }).populate('status').populate('user_id');
        var BillDetail
        if(infoBill){
            BillDetail = await _OderDetail.find({ oder_id: infoBill.id });
        }

        return {
            infoBill: infoBill,
            BillDetail: BillDetail
        }
    }


}