const  mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    name:String,
    email:String,
    password:String,
    phone:Number,
    roles:{
        type:[Number],
        default:8765
    }
  
},{timestamps:true})


const Usermodel = mongoose.model('User', UserSchema)


module.exports= Usermodel;