const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
    // Check if user has an active session
    if (req.session && req.session.authorized) {
        // Check if access token exists and is valid
        if (req.session.token) {
            try {
                // Verify the token 
                if (req.session.token === req.headers.authorization) {
                    // Token is valid, proceed to next middleware
                    next();
                } else {
                    res.status(401).json({
                        message: "Invalid token"
                    });
                }
            } catch (err) {
                res.status(401).json({
                    message: "Token verification failed",
                    error: err.message
                });
            }
        } else {
            res.status(401).json({
                message: "No token provided"
            });
        }
    } else {
        res.status(401).json({
            message: "Unauthorized access. Please login first."
        });
    }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
