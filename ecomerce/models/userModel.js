const { Schema, model } = require('mongoose');
const bcrypt= require('bcryptjs');

const UserSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            index: true,
            unique: true,
            sparse: true,
            trim: true
        },
        email:{
            type:String,
            required: [true,'Ingrese un Email'],
            unique: true
        },
        password:{
            type:String,
            required:[true,'Ingrese una contraseña'],
            minlength:8
        },
        role:{
            type:String,
            default:'usuario',
            enum:['usuario','vendedor','administrador']
        },
        tokens:[String]
    }, {
        timestamps: true
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

