var jwt = require('jsonwebtoken');

const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign(
        { userId },
        process.env.SECRET_KEY,
        { expiresIn: '2h' }
    );

    res.cookie("jwt", token, {
        maxAge: 2*60*60*1000,        // 2hr in milliseconds
        httpOnly: true,              // Prevents JavaScript access (helps protect against XSS)
        sameSite: 'strict',          // Helps protect against CSRF (cross-site request forgery) 
    });
};

module.exports = generateTokenAndSetCookie;