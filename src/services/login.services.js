const jwt = require('jsonwebtoken')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const _User = require('../models/users.model')

var that = module.exports = {
    Strategy: async({
        email,
        password,
        done
    }) => {
        _User.findOne({ email: email }, function (err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            return done(null, user);
        });

    },



}