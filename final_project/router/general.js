const express = require('express');
const axios = require("axios");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    try {
        // Get username and password from request body
        const { username, password } = req.body;

        // Validate input 
        if (!username && !password) {
            return res.status(400).json({
                message: "Username and password are required"
            });
        }

        if (!username) {
            return res.status(400).json({
                message: "Username is required"
            });
        }

        if (!password) {
            return res.status(400).json({
                message: "Password is required"
            });
        }

        // Check password strength
        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters long"
            });
        }

        // Check if username already exists
        const userExists = users.find(user => user.username === username);
        if (userExists) {
            return res.status(409).json({
                message: "Username already exists"
            });
        }

        // Create new user
        const newUser = {
            username: username,
            password: password
        };

        // Add user to users array
        users.push(newUser);

        return res.status(201).json({
            message: "User registered successfully",
            username: username
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error during registration",
            error: error.message
        });
    }
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    try {
        const response = await axios.get("http://localhost:5000/api/books");
        const books = response.data;

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
public_users.get('/isbn/:isbn', async function (req, res) {
    try {
        // Get ISBN from request parameters
        const isbn = req.params.isbn;

        // Use Axios to make a GET request to the book endpoint
        const response = await axios.get(`http://localhost:5000/api/books/${isbn}`);

        // Check if book exists
        if (response.data) {
            return res.status(200).json({
                message: "Book found successfully",
                book: response.data
            });
        } else {
            return res.status(404).json({
                message: "Book not found with ISBN: " + isbn
            });
        }
    } catch (error) {
        // Handle any unexpected errors
        return res.status(500).json({
            message: "Error retrieving book",
            error: error.message
        });
    }
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    try {
        // Get author from request parameters
        const author = req.params.author;

        // Use Axios to make a GET request to the books endpoint
        const response = await axios.get("http://localhost:5000/api/books");

        // Filter books by author
        const authorBooks = response.data.filter(book => book.author.toLowerCase() === author.toLowerCase());

        // Check if any books were found
        if (authorBooks.length > 0) {
            return res.status(200).json({
                message: "Books found for author: " + author,
                books: authorBooks
            });
        } else {
            return res.status(404).json({
                message: "No books found for author: " + author
            });
        }
    } catch (error) {
        // Handle any unexpected errors
        return res.status(500).json({
            message: "Error retrieving books",
            error: error.message
        });
    }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    try {
        // Get title from request parameters
        const title = req.params.title;

        // Use Axios to make a GET request to the books endpoint
        const response = await axios.get("http://localhost:5000/api/books");

        // Filter books by title
        const titleBooks = response.data.filter(book => book.title.toLowerCase().includes(title.toLocaleLowerCase()));

        // Check if any books were found
        if (titleBooks.length > 0) {
            return res.status(200).json({
                message: "Books found with title: " + title,
                books: titleBooks,
                total_books: titleBooks.length
            });
        } else {
            return res.status(404).json({
                message: "No books found with title: " + title
            });
        }
    } catch (error) {
        // Handle any unexpected errors
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
