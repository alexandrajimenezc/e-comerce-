const express = require('express');
const router = express.Router();
const {createOrder,readOrder, readAllOrders,updateOrder,deleteOrder} = require('../controllers/orderController')
const  {verificarToken}= require('../middleware/verificar')

// las ordernes serian tipo el carrito ? , faltaria una compracontroler?
router.get('/:id',verificarToken,readOrder) 
router.get('/',verificarToken, readAllOrders)
router.post('/',verificarToken,createOrder)
router.put('/:id',verificarToken, updateOrder)
router.delete('/:id',verificarToken,deleteOrder)

module.exports=router;