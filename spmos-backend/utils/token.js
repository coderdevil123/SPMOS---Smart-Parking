const jwt = require('jsonwebtoken');

/**
 * Generates a JWT token for the given user ID.
 * @param {string} id - The user ID to encode in the token payload.
 * @returns {string} The signed JWT token.
 */
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

module.exports = generateToken;