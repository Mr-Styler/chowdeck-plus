const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/User');
const AppError = require('../utils/appError');

const auth = async (req, res, next) => {
    try {
        let token;

        // Get the Authorization header
        const authHeader = req.headers.authorization;

        // Check if the Authorization header is present and starts with 'Bearer '
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1]; // Extract the token from the header
        } else if (req.cookies && req.cookies.jwt) {
            token = req.cookies.jwt; // Extract the token from cookies
        }

        // If no token is found, return an error
        if (!token) {
            return next(new AppError('Authorization token missing', 401));
        }

        // Verify the JWT token asynchronously using a promise-based approach
        const user = await jwt.verify(token, process.env.JWT_SECRET);
        console.log(user);

        // Attach user information to the request object
        req.user = await User.findById(user.id);
        console.log(req.user);

        // Move to the next middleware or route handler
        next();
    } catch (error) {
        console.log(error);
        next(new AppError("Invalid or expired Token", 401));
    }
};


module.exports = auth;