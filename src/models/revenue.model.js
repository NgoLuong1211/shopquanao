const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const revenues = new Schema({
    amount: Number
  }, {
    timestamps: true,
});

module.exports =  mongoose.model('revenue', revenues);