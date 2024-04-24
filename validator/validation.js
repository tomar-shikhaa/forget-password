const { body } = require('express-validator');

exports.userValidator = [
    body('UserName').notEmpty().withMessage('Name is required'),
    body('Email').isEmail().trim().escape().normalizeEmail().withMessage('Invalid email format'),
    body('Password').notEmpty().withMessage('Password is required').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
];

// const jwt = require('jsonwebtoken');
// const User = require('../model/shikha');

// const authMiddleware = async (req, res, next) => {
//     // Get the token from the request headers
//     const token = req.headers.authorization;

//     if (!token) {
//         return res.status(401).json({ message: 'No token provided' });
//     }

//     try {
//         // Verify the token
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
//         // Fetch the user from the database using the user ID from the token
//         const user = await User.findByPk(decoded.userId);

//         if (!user) {
//             return res.status(401).json({ message: 'Invalid token' });
//         }

//         // Attach the user information to the request object
//         req.user = user;
//         next();
//     } catch (error) {
//         return res.status(401).json({ message: 'Invalid token' });
//     }
// };

// module.exports = authMiddleware;
