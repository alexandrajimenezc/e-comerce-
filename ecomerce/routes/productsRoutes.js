const express = require('express');
const router = express.Router();
const {
    createProduct,
    readProduct,
    readProductPvendedor,
    readProductPcategoria,
    getAllProducts,upadateProduct,
    deleteProduct,addTowishList,
    deleteTowishList,createComments,
    deleteComments,readProductByName,
    getByPriceMenorAMayor,
    getByPriceMayorAMenor,
    readProductMasVendido
} = require('../controllers/productsController')
const  {verificarToken, is}= require('../middleware/verificar')

router.get('/',verificarToken,getAllProducts)//*
router.get('/:id',verificarToken,readProduct)//* funciona pero mejor que no muestre tanta inf del vendedor?
router.get('/pvendedor/:id',verificarToken,readProductPvendedor)//*
router.get('/pcategoria/:id',verificarToken,readProductPcategoria)//*
router.get('/name/:name', readProductByName);//*  mejorar , como van los espacio?
router.get('/price/menoramayor', getByPriceMenorAMayor);
router.get('/price/mayoramenor', getByPriceMayorAMenor);
router.get('/mas/vendidos', readProductMasVendido);

router.put('/wichlist/:_id', verificarToken, addTowishList);//*
router.put('/dwichlist/:_id', verificarToken, deleteTowishList);//*
router.put('/comments/:_id', verificarToken,createComments )//*
router.put('/dcomments/:_id', verificarToken,deleteComments )//*

router.post('/',verificarToken,is(['vendedor','administrador']) ,createProduct)//*
router.put('/:id',verificarToken,is(['vendedor','administrador']),upadateProduct)//*
router.delete('/:id',verificarToken,is(['vendedor','administrador']),deleteProduct)
module.exports=router;