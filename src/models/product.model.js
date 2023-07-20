const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Products = new Schema({
    title: { type: String, required: true },
    category_id: { 
        type: String,
        ref: 'Category'
    },
    price: { type: Number },
    discount: { type: Number },
    supplier_id: { 
        type: String,
        ref: 'Supplier'
    },
    size: {
        type: String,
    },
    image: { type: String },
    quantity: { type: Number },
    description: { type: String},
    couleur: { 
        type: String,
        ref: 'Color'
    },
    productID: { type: String, required: true }
  }, {
    timestamps: true,
});

module.exports =  mongoose.model('Product', Products);