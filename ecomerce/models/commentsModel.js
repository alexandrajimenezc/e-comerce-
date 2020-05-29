const {Schema, model} = require('mongoose');
const ObjectId = Schema.Types.ObjectId;

const commentsSchema = new Schema({
    text:{
        type: String
    },
    userId: {
        type: ObjectId,
        ref: 'User'
    },
    products:[{
        type: ObjectId ,
        ref:'Product'
    }]
})

module.exports = model('Comments',commentsSchema);