const _Revenue = require('../models/revenue.model')
const _User = require('../models/users.model');
const _Product = require('../models/product.model');
const _Category = require('../models/category.model');
const _Supplier = require('../models/supplier.model');
const _Size = require('../models/Size.model');
const _Color = require('../models/Color.model')
const _Oder = require('../models/oder.model');
const _OderDetail = require('../models/oder_detail.model');

var that = module.exports = {
    revenues: async ({
      month
    }) => {
      var arr = []
      const oder = await _Oder.find({status: '649246a5bbc25be2fda3863a'});

      oder.forEach(item => {
        arr.push(item.id)
      });
        // Tạo đối tượng Date đại diện cho thời điểm bắt đầu của ngày hôm nay
        var startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        // Tạo đối tượng Date đại diện cho thời điểm cuối của ngày hôm nay
        var endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const oder_detail = await _OderDetail.find({
            createdAt: {
                $gte: startOfDay,
                $lte: endOfDay
              },
              oder_id: { $nin: arr }
        })
        var sum = 0;
        if(oder_detail){
          for (var i = 0; i < oder_detail.length; i++) {
            sum += oder_detail[i].price*oder_detail[i].quantity;
          }
        }

        // Lấy phần tử mới nhất trong bảng _Revenue
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
            $eq: [{ $month: '$createdAt' }, month] // Truy vấn dữ liệu trong tháng 1 (tìm kiếm các bản ghi có createdAt trong tháng 1)
          }
        })
        return data
    },

}