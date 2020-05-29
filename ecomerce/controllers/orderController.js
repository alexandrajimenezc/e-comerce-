const orderModel = require('../models/orderModel')
//const transporter = require('../config/nodemailer')
const userModel = require('../models/userModel')
orderController={}
//Crear compra
orderController.createOrder = async (req ,res) =>{
    try {
        // l14 create.order._id
       
       req.body.status = 'pending';
       const createNewOrder = await orderModel.create(req.body)
       const usuario = await userModel.findByIdAndUpdate(req.body.user, {
        $push: {
            orders: createNewOrder._id
        }
    });
       console.log(usuario)
       //findById(req.body.user)
       /*    await transporter.sendMail({

            to:usuario.email,
            html:`
            <h3>Gracias por tu compra ${usuario.name} </h3>
            
            <div> Orden de compra: Producto: ${createNewOrder.products[0]._id}  Cantidad: ${createNewOrder.products[0].cantidad} </div>
            `
        })   
        console.log(createNewOrder.products[0].cantidad) */
        res
            .status(201)
            .json({createNewOrder, message:''})
            
    } catch (error) {
    console.error(error)
    res
        .status(500)
        .json({message:'Problema con la orden de compra'})
    }
};
//ver compras

orderController.readAllOrders = async (req, res) =>{

    try {
      const readorders = await orderModel.find()

        res
            .status(201)
            .json({readorders, message:''})
    } catch (error) {
        console.error(error)
    res
        .status(500)
        .json({message:'Problema al ver la orden de compra'})
    }
}
orderController.readOrder = async (req, res) =>{

    try {
      const readorders = await orderModel.findById(req.params.id)

        res
            .status(201)
            .json({readorders, message:''})
    } catch (error) {
        console.error(error)
    res
        .status(500)
        .json({message:'Problema al ver la orden de compra'})
    }
}



orderController.updateOrder = async (req, res) =>{
    try {
        let ordereditada= await orderModel.findByIdAndUpdate(req.params.id, req.body, { new: true});
        console.log(ordereditada)
        res.json({ ordereditada, message: 'usuario actualizado' })
    } catch (error) {
        
    }
}

orderController.deleteOrder = async (req, res) => {
    try {
        


        let { id } = req.params;
        let order = await orderModel.findById(id)
        console.log(order.user)
        let user = await userModel.findByIdAndUpdate(order.user,{
            $pull:{
                orders: order._id 
            }
        },{new: true})
        console.log(user)
       // await orderModel.findByIdAndDelete(id)
        res.json({user,  message: 'Delete Order' })
    } catch (error) {
        console.error(error)
    res
        .status(500)
        .json({message:'Problema al borrar la orden de compra'})  
    }

}



// ver todas las compras
//modifica compra (por vendedor)
//borrar compra 
//factura
module.exports = orderController;