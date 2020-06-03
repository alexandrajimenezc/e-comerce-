const express = require('express');
const router = express.Router();
const {createOrder,readOrder, readAllOrders,updateOrder,deleteOrder} = require('../controllers/orderController')
const  {verificarToken, is}= require('../middleware/verificar')

// las ordernes serian tipo el carrito ? , faltaria una compracontroler?
router.get('/:id',verificarToken,readOrder) 
router.post('/',verificarToken,createOrder)
router.get('/',verificarToken,is(['administrador']), readAllOrders)
router.put('/:id',verificarToken,is(['administrador','vendedor']), updateOrder)
router.delete('/:id',verificarToken,is(['administrador']),deleteOrder)

module.exports=router;