const express = require('express');
const router = express.Router();

const controller =require('../controllers/controller')



router.post('/customer',controller.createCustomer)
router.post('/:customerId/order',controller.createOrder)




module.exports=router