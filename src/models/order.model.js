const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Orders = new Schema({
    orderID: {type: String},
    user_id: { 
        type: String, 
        ref: 'User'
    },
    fullname: { type: String },
    email: { type: String },
    phone_number: { type: String },
    address: { type: String },
    note: { type: String },
    status: {
        type: String,
        ref: 'StatusOrder'
    },
    total: {type: Number},
  }, {
    timestamps: true,
});

module.exports =  mongoose.model('Order', Orders);