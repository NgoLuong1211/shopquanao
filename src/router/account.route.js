const express = require('express');
const router = express.Router();
const passport = require('passport')
const jwt = require('jsonwebtoken')
const _User = require('../models/users.model')
const _Role = require('../models/Role.model')
const {
    login,
    register,
    registerUser,
    OTP,
    veryfyOtp,
    forgotLogin,
    resendOtp,
    forgotLoginUser,
    forgotOTP,
    fixPassword,
    forgotveryfyOtp,
    updatePassword,
    changePassword,
    changePasswords
} = require('../controllers/account.controller');

router.get('/register', register);
router.get('/otp/:email', OTP);
router.get('/forgotLogin', forgotLogin);
router.get('/forgotOTP/:email', forgotOTP);
router.get('/fixPassword/:email', fixPassword);
router.get('/failure', (req, res)=>{
    res.json('đăng nhập thất bại!!!!');
});
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], prompt: 'select_account' }))
router.get('/google/callback',
function(req, res, next) {
  passport.authenticate('google', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect('/failure');
    }

    const oldCart = req.session.cart;
    const url = req.session.url
    delete req.session.cart; 
    req.login(user, function(err) {
      if(user.role_id==='6465fbc1c6a7fccffde390c7'){
        if (err) {
          return next(err);
        }
  
        if (oldCart) {
          req.session.cart = oldCart;

        }
        var returnTo = url || '/';
        req.session.url = null;
        return res.redirect(returnTo);
      }
      if(user.role_id==='6465fbd6ae61ad6fcc304f4b'){
        return res.redirect('/server/revenue');
      }
    });
  })(req, res, next);
});


router.post('/registerUser', registerUser);
router.post('/loginUser', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect('/failure');
    }

    const oldCart = req.session.cart;
    const url = req.session.url
    delete req.session.cart;
    req.login(user, function(err) {
      if(user.role_id==='6465fbc1c6a7fccffde390c7'){
        if (err) {
          return next(err);
        }
  
        if (oldCart) {
          req.session.cart = oldCart;
        }
        var returnTo = url || '/';
        req.session.url = null;
        return res.redirect(returnTo);
      }
      if(user.role_id==='6465fbd6ae61ad6fcc304f4b'){
        return res.redirect('/server/revenue');
      }1
    });
  })(req, res, next);
});
router.post('/veryfyOtp', veryfyOtp);
router.post('/resendOtp', resendOtp);
router.post('/forgotLoginUser', forgotLoginUser);
router.post('/forgotveryfyOtp', forgotveryfyOtp);
router.post('/updatePassword', updatePassword);
router.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

router.get('/changePassword', changePassword);
router.patch('/changePasswords', changePasswords);
router.get('/login', login);

module.exports = router;