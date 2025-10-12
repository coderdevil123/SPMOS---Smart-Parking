const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import User model for potential lookup

/**
 * Express middleware to authenticate the user based on the JWT token 
 * provided in the Authorization header (Bearer token).
 * Attaches the decoded user payload to req.user.
 */
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Expects 'Bearer TOKEN'

    if (token == null) {
        return res.status(401).json({ message: 'Authorization token missing.' }); // Unauthorized
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            // Token is invalid, expired, or malformed
            return res.status(403).json({ message: 'Invalid or expired token.' }); // Forbidden
        }
        
        // Payload is valid, attach it to the request
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;
