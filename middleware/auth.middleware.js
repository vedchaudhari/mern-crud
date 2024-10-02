const jwt = require('jsonwebtoken');
const User = require('../models/user.model.js');

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.jwt; // Ensure this token is set

        if (!token) {
            return res.status(401).json({ error: "Unauthorized - No Token Provided" });
        }

        // Verify JWT
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        if (!decoded) {
            return res.status(401).json({ error: "Unauthorized - Invalid Token" });
        }

        // Find the user based on decoded userId from the token
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Attach user to request object
        req.user = user;
        console.log("User attached to req: ", req.user); // Log the user to verify

        next();

    } catch (error) {
        console.log("Error in authMiddleware: ", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = authMiddleware;
