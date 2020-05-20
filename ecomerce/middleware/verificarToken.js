const jwt = require('jsonwebtoken');
const config=process.env.secret
const UserModel= require('../models/userModels');


const verificarToken = async(req, res, next) => {
    try {
        const token = req.headers.authorization;
        const decodificar = jwt.verify(token, config);
        const usuario = await UserModel.findOne({
            _id: decodificar._id,
            tokens: token
        });
        if (!usuario) {
            return res.status(401).send({
                message: 'NO ESTAS AUTORIZADO'
            });
        }
        req.usuario = usuario;
        next();
    } catch (error) {
        console.error(error)
        res.status(401).send({
            message: 'NO ESTAS AUTORIZADO',
            error
        })
    }
}


module.exports = verificarToken;