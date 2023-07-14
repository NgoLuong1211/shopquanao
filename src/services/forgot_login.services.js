const _User = require('../models/users.model');
const _OTP = require('../models/otp.model')
const otpGenerator = require('otp-generator');
const {
    inserOtp,
    sendOtp,
    validOtp
} = require('./otp.services');

var that = module.exports = {
    forgotveryfyOtp: async({
        email,
        otp
    }) => {
        try {
            const otpHolder = await _OTP.find({email: email});
            if(!otpHolder.length){
                return {
                    code: 400,
                    message: 'Hết thời gian OTP'
                }
            }

            const lastOtp = otpHolder[otpHolder.length-1];

            const isvalid = await validOtp({
                otp,
                hashOtp: lastOtp.otp
            })
            if(!isvalid){
                return {
                    code: 401,
                    message: 'Invalid otp!'
                }
            }
            if(isvalid && email === lastOtp.email){         
                await _OTP.deleteMany({email: email})
                return {
                    code: 201,
                    message: 'success'
                }
            }

        } catch (error) {
            console.log(error);
        }
    }
    ,
    forgotLoginUser: async({
        email
    }) => {
        try {
            const __User = await _User.findOne({email: email, password: { $exists: true }});
        if(!__User){
            return {
                code: 400,
                message: 'Tài Khoản này không tồn tại'
            }
        }else{
            const OTP = otpGenerator.generate(6, {
                digits: true,
                lowerCaseAlphabets: false,
                upperCaseAlphabets: false,
                specialChars: false
            });
            sendOtp({email, OTP})
            console.log(OTP)
            return {
                code: 200,
                element: await inserOtp({
                    email,
                    otp: OTP
                })
            };
        }

        } catch (error) {
            console.log(error);
        }
    },



}