const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Sizes = new Schema({
  productID: { type: String, require: true },
  size: { type: Array },
  });

module.exports =  mongoose.model('Size', Sizes);