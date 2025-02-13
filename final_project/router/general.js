const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    try {
        // Check if books object is not empty
        if (Object.keys(books).length === 0) {
            return res.status(404).json({
                message: "No books available"
            });
        }

        // Convert the books object to a formatted string
        const booksList = JSON.stringify(books, null, 2);

        // Return the books list with success status
        return res.status(200).json({
            message: "Books retrieved successfully",
            books: JSON.parse(booksList)
        });
    } catch (error) {
        // Handle any unexpected errors
        return res.status(500).json({
            message: "Error retrieving books",
            error: error.message
        });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
