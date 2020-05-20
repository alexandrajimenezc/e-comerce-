const UserModel = require('../models/userModels');
const bcrypt = require('bcryptjs')
const UserController = {}

const jwt = require('jsonwebtoken');
const config = process.env.secret


UserController.createUser = async (req, res) => {
    try {
        const user = await UserModel.create(req.body);
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
UserController.loginUser = async (req, res) => {
    try {
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
        const users = await UserModel.find()
        res.send(users)

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


module.exports = UserController;