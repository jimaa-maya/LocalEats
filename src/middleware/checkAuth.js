const jwt = require('jsonwebtoken');

const checkAuth = (req, res, next) => {
    const token = req.cookies.token;

    if (!req.session.user && !token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.userId = decoded.userId;
            req.role = decoded.role; // Include the role in the request object
        } catch (error) {
            return res.status(401).json({ message: 'Invalid token' });
        }
    }

    // User is authenticated, proceed to the next middleware or route handler
    next();
};

module.exports = checkAuth;
