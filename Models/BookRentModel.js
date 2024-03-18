const  mongoose = require('mongoose')
try {
  
} catch (error) {
  
}
const bookRentSchema = mongoose.Schema({
    bookname:String,
    author:String,
    libraryid:String,
    Name:String,
    phone:String
  },{timestamps:true})


const BookRentModel = mongoose.model('rent', bookRentSchema)


module.exports= BookRentModel;