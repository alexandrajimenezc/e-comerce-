const express = require('express');
const router = express.Router();


const {createUser,loginUser,readUser,updateUser,getAllUsers,deleteUser} = require('../controllers/userControllers')
const verificarToken = require('../middleware/verificarToken')

router.post('/registro', createUser)
router.post('/login', loginUser)
router.get('/perfil/:id', verificarToken, readUser);
router.get('/',verificarToken, getAllUsers)
router.put('/modificar/:id',verificarToken, updateUser)
router.delete('/eliminar/:id',verificarToken,deleteUser)


module.exports = router;
