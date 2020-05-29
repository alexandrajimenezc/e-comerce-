const express = require('express');
const router = express.Router();


const {createUser,confirmEmailUser ,loginUser,readUser,updateUser,getAllUsers,deleteUser,logout,updateUserA,deleteUserA} = require('../controllers/userControllers')
const  {verificarToken, is}= require('../middleware/verificar')

router.post('/registro', createUser)
router.get('/confirm/:emailtoken',confirmEmailUser)
router.post('/login', loginUser)
router.get('/perfil',verificarToken, readUser);
router.put('/modificar',verificarToken, updateUser)
router.delete('/eliminar',verificarToken,deleteUser)
router.get('/logout', verificarToken, logout);

router.get('/',verificarToken,is(['administrador']), getAllUsers) // solo el administrador
router.put('/modificaradm/:id',verificarToken,is(['administrador']), updateUserA)
router.delete('/eliminaradm/:id',verificarToken,is(['administrador']),deleteUserA)

module.exports = router;
