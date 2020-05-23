const orderModel = require('../models/orderModel')
//const transporter = require('../config/nodemailer')
//const userModel = require('../models/userModel')
orderController={}

orderController.createOrder = async (req ,res) =>{
    try {
        
       // let {status,deliveryDate,products,user,_id} = req.body
       //req.body.user = req.user._id

        req.body.status = 'pending';
        const createNewOrder = await orderModel.create(req.body)
        /* await transporter.sendMail({

            to:user.email,
            html:`
            <h3>Gracias por tu compra ${user.name} </h3>
            
            <div> Orden de compra : </div>
            `
        })  */
        res
            .status(201)
            .json({createNewOrder, message:''})
            
    } catch (error) {
    console.error(error)
    res
        .status(500)
        .json({message:'Problema con la orden'})
    }
};

module.exports = orderController;