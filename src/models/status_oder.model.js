const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const StatusOders = new Schema({
    name: { type: String, required: true },
  });

module.exports =  mongoose.model('StatusOder', StatusOders);