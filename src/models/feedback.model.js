const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Feedbacks = new Schema({
    fullname: { type: String, required: true },
    email: { type: String },
    phone_number: { type: String },
    subject_name: { type: String },
    note: { type: String },
    createAt: { type: Date, default: Date.now, expires: '10080m'}
  });

module.exports =  mongoose.model('Feedback', Feedbacks);