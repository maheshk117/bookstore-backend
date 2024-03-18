const express = require("express");
const app = express();
const bookModel = require("../Models/BookModel");
const { S3Uploadv2 , getImageSignedUrl} = require("../Helpers/S3Helper");


const getAllBooks = async (req, res) => {
    const books = await bookModel.find().lean();

    // If no notes
    if (!books?.length) {
        return res.status(404).json({ message: "No Books found" });
    }

    for (let book of books) {
        book.imageUrl = await getImageSignedUrl(book.bookcover)
      }




    res.json({ data: books });
};

const createNewBook = async (req, res) => {
    try {
        const { title, author, isbn, genre, year } = req.body;
        console.log(req.body)

        if (!req.file) return res.status(400).json({ message: "Please Select the file" });

        const { uploadResult, storedName } = await S3Uploadv2(req.file);
        req.body.bookcover = storedName;
        console.log(uploadResult);
        console.log(storedName);
        console.log(req.body)


        if (!(title && author && isbn && genre && year)) return res.status(400).json({ message: "Insufficent Data" });

        const book = req.body;
        console.log(req.body);
        console.log(req);

        await bookModel(book).save();

        res.status(201).json({ message: "Book added successfully!!" });

        
    } catch (error) {
        res.status(500).json({ message: "Server error" });
        console.error(error);
    }
};
//to edit a book

const editBook = async (req, res) => {
    try {
        
        const id = req.params.id;
        console.log(id);
        let { title, author, isbn, genre, year, bookcover} = req.body;
          console.log(req.body)
        if (req.file) {
            const { uploadResult, storedName } = await S3Uploadv2(req.file);
            bookcover = storedName;
            console.log("invoked")

        }

        if (!(title && author && genre && isbn && year && bookcover)) return res.status(400).json({ message: "Bad Request! Insufficent data" });

        const foundBook = await bookModel.findById(id).exec();
        if (!foundBook) return res.status(404).json({ message: "Book not found" });

        foundBook.title = title;
        foundBook.author = author;
        foundBook.isbn = isbn;
        foundBook.genre = genre;
        foundBook.year = year;
        if(req.file){
        foundBook.bookcover = bookcover;
        }
        

        const updatedBook = await foundBook.save();

        res.json({ message: "Books details Updated" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
        console.error(error);
    }
};
//to delete a book

const deleteBook = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) return res.status(400).json({ message: "Bad Request!" });
        const foundBook = await bookModel.findById(id).exec();
        if (!foundBook) return res.status(404).json({ message: "Book not found" });
        const result = foundBook.deleteOne();
        res.json({ message: "Book Deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
//to view one book
const getOneBook = async (req, res) => {
    try {
        const id = req.params.id;

        if (!id) return res.status(400).json({ message: "Bad Request!" });

        const foundBook = await bookModel.findById(id).lean().exec();
        if (!foundBook) return res.status(404).json({ message: "Book not found" });
        foundBook.imageUrl = await getImageSignedUrl(foundBook.bookcover);
        res.json({ Data: foundBook });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { createNewBook, editBook, deleteBook, getAllBooks, getOneBook };
