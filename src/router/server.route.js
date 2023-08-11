const express = require('express');
const router = express.Router();

const {
    revenue,
    revenues,
    product,
    detailProduct,
    createProduct,
    createProducts,
    updateProductQuantity,
    updateProductQuantitys,
    deleteProduct,
    feedback,
    order,
    statusOrder,
    bill,
    searchBill
} = require('../controllers/server.controller');

const {
    auth
} = require('../middleware/auth')

router.get('/revenue', auth, revenue);
router.get('/revenues', auth, revenues);
router.get('/product', auth, product);
router.get('/createProduct', auth, createProduct);
router.get('/updateProductQuantity/:_id', auth, updateProductQuantity);
router.patch('/updateProductQuantity', auth, updateProductQuantitys);
router.post('/createProduct', auth, createProducts);
router.get('/feedback', auth, feedback); 
router.get('/order', auth, order);  
router.get('/bill', auth, bill); 
router.get('/searchBill', auth, searchBill);
router.get('/statusOrder', auth, statusOrder);  
router.delete('/deleteProduct/:_id', auth, deleteProduct);
router.get('/detailProduct/:_id', auth, detailProduct);


module.exports = router;