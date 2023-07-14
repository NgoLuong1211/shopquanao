const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Users = new Schema({
    fullname: { type: String, required: true },
    email: { type: String },
    phone_number: { type: String },
    address: { type: String },
    password: { type: String },
    role_id: { 
        type: String,
        ref: 'Role'
    },
    googleID: { type: String}

  }, {
    timestamps: true,
});

module.exports =  mongoose.model('User', Users);