const jwt = require('jsonwebtoken');
const config=process.env.secret
const UserModel= require('../models/userModel');

const verificarToken = async(req, res, next) => {
    try {
        const token = req.headers.authorization;
        const decodificar = jwt.verify(token, config);
        const user_Middle = await UserModel.findOne({
            _id: decodificar._id,
            tokens: token
        });
        if (!user_Middle) {
            return res.status(401).json({
                message: 'NO ESTAS AUTORIZADO'
            });
        }
        req.user_Middle = user_Middle;
        next();
    } catch (error) {
        console.error(error)
        res.status(401).json({
            message: 'NO ESTAS AUTORIZADO',
            error
        })
    }
}

// si coloco req.body.role funciona , si coloco req.user.role se rompe , pq estaba con el req.user.role?
const is = (roles) => async(req, res, next) => {
    if (!roles.includes(req.user_Middle.role)) {
        return res.status(403).send({
            message: 'You are not allowed to access this zone'
        })
    }
    next();
}



/* const  isConfirmado =(emaill) => async(req, res, next)=>{

    const user_Middle = await UserModel.findOne({email:emaill})
    if(user_Middle.confirmado !== true){
        return res.status(403).send({
            message: 'No ha validado el correo'
        })
    }
    next()
} */
 


module.exports = {verificarToken, is };