const {Schema, model}= require('mongoose');
const ObjectId = Schema.Types.ObjectId;
const productsSchema = new Schema({
    name:{
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
    categories:[{
        type: ObjectId,
        ref:'Category'
    }]
},{
    timestamps: true    
})

module.exports = model('Product',productsSchema)