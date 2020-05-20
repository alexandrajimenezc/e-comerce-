require('dotenv').config()
const mongoose = require('mongoose')
const URI =process.env.MONGODB_URI 
mongoose.connect(URI,{
    useNewUrlParser:true ,
    useUnifiedTopology:true,
    useCreateIndex:true,
    useFindAndModify:false

})
.then(()=>console.log('connected to db'))
.catch(console.error);