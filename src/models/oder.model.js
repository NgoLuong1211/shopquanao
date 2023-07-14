const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Oders = new Schema({
    oderID: {type: String},
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
        ref: 'StatusOder'
    },
    total: {type: Number},
  }, {
    timestamps: true,
});

module.exports =  mongoose.model('Oder', Oders);