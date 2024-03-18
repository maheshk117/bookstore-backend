const  mongoose = require('mongoose')

const BookSchema = mongoose.Schema({
    title:String,
    author:String,
    isbn:String,
    genre:String,
    year:Date,
    bookcover:String,

    reviews: {
        type: [
            {  
                 
               userid: {
                    type: String,
                    required: false,
                },

                rev:{
                    type:String,
                    required: false
                },

                rating:{
                    type:Number,
                    required:false
                },

                name:{
                     type:String,
                     required:false

                }
                
                
            },
        ],
        default: [],
    },
    random:{
        type:Number,
        default:Math.random()
    },
    Status:{
        type:String,
        default:"Available"
    },
    
},{timestamps:true})


const Bookmodel = mongoose.model('Book', BookSchema)


module.exports= Bookmodel;