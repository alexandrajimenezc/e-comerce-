const express = require('express');
const router = express.Router();
const {createOrder} = require('../controllers/orderController')

router.post('/',createOrder)
//router.post('/',create)
//router.put('/:id',update)
//router.delete('/:id',delete)

module.exports=router;