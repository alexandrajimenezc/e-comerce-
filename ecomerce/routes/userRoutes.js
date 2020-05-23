const express = require('express');
const router = express.Router();


const {createUser,confirmEmailUser ,loginUser,readUser,updateUser,getAllUsers,deleteUser,logout} = require('../controllers/userControllers')
const  {verificarToken}= require('../middleware/verificar')

router.post('/registro', createUser)
router.get('/confirm/:id',confirmEmailUser)
router.post('/login', loginUser)
router.get('/perfil/:id', verificarToken, readUser);
router.get('/',verificarToken, getAllUsers)// solo va el administrador
router.put('/modificar/:id',verificarToken, updateUser)
router.delete('/eliminar/:id',verificarToken,deleteUser)
router.get('/logout/:id', verificarToken, logout);

module.exports = router;
