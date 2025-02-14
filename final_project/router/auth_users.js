const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
    // Check if username exists in the users array
    const user = users.find(user => user.username === username);
    return user !== undefined;
};

const authenticatedUser = (username,password)=>{
    // Check if username and password match the one in records
    const user = users.find(user => user.username === username && user.password === password);
    return user !== undefined;
};

//only registered users can login
regd_users.post("/login", (req,res) => {
    try {
        // Get username and password from request body
        const { username, password } = req.body;

        // Validate input
        if (!username || !password) {
            return res.status(400).json({
                message: "Username and password are required"
            });
        }

        // Check if username is valid
        if (!isValid(username)) {
            return res.status(404).json({
                message: "Username not found"
            });
        }

        // Check if username and password match
        if (!authenticatedUser(username, password)) {
            return res.status(401).json({
                message: "Invalid username or password"
            });
        }

        // Generate JWT token
        const token = jwt.sign({ username: username }, '493c1b4535d39d74e1aa7af92b785d7ab6343d05ff26b75d3dce673d330ca7fd', { expiresIn: '1h' });

        // Return JWT token
        return res.status(200).json({
            message: "Login successful",
            token: token
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error during login",
            error: error.message
        });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    try {
        // Get ISBN from request parameters
        const isbn = req.params.isbn;

        // Get reviews from request query
        const review = req.query.review;

        // Get username from session (assuming JWT token is verified and username is stored in the session)
        const username = req.username;

        // Check if ISBN exists in books
        if (!books[isbn]) {
            return res.status(404).json({
                message: "Book not found with ISBN: " + isbn
            });
        }

        // Check if review is provided
        if (!review) {
            return res.status(400).json({
                message: "Review is required"
            });
        }

        // Check if username is provided (should be stored in the session)
        if (!username) {
            return res.status(401).json({
                message: "You must be logged in to post a review"
            });
        }

        // Add or modify review
        if (books[isbn].reviews && books[isbn].reviews[username]) {
            // Modify existing review
            books[isbn].reviews[username] = review;
        } else {
            // Add new review
            if (!books[isbn].reviews) {
                books[isbn].reviews = {};
            }
            books[isbn].reviews[username] = review;
        }

        return res.status(200).json({
            message: "Review added/modified successfully",
            isbn: isbn,
            review: review
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error adding/modifying review",
            error: error.message
        });
   }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
