const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Otps = new Schema({
    email: { type: String, required: true },
    otp: {type: String},
    createAt: { type: Date, default: Date.now, expires: '1m'}
  });

module.exports =  mongoose.model('Otp', Otps);