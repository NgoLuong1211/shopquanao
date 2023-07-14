const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Categorys = new Schema({
    name: { type: String, required: true },
  });

module.exports =  mongoose.model('Category', Categorys);