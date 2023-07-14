const _User = require('../models/users.model')

var that = module.exports = {
    updatePassword: async({
        email,
        password
    }) => {
        const User = _User.findOne({email: email});
        if(!User){
            
        }
    },



}