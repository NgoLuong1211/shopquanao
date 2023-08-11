const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const StatusOrders = new Schema({
    name: { type: String, required: true },
  });

module.exports =  mongoose.model('StatusOrder', StatusOrders);