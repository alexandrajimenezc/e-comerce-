const express = require('express');
const router = express.Router();
const {createProduct,readProduct,readProductPvendedor,readProductPcategoria,getAllProducts,upadateProduct,deleteProduct} = require('../controllers/productsController')
const  {verificarToken, is}= require('../middleware/verificar')

router.get('/',verificarToken,getAllProducts)
router.get('/:id',verificarToken,readProduct)
router.get('/pvendedor/:id',verificarToken,readProductPvendedor)
router.get('/pcategoria/:id',verificarToken,readProductPcategoria)
router.post('/',verificarToken,is(['vendedor']) ,createProduct)// falta poder hacer post , put y delete el administrador
router.put('/:id',verificarToken,is(['vendedor']),upadateProduct)
router.delete('/:id',verificarToken,is(['vendedor']),deleteProduct)
module.exports=router;