const orderModel = require('../models/orderModel')
const transporter = require('../config/nodemailer')
const ProductsModel = require('../models/ProductsModel')
const userModel = require('../models/userModel')
orderController = {}

orderController.createOrder = async (req, res) => {
    try {


        req.body.status = 'pending';
        req.body.user = req.userMiddle._id
        const createNewOrder = await orderModel.create(req.body)
        const userMiddle = await userModel.findByIdAndUpdate(req.body.user, {
            $push: {
                orders: createNewOrder._id
            }
        });
        let idp = createNewOrder.products[0]._id
        const product = await ProductsModel.findByIdAndUpdate(idp, {
            $push: {
                orderIds: idp
            }
        })


        console.log(product)
        await transporter.sendMail({

            to: userMiddle.email,
            html: `
            <h3>Gracias por tu compra ${userMiddle.name} </h3>
            
            <div> Orden de compra: Producto: ${createNewOrder.products[0]._id}  Cantidad: ${createNewOrder.products[0].cantidad} </div>
            `
        })
        console.log(createNewOrder.products[0].cantidad)
        res
            .status(201)
            .json({ createNewOrder, message: 'Order created' })

    } catch (error) {
        console.error(error)
        res
            .status(500)
            .json({ message: 'Purchase order problem' })
    }
};



orderController.readOrder = async (req, res) => {

    try {
        const readorders = await orderModel.findById(req.params.id)

        res
            .status(201)
            .json({ readorders, message: 'Read order' })
    } catch (error) {
        console.error(error)
        res
            .status(500)
            .json({ message: 'Problem seeing purchase order' })
    }
}




orderController.readAllOrders = async (req, res) => {

    try {
        const readorders = await orderModel.find()

        res
            .status(201)
            .json({ readorders, message: 'Read all the orders' })
    } catch (error) {
        console.error(error)
        res
            .status(500)
            .json({ message: 'Problem seeing purchase orders' })
    }
}



orderController.updateOrder = async (req, res) => {
    try {
        const buscandoOrder = await orderModel.findById(req.params.id)
        console.log(buscandoOrder.products[0]._id)//producto
        //console.log(buscandoOrder.)

        /* let orderEditada= await orderModel.findByIdAndUpdate(req.params.id, req.body, { new: true});
        console.log(orderEditada) */

        /*  await transporter.sendMail({
 
             to:userMiddle.email,
             html:`
             <h3>Tu order a sido editada ${userMiddle.name} </h3>
             
             <div> Orden de compra: Producto: ${createNewOrder.products[0]._id}  Cantidad: ${createNewOrder.products[0].cantidad} </div>
             `
         })   
  */

        res.json({ buscandoOrder, message: 'Updating order' })
    } catch (error) {
        console.error(error)
        res
            .status(500)
            .json({ message: 'Problem updating the order' })
    }
}


orderController.deleteOrder = async (req, res) => {
    try {

        let { id } = req.params;
        let order = await orderModel.findById(id)
        console.log(order.user)
        let user = await userModel.findByIdAndUpdate(order.user, {
            $pull: {
                orders: order._id
            }
        }, { new: true })
        console.log(user)

        res.json({ user, message: 'Delete Order' })
    } catch (error) {
        console.error(error)
        res
            .status(500)
            .json({ message: 'Problem deleting purchase order' })
    }

}




module.exports = orderController;