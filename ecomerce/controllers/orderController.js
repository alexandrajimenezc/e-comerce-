const orderModel = require('../models/orderModel')
const transporter = require('../config/nodemailer')
const userModel = require('../models/userModel')
orderController={}

orderController.createOrder = async (req ,res) =>{
    try {
        
       
       req.body.status = 'pending';
       const createNewOrder = await orderModel.create(req.body)
       const usuario = await userModel.findById(req.body.user)
          await transporter.sendMail({

            to:usuario.email,
            html:`
            <h3>Gracias por tu compra ${usuario.name} </h3>
            
            <div> Orden de compra:</br>Producto: </br> ${createNewOrder.products[0]._id} </br> Cantidad:</br> ${createNewOrder.products[0].cantidad} </div>
            `
        })   
        console.log(createNewOrder.products[0].cantidad)
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