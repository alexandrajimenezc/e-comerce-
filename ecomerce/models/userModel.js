const { Schema, model } = require('mongoose');
const ObjectId = Schema.Types.ObjectId;
const bcrypt= require('bcryptjs');

const UserSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            index: true,
            sparse: true,
            trim: true
        },
        username:{
            type:String,
            required: [true,'Ingrese un Email'],
            unique: true,
            index: true,
            trim: true
        },
        email:{ 
            type:String,
            required: [true,'Ingrese un Email'],
            unique: true,
            index: true
        },
        confirmado:{
            type:Boolean,
            default:false
        }
        ,
        password:{
            type:String,
            required:[true,'Ingrese una contraseña'],
            minlength:8
        },
        address:{
            type:String,
            required:true
        },
        role:{
            type:String,
            default:'usuario',
            enum:['usuario','vendedor','administrador']
        },
        tokens:[String],
        //ORDER PARA LOS USUARIOS Y VENDEDORES
        orders:[{
            type:ObjectId,
            ref:'Order'
        }],
        //PARA LOS VENDEDORES
        products:[{
            type: ObjectId ,
            ref:'Product'
        }],
        comment:[{
            type:ObjectId,
            ref:'Comments'
        }],

    }, {
        timestamps: true,
        toJSON: {
            transform: (doc, ret) => {
                delete ret.password;
                delete ret.tokens;
                return ret
            }
        }
    })
 
 UserSchema.pre('save', async function(next) {
    try {
        const usuario = this;
       // console.log(usuario);
         const salt= await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(usuario.password, salt);
        //console.log(usuario.password);
    } catch (error) {
        console.error(error);
    } finally {
        next();
    }
})  
 



   
module.exports = model('User', UserSchema);

