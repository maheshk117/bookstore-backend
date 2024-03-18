const express = require("express");
const router = express.Router();
const app = express();
const bcrypt = require('bcrypt')
const Usermodel = require("../Models/UserModel");


//signUP
//public
 const signUp = async (req, res) => {
    try {
        let { name, email, password, phone } = req.body;

        // Confirm data
        if (!email || !name || !password || !phone) {
            return res.status(400).json({ message: "All fields are required" });
        }
         
        //check for duplicte username
        const duplicate = await Usermodel.findOne({ email }).lean().exec();

        if (duplicate) {
            return res.status(409).json({ message: "Duplicate username" });
        }

        // Hash password
        const hashedPwd = await bcrypt.hash(password, 10);
        const user = {name, email, password:hashedPwd, phone}
        let newUser= await Usermodel(user);
        newUser.save();
        
        res.json({message:"Registration Successfull"});
        

    } catch (error) {
        res.status(500).json({ message: "Server error" });
        console.error(error);
    }
};

//to get a single user details 

const getSingleUser = async (req, res)=>{
    try {
        const id = req.params.id
           console.log(id)
        const users = await Usermodel.findById(id).select("-password").exec();
       
        console.log(users)
        
    // If no users 
    if (!users) {
        return res.status(400).json({ message: 'No users found' })
    }

    res.json(users)
        
    } catch (error) {
        
        console.error(error)
        res.status(500).json({message:"Server Error"})
    }

}


//to get all users
const getAllUsers =  async (req, res)=>{

    try {
        const users = await Usermodel.find({ email: { $ne: 'adminuser456@gmail.com' } }).select('-password').lean()

    // If no users 
    if (!users?.length) {
        return res.status(400).json({ message: 'No users found' })
    }

    res.json(users)
        
    } catch (error) {
        
        console.error(error)
        res.status(500).json({message:"Server Error"})
    }
}
   
//to edit a user details

const editUser = async (req, res)=>{
    try {
        const id =  req.params.id
        console.log(id)
        console.log("hiiii")
        const {name, email, phone} = req.body

      if(!(name && email && phone)) return res.status(400).json({message:"Bad Request! Insufficent data"}) 

      const foundUser = await Usermodel.findById(id).exec();
      if(!foundUser) return res.status(404).json({message:"User not found"})

      foundUser.name = name
      foundUser.email = email
      foundUser.phone = phone
      
      const updatedUser = await foundUser.save();
       
      res.json({message: "User details Updated",  updatedUser})
       

       

    } catch (error) {

         res.status(500).json({ message: "Server error" });
            console.error(error);
    }
}
    //to delete a user

   const  deleteUser = async (req, res )=>{
          

    try {
        const id =  req.params.id
        console.log(id)
        if(!id) return res.status(400).json({message:"Bad Request!"})
        const foundUser = await Usermodel.findById(id).exec();
        if(!foundUser) return res.status(404).json({message:"User not found"})
        const result = foundUser.deleteOne()
         res.json({message:"User Deleted"})

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Server error" });
    }
   }





module.exports = { signUp,getSingleUser, getAllUsers,deleteUser,editUser };
