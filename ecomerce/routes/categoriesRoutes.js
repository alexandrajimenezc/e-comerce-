const express = require('express');
const router = express.Router();
const {createCategory,getAllCategories, getAllCategoriesProducts,updateCategory,deleteCategory} = require('../controllers/categoryController')
const  {verificarToken, is}= require('../middleware/verificar')

router.get('/',verificarToken, getAllCategories)
router.get('/products',verificarToken, getAllCategoriesProducts)// categoria tiene los siguiente productos 
router.post('/',verificarToken,is(['administrador']) ,createCategory)
router.put('/:id',verificarToken,is(['administrador']), updateCategory)
router.delete('/:id',verificarToken,is(['administrador']),deleteCategory)
module.exports=router;