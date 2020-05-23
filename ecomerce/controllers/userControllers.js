const UserModel = require('../models/userModel');
const transporter = require('../config/nodemailer');
const bcrypt = require('bcryptjs');
const UserController = {}
//const  {isConfirmado}= require('../middleware/verificar')

const jwt = require('jsonwebtoken');
const config = process.env.secret


UserController.createUser = async (req, res) => {
    try {
        const user = await UserModel.create(req.body);
          await transporter.sendMail({
            to:user.email,
            html:`
            <img src= "https://www3.gobiernodecanarias.org/medusa/ecoescuela/lenguasextranjerasceplanzarote/files/2019/09/2771039.jpg" width="400" height="300" alt="Bienvenido/Welcome"/>
            <h3>Bienvenid@ al restaurant ${user.name} </h3>
            
            <div> Haz click <a href="http://localhost:3000/users/confirm/${user._id}">  aquí  </a>Para confirmar tu registro</div>
            `
        })  
        res
            .status(201)
            .json({ user, message: 'User successfully created' })
    } catch (error) {
        console.error(error)
        res
            .status(500)
            .json({ message: 'Problem registering a user' });

    }
};
UserController.confirmEmailUser= async(req,res) =>{
try {
    const userData= await UserModel.findByIdAndUpdate(req.params.id,{confirmado: true},{new:true})
    console.log(userData)
    res.json({message:'correo verificado'})
} catch (error) {
    console.error(error)
        res
            .status(500)
            .json({ message: 'Problem to valid a user' });
}


}
UserController.loginUser = async (req, res) => {
    try {
      
    const usuario = await UserModel.findOne({email: req.body.email})
    console.log(usuario) 

    if(usuario.confirmado === true){

        const userLogin = await UserModel.findOne({
            email: req.body.email
        })
        if (!userLogin) {
            res
                .status(400)
                .send({
                    message: 'This user does not exist'
                });
        }
        const isMatch = await bcrypt.compare(req.body.password, userLogin.password);
        if (!isMatch) {
            res
                .status(400)
                .send({
                    message: 'Key error'
                });
        }
        const token = jwt.sign({ _id: userLogin._id }, config, {
            expiresIn: '2y' //2AÑOS
        });
        await UserModel.findByIdAndUpdate(userLogin._id, {
            $push: {
                tokens: token
            }
        });
        res
            .status(202)
            .json({
                userLogin,
                token,
                message: 'WELCOME ' + userLogin.name
            });

    }else{
        res.json({message:'NO validado el corre0'})
    }  

 
    }
    catch (error) {
        console.error(error)
        res
            .status(500)
            .send({
                message: 'UPSSS , login problems'
            })
    }

}
UserController.readUser = async (req, res) => {
    try {

        let { id } = req.params;
        const userData= await UserModel.findById(id)
        if (!userData) {
        return res
        .status(200)
        .json({ message: 'There is no such user mmg' })
        }
        res
        .json({userData})
    
    }
    catch (error) {
        console.error(error)
         res
            status(500)
            .json({ message: 'problem when viewing user data' });
    
            }
}
UserController.getAllUsers = async (req, res) => {

    try {
 
         if(req.body.role === 'administrador'){
            const users = await UserModel.find()
            res.json({users})
        }else{
            res.json({message:'Sorry you are not admin'})
        }

    } catch (error) {

        console.error(error);
        res
            .status(500)
            .send(error)

    }

}
UserController.updateUser = async (req, res) => {
    try {
    
        let usuario = await UserModel.findByIdAndUpdate(req.params.id, req.body, { new: true});
        console.log(usuario)
        res.json({ usuario, message: 'usuario actualizado' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Problem editing user data' });
    }
}

UserController.deleteUser = async (req, res) => {
    try {
        let { id } = req.params
        await UserModel.findByIdAndDelete(id)
        res.json({ message: 'Delete User' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Problem removing user' })
    }
}
UserController.logout= async (req, res)=> {
     const usuarioLogOut = await UserModel.findByIdAndUpdate(req.params.id, {
            $pull: {
                tokens: req.headers.authorization
            }
        },{ new: true})
res.json({usuarioLogOut, message:`${usuarioLogOut.name} cerro sesión`})
},

module.exports = UserController;