const {Schema, model}= require('mongoose');
const ObjectId = Schema.Types.ObjectId;
const productsSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price:{
        type:Number,
        required : true
    },
    image_path:{
        type:String,
        required:true
    },
    wishListP: [{  
        type: ObjectId,
        ref: 'User'
    }],
    categories:[{
        type: ObjectId,
        ref:'Category'
    }],
    stock: {
        type: Number,
        required: [true, 'El campo stock es requerido']
    },
    commentsOfProduct:[{
        assessment: Number,
        userId: { 
            type: ObjectId,
             ref: 'User' 
            },
        comments: String,
        image_path: String,
        commentsDate: Date
        
    }],
    orderIds: [{
        type: ObjectId,
        ref: 'Order'
    }],
    userId:[{
        type: ObjectId,
        ref: 'User'
    }]
},{
    timestamps: true    
})

module.exports = model('Product',productsSchema)