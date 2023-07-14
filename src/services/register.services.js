const _User = require('../models/users.model');
const _OTP = require('../models/otp.model');
const _temporarySaveUser = require('../models/temporary_save_user.model')
const otpGenerator = require('otp-generator');
const {
    inserOtp,
    validOtp,
    sendOtp
} = require('./otp.services');

var that = module.exports = {
    veryfyOtp: async({
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
                const temporarySaveUser = await _temporarySaveUser.find({email: email});
                const emailss = temporarySaveUser[temporarySaveUser.length-1];
                const user = await _User.create({
                    fullname: emailss.fullname,
                    password: emailss.password,
                    email: emailss.email,
                    role_id: '6465fbc1c6a7fccffde390c7'
                })
                if(user){
                    await _OTP.deleteMany({email: email})
                    await _temporarySaveUser.deleteMany({email: email})
                }
                return {
                    code: 201,
                    element: user
                }
            }

        } catch (error) {
            console.log(error);
        }
    }
    ,
    registerUser: async(username, email, password) => {
        const __Fullname = await _User.findOne({fullname: username});
        const __Email = await _User.findOne({email: email, password: { $exists: true }});
        if(__Fullname){
            return {
                code: 400,
                message: 'Tài khoản này đã tồn tại!!!'
            };
        }
        if (__Email) {
            return {
                code: 400,
                message: 'Email này đã tồn tại!!!'
            };
        }
        else {
            await _temporarySaveUser.create({
                fullname: username,
                password: password,
                email: email
            })
            const OTP = otpGenerator.generate(6, {
                digits: true,
                lowerCaseAlphabets: false,
                upperCaseAlphabets: false,
                specialChars: false
            });
            sendOtp({email, OTP})
            return {
                code: 200,
                element: await inserOtp({
                    email,
                    otp: OTP
                })
            };
        }

    },
    resendOtp: async({
        email
    }) => {
        const OTP = otpGenerator.generate(6, {
            digits: true,
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false
        });
        sendOtp({email, OTP});
        return {
            code: 200,
            element: await inserOtp({
                email,
                otp: OTP
            })
        };
    }



}