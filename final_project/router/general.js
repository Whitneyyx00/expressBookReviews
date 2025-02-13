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
    try {
        // Get ISBN from request parameters
        const isbn = req.params.isbn;

        // Check if ISBN is provided
        if (!isbn) {
            return res.status(400).json({
                message: "ISBN parameter is required"
            });
        }

        // Check if book with ISBN exists
        if (books[isbn]) {
            return res.status(200).json({
                message: "Book found successfully",
                book: books[isbn]
            });
        } else {
            return res.status(404).json({
                message: "Book not found with ISBN: " + isbn
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: "Error retrieving book details",
            error: error.message
        });
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    try {
        // Get author from request parameters
        const requestedAuthor = req.params.author;

        // Check if author parameter is provided
        if (!requestedAuthor) {
            return res.status(400).json({
                message: "Author parameter is required"
            });
        }

        // Get all book ISBNs
        const bookISBNs = Object.keys(books);

        // Filter books by the requested author
        const authorBooks = bookISBNs.reduce((result, isbn) => {
            if (books[isbn].author.toLowerCase() === requestedAuthor.toLowerCase()) {
                result[isbn] = books[isbn];
            }
            return result;
        }, {});

        // Check if any books were found
        if (Object.keys(authorBooks).length > 0) {
            return res.status(200).json({
                message: "Books found for author: " + requestedAuthor,
                books: authorBooks
            });
        } else {
            return res.status(404).json({
                message: "No books found for author: " + requestedAuthor
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: "Error retrieving books",
            error: error.message
        });
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    try {
        // Get title from request parameters
        const requestedTitle = req.params.title;

        // Check if title parameter is provided
        if (!requestedTitle) {
            return res.status(400).json({
                message: "Title parameter is required"
            });
        }

        // Get all book ISBNs
        const bookISBNs = Object.keys(books);

        // Filter books by the requested title
        const titleBooks = bookISBNs.reduce((result, isbn) => {
            // Case insensitive comparison and includes partial matches
            if (books[isbn].title.toLowerCase().includes(requestedTitle.toLowerCase())) {
                result[isbn] = books[isbn];
            }
            return result;
        }, {});

        // Check if any books were found
        if (Object.keys(titleBooks).length > 0) {
            return res.status(200).json({
                message: "Books found with title: " + requestedTitle,
                books: titleBooks,
                total_books: Object.keys(titleBooks).length
            });
        } else {
            return res.status(404).json({
                message: "No books found with title: " + requestedTitle
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: "Error retrieving books",
            error: error.message
        });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    try {
        // Get ISBN from request parameters
        const isbn = req.params.isbn;

        // Check if ISBN parameter is provided
        if (!isbn) {
            return res.status(400).json({
                message: "ISBN parameter is required"
            });
        }

        // Check if book exists
        if (!books[isbn]) {
            return res.status(404).json({
                message: "Book not found with ISBN: " + isbn
            });
        }

        // Get reviews for the book
        const bookReviews = books[isbn].reviews;

        // Check if book has any reviews
        if (bookReviews && Object.keys(bookReviews).length > 0) {
            return res.status(200).json({
                message: "Reviews found for ISBN: " + isbn,
                book_title: books[isbn].title,
                reviews: bookReviews,
                total_reviews: Object.keys(bookReviews).length
            });
        } else {
            return res.status(404).json({
                message: "No reviews found for ISBN: " + isbn,
                book_title: books[isbn].title
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: "Error retrieving book reviews",
            error: error.message
        });
    }
});

module.exports.general = public_users;
