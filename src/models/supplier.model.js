const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Suppliers = new Schema({
    name: { type: String, required: true },
    phone_number: { type: String },
    address: { type: String }
  });

module.exports =  mongoose.model('Supplier', Suppliers);