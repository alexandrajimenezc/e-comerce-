const {Schema, model} = require('mongoose');
const ObjectId = Schema.Types.ObjectId;
const CategorySchema = new Schema({
    name:{
        type: String,
        required: true
    },
    products:[{
        type: ObjectId ,
        ref:'Product'
    }]
},{
    timestamps: true    
})

module.exports= model('Category', CategorySchema)