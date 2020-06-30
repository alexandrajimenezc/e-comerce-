const UserModel = require('../models/userModel');
const transporter = require('../config/nodemailer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = process.env.secret
const UserController = {}




UserController.createUser = async (req, res) => {
    try {
        const user = await UserModel.create(req.body);
        req.body.role = "userMiddle";
        const emailtoken = jwt.sign( { email: user.email }, config, { expiresIn: '2d' } )
        const url = 'http://localhost:3000/users/confirm/' + emailtoken
           await transporter.sendMail({
            to:user.email,
            html:`
            <img src= "https://www3.gobiernodecanarias.org/medusa/ecoescuela/lenguasextranjerasceplanzarote/files/2019/09/2771039.jpg" width="400" height="300" alt="Bienvenido/Welcome"/>
            <h3>Bienvenid@ al E-comerce ${user.name} </h3>
            
            <div> Haz click <a href="${url}">  aquí  </a>Para confirmar tu registro</div>
            `
        })   
        transporter.close();
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

    const token = req.params.emailtoken;
    const email = jwt.verify( token, config ).email
    const userData= await UserModel.findOneAndUpdate({email},{confirmado: true},{new:true})
    console.log(userData)
    res.json({message:'verified mail'})
} catch (error) {
    console.error(error)
        res
            .status(500)
            .json({ message: 'Problem to valid a user' });
}


}
UserController.loginUser = async (req, res) => {
    try {
      
 
        const userMiddle = await UserModel.findOne({
            $or: [{email: req.body.email},  { username: req.body.username }]
        })
        console.log(userMiddle) 

        if (!userMiddle) {
            res
                .status(400)
                .send({
                    message: 'This user does not exist/Password or user error'
                });
        }
        const isMatch = await bcrypt.compare(req.body.password, userMiddle.password);
        if (!isMatch) {
            res
                .status(400)
                .send({
                    message: 'Password or user error'
                });
        }
        const token = jwt.sign({ _id: userMiddle._id }, config, {
            expiresIn: '2y' //2AÑOS
        });
        await UserModel.findByIdAndUpdate(userMiddle._id, {
            $push: {
                tokens: token
            }
        });
        res
            .status(202)
            .json({
                userMiddle,
                token,
                message: 'WELCOME ' + userMiddle.name
            });

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

        /*  let { id } = req.params;
        const userData= await UserModel.findById(id).populate('orders')
        if (!userData) {
        return res
        .status(200)
        .json({ message: 'There is no such user mmg' })
        }  */


/* //probar así
        const userMiddle= await UserModel.findById(req.userMiddle._id)
        .populate('wishList')
        .populate('orders')

        res
            .json({userMiddle}) */
        //solo esto y devuelve la inf del userMiddle
        res
        .json({userMiddle: req.userMiddle.populate('orders')})
    
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
    
        const users = await UserModel.find()
       // console.log(req.body.role)
        res
            .status(200)
            .json({users})

    

    } catch (error) {

        console.error(error);
        res
            .status(500)
            .json({ message: 'problem getting users' });

    }

}

UserController.updateUser = async (req, res) => {
    try {
        console.log(req.userMiddle.role)
        if(req.userMiddle.role === 'userMiddle') req.body.role = 'userMiddle';
        console.log(req.userMiddle.role)
        const userData = { ...req.body }
        if ( req.file ) userData.imagePath = req.file.filename;
        if ( req.body.password ) userData.password = await bcrypt.hash( req.body.password, 10 );
        const userMiddle = await UserModel.findByIdAndUpdate( req.userMiddle._id, userData, { new: true } )
        res.json({ userMiddle, message: 'updated user' })

    
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Problem editing user data' });
    }
}
UserController.updateUserA = async (req, res) => {
    try {
      

        let userMiddle = await UserModel.findByIdAndUpdate(req.params.id, req.body, { new: true});
        console.log(userMiddle)
        res.json({ userMiddle, message: 'updated user' }) 
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Problem editing user data' });
    }
}

// falta que si se borra el userMiddle se eliminen sus productos
UserController.deleteUser = async (req, res) => {
    try {

        await UserModel.findByIdAndDelete( req.userMiddle._id )
        res.json({ message: 'Deleted User' })
      
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Problem removing user' })
    }
}

UserController.deleteUserA = async (req, res) => {
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
     const userMiddleLogOut = await UserModel.findByIdAndUpdate(req.userMiddle._id, {
            $pull: {
                tokens: req.headers.authorization
            }
        },{ new: true})
res.json({userMiddleLogOut, message:`${userMiddleLogOut.name} cerro sesión`})
}


UserController.resetPassword= async (req,res) =>{
        try {  
  
            console.log(req.userMiddle)
            console.log(req.body)
            console.log(req.body.password)
            const salt= await bcrypt.genSalt(10);
            const password_Key= await bcrypt.hash(req.body.password, salt);
            const user = await UserModel.findOneAndUpdate({email: req.userMiddle.email},{password: password_Key},{new:true})

            console.log(password_Key)
            console.log(user)
            res.json({userMiddle: req.userMiddle})

       
        
        } catch (error) {
            console.error(error);
            res.status(500).send({message:'There was a problem trying to reset the password'})
        }
    } 


    //pq del params y no del body??

/* UserController.recover = async (req, res) =>{
    try {
 
        const recoverToken = jwt.sign({email:req.params.email},config,{expiresIn:'48h'})
        const url ='http://localhost:3000/users/recover/' + recoverToken
    
        await transporter.sendMail({
            to: req.params.email,
            subject:'Recupere su cuenta',
            html:`
            <h3>Recupere su cuenta</h3>
            <a href="${url}">Click aquí</a>
            Este link se explota en 48 horas
            `
        })
        res.json({message:'Un msj de recuperacíon fue enviado a su email'})
    } catch (error) {
        console.error(error)
        res
            .status(500)
            .json({error})
    }
} */
//enviar a una vista cont vieja , cont nva
//arrgalar estooo
/* UserController.confirmRecover= async(req,res) =>{
    try {
        const token = req.params.recoverToken;
        
        console.log(token)
        res.json({message:'correo recuperado'})
    } catch (error) {
        console.error(error)
            res
                .status(500)
                .json({ message: 'Problem to valid a user' });
    }

} */
module.exports = UserController;