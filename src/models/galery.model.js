const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Galerys = new Schema({
    product_id: {
        type: String,
        ref: 'Product'
    },
    image: { type: String, required: true },
  });

module.exports =  mongoose.model('Galery', Galerys);