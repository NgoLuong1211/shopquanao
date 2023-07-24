const bcrypt = require('bcrypt');
const _OTP = require('../models/otp.model');
const google = require('googleapis');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();
const CLIENT_ID=process.env.CLIENT_ID
const CLIENT_SECRET=process.env.CLIENT_SECRET
const REDIRECT_URI=process.env.REDIRECT_URI
const REFRESH_TOKEN=process.env.REFRESH_TOKEN
const oAuth2client = new google.Auth.OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
oAuth2client.setCredentials({refresh_token: REFRESH_TOKEN})

var that = module.exports = {
    validOtp: async({
        otp,
        hashOtp
    }) => {
        try {
            const isvalid = await bcrypt.compare(otp, hashOtp);
            return isvalid;
        } catch (error) {
            console.log(error)
        }
    },
    inserOtp: async({email, otp}) => {
        try {
            const salt = bcrypt.genSaltSync(10);
            const hashOtp = await bcrypt.hash(otp, salt);
            const __Otp = await _OTP.create({
                email,
                otp: hashOtp
            })

            
            return __Otp ? 1 : 0
        } catch (error) {
            console.log(error);
        }
    },
    sendOtp: async({
        email,
        OTP
    }) => {
        try {
            const sendMail = async() => {
                try {
                // const oAuth2client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
                const accessToken = await oAuth2client.getAccessToken()
                    let transporter = nodemailer.createTransport({
                      service: 'gmail',
                      auth: {
                        type: 'OAuth2',
                        user: 'ngoluong121102@gmail.com',
                        clientId: CLIENT_ID,
                        clientSecret: CLIENT_SECRET,
                        refreshToken: REFRESH_TOKEN,
                        accessToken: accessToken, 
                      },    
                    });    
                
                let info = await transporter.sendMail({
                  from: '"Fred Foo 👻" <ngoluong121102@gmail.com>',
                  to: email,
                  subject: "Hello ✔",
                  text: `Mã otp của bạn là: ${OTP}`,
                })
                    } catch (error) {
                        console.log(error)
                    }
                }
                sendMail()
        } catch (error) {
            console.log(error)
        }
    }

}