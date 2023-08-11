const _Revenue = require('../models/revenue.model')
const _User = require('../models/users.model');
const _Product = require('../models/product.model');
const _Category = require('../models/category.model');
const _Supplier = require('../models/supplier.model');
const _Size = require('../models/Size.model');
const _Color = require('../models/Color.model')
const _Order = require('../models/order.model');
const _OrderDetail = require('../models/order_detail.model');

var that = module.exports = {
    revenues: async ({
      month
    }) => {
      var arr = []
      const order = await _Order.find({status: '64d574081519606f815686b4'});

      order.forEach(item => {
        arr.push(item.id)
      });
        var startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        var endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const order_detail = await _OrderDetail.find({
            createdAt: {
                $gte: startOfDay,
                $lte: endOfDay
              },
              order_id: { $nin: arr }
        })
        var sum = 0;
        if(order_detail){
          for (var i = 0; i < order_detail.length; i++) {
            sum += order_detail[i].price*order_detail[i].quantity;
          }
        }

        const revenue = await _Revenue.findOne().sort({ createdAt: -1 })
        const currentTime = new Date();
        if(revenue.createdAt.getDate()===currentTime.getDate()){
          revenue.amount = sum;
          await revenue.save()
        }else{
          await _Revenue.create({
            amount: sum,
        })
        }
        const data = await _Revenue.find({
          $expr: {
            $eq: [{ $month: '$createdAt' }, month]
          }
        })
        return data
    },

}