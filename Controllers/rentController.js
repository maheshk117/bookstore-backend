const userModel = require('../Models/UserModel')
const jwt = require('jsonwebtoken')
require("dotenv").config();
const express = require("express");
const { CleanRooms } = require('aws-sdk');
const router = express.Router();
router.use(express.urlencoded({ extended: true }));
router.use(express.json());
const BookRentModel = require('../Models/BookRentModel')


const rentBook = async (req, res)=>{

    try {
        const {bookname, author, libraryid, phone, Name} = req.body;
        console.log(req.body)
        
        if (!bookname || !author || !libraryid || !phone|| !Name) return res.status(400).json({ message: "All fields are required" });
        
        const review = req.body;
        console.log(review)
        await BookRentModel(review).save();

        res.json({msg:"Rent request submitted successfully"})


        
    } catch (error) {
     console.error(error)
     res.status(500).json({message:"internal server error"})        
    }
}


module.exports= {rentBook}