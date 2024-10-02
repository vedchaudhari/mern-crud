const jwt = require('jsonwebtoken');
const User = require('../models/user.model.js');

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.jwt; //check if token is set

        if (!token) {
            return res.status(401).json({ error: "Unauthorized - No Token Provided" });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        if (!decoded) {
            return res.status(401).json({ error: "Unauthorized - Invalid Token" });
        }

        // Find user from decoded data
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Attach user to request object
        req.user = user;
        console.log("User attached to req: ", req.user);

        next();

    } catch (error) {
        console.log("Error in authMiddleware: ", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = authMiddleware;
