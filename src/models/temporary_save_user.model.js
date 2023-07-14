const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const temporarySaveUsers = new Schema({
    email: { type: String, required: true },
    fullname: {type: String},
    password: {type: String},
    createAt: { type: Date, default: Date.now, expires: '5m'}
  });

module.exports =  mongoose.model('temporarySaveUser', temporarySaveUsers);