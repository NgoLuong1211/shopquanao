const _User = require('../models/users.model')
const dotenv = require('dotenv');
dotenv.config();

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


const {
    Strategy
} = require('../services/login.services');

const {
    forgotLoginUser,
    forgotveryfyOtp
} = require('../services/forgot_login.services')

const {
    registerUser,
    veryfyOtp,
    resendOtp
} = require('../services/register.services');


var that = module.exports = {
    login: async(req, res, next) => {
        res.render('account/login');
    },
    register: async(req, res, next) => {
        res.render('account/register');
    },
    forgotLogin: async(req, res, next) => {
        res.render('account/forgot_login');
    },
    OTP: async(req, res, next) => {
        res.render('account/otp', {email: req.params.email})
    },
    forgotOTP: async(req, res, next) => {
        res.render('account/forgotOTP', {email: req.params.email})
    },
    fixPassword: async(req, res, next) => {
        res.render('account/fix_password', {email: req.params.email})
    },
    updatePassword: async(req, res, next) => {
        const {password, email} = req.body
        await _User.updateOne({email: email, password: { $exists: true }}, {password: password})
        res.redirect('/account/login')
    },
    loginUser: async(req, res, next) => {
        try {
            const {email, password}=req.body
            res.json(req.body)
        } catch (error) {
            console.log(error);
            next(error);
        }
    },
    forgotveryfyOtp: async(req, res, next) => {
        const {
            otp,
            email
        } = req.body
        
        const {
            code,
            element,
            message
        } = await forgotveryfyOtp({
            email,
            otp
        })
        if(code===400){
            return res.json({
                code,
                message,
                element
            })
        }else{
            return res.redirect(`/account/fixPassword/${email}`)
        }
    },
    forgotLoginUser: async(req, res, next) => {
        try {
            const email = req.body.email
            const {
                code,
                message,
                element
            } = await forgotLoginUser({email});
            if(code===200){
                return res.redirect(`/account/forgotOTP/${email}`)
            }else{
                return res.status(code).json({
                    code,
                    message,
                    element
                })
            }
        } catch (error) {
            console.log(error)
            next(error)
        }
    },
    veryfyOtp: async(req, res, next) => {
        const {
            otp,
            email
        } = req.body
        
        const {
            code,
            element,
            message
        } = await veryfyOtp({
            email,
            otp
        })
        return res.redirect('/account/login')
    },
    registerUser: async(req, res, next) => {
        try {
            const  {
                username,
                email,
                password
            } = req.body;
            const {
                code,
                message,
                element
            } = await registerUser(username, email, password);
            if(code===200){
                return res.redirect(`/account/otp/${email}`);
            }else{
                return res.status(code).json({
                    code,
                    message,
                    element
                })
            }
        } catch (error) {
            console.log(error);
            next(error);
        }
    },
    resendOtp: async(req, res, next)=>{
        try {
            const email = req.body.email;
            resendOtp({email})
            res.redirect('back')
        } catch (error) {
            console.log(error);
            next(error);
        }
    },
    changePassword: async(req, res, next) => {
        try {
            res.render('account/changePassword')
        } catch (error) {
            console.log(error);
            next(error);
        }
    },
    changePasswords: async(req, res, next) => {
        try {
            const {
                currentPassword,
                newPassword
            } = req.body;
            const email = req.user.email
            await _User.updateOne({email: email, password: currentPassword}, {password: newPassword})
            res.redirect('/account/login')
        } catch (error) {
            console.log(error);
            next(error);
        }
    }




}