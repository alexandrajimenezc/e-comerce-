const { Schema, model } = require('mongoose');
const ObjectId = Schema.Types.ObjectId
const OrderSchema = new Schema({

    status: {
        type: String,
        required: true
    },
    deliveryDate: {
        type: Date
    },
    products: [{
        _id: {
            type: ObjectId,
            ref: 'Product'
        },
        cantidad: Number
    }],
    user: {
        type: ObjectId,
        ref: 'User',
        
    }
}, {
    timestamps: true
})
module.exports = model('Order', OrderSchema)