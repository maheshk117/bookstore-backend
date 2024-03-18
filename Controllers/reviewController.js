const express = require("express");
const router = express.Router();
const app = express();
const bookModel = require("../Models/BookModel");
const Usermodel = require("../Models/UserModel");


const addBookReview = async (req, res) => {
    try {
        const { rev, userid, rating } = req.body;
        const id = req.params.id;

        if (!rev || !userid) return res.status(400).json({ message: "Insufficent Data" });

        const foundBook = await bookModel.findById(id).exec();
       

        if (!foundBook) return res.status(404).json({ message: "Resource not found" });

        let duplicate = false;

        for (const review of foundBook.reviews) {
            if (review.userid === userid) {
                duplicate = true;
                break;
            }
        }
       

        if (duplicate) return res.status(409).json({ message: "Already Submitted the Review" });

         
        const user = await Usermodel.findById(userid).select("name").lean();
            const {name} = user;
        foundBook.reviews.push({ userid, rev, rating, name });

         const updatedReview = await foundBook.save();

        
        res.status(201).json({ message: "Review added" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const getBookReview = async (req, res) => {
    try {
        const id = req.params.id;

        const review = await bookModel.findById(id).select("reviews").lean();
    



        if (!review) return res.status(404).json({ message: " Resource not found" });
         
        let currTotalRating = 0;
        console.log(review.reviews)
        review.reviews.forEach( item => {
             
          currTotalRating = currTotalRating+item.rating
          console.log(currTotalRating)

        });
        let avgRating =0;

        if(review.reviews.length)
        {
             avgRating = (currTotalRating/(review.reviews.length)).toFixed(2) 
            console.log(avgRating)
        }
       

        res.json({ review , avgRating });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
};

module.exports = { addBookReview, getBookReview };
