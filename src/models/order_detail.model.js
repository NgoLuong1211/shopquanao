const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const OrderDetails = new Schema({
    order_id: { 
        type: String, 
        ref: 'Order'
    },
    productName: {type: String},
    productID: {type: String},
    size: {type: String},
    color: {type: String},
    price: { type: Number },
    quantity: { type: Number },
    total: { type: Number },
  }, {
    timestamps: true,
});

module.exports =  mongoose.model('OrderDetail', OrderDetails);