const express = require('express');
const router = express.Router();
const {createProduct,getAllProducts,upadateProduct,deleteProduct} = require('../controllers/productsController')

router.get('/',getAllProducts)
router.post('/',createProduct)
router.put('/:id',upadateProduct)
router.delete('/:id',deleteProduct)
module.exports=router;