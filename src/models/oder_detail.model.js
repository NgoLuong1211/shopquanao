const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const OderDetails = new Schema({
    oder_id: { 
        type: String, 
        ref: 'Oder'
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

module.exports =  mongoose.model('OderDetail', OderDetails);