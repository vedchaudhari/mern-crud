const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const connectDB = require('./db/database.js');
const cookieParser = require('cookie-parser');

const authRoute = require('./routes/auth.route.js');
const userRoute = require('./routes/user.route.js');

dotenv.config();

// MongoDB URI
const uri = process.env.MONGO_URI;

// Connect to MongoDB
connectDB(uri);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware setup
app.use(express.json()); // For parsing JSON data
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(cookieParser()); // For parsing cookies

// API for login, logout, signup
app.use("/api/auth", authRoute);

// API for get profile, update profile
app.use("/api/user", userRoute);

app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
});
