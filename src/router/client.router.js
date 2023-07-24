const express = require('express');
const router = express.Router();

const { buynow } = require('../middleware/buy.middleware')

const {
    home,
    newProduct,
    cart,
    product,
    detailProduct,
    buyNow,
    checkout,
    checkoutpost,
    historyBuy,
    cartAdd,
    updateCart,
    carts,
    buyCart,
    feedBack,
    feedBacks,
    test,
    products
} = require('../controllers/client.controller');

router.post('/buyNow',(req, res, next) => {

    if (req.isAuthenticated()) {

        next();
    } else {

        req.session.url = req.session.detail
        
        res.redirect('/account/login');
    }
}, buyNow);
router.post('/buyCart',(req, res, next) => {

    if (req.isAuthenticated()) {

        next();
    } else {

        req.session.url = '/cart'
        res.redirect('/account/login');
    }
}, buyCart);
router.get('/newProduct', newProduct);
router.get('/cart', cart);
router.get('/carts', carts);
router.get('/product', product);
router.get('/products', products);
router.get('/detail/:_id',(req, res, next) => {
    req.session.detail = req.originalUrl;
    next()
}, detailProduct);
router.get('/checkout', checkout);
router.post('/checkout', checkoutpost);
router.get('/historyBuy', historyBuy);
router.get('/feedBack', feedBack);
router.post('/feedBack', feedBacks);
router.post('/cartAdd', cartAdd);
router.put('/updateCart/:id', updateCart);
router.get('/test', test);
router.get('/', home);

module.exports = router;