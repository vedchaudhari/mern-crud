const User = require('../models/user.model.js');
const bcrypt = require('bcryptjs');
const generateTokenAndSetCookie = require('../utils/generateTokenAndSetCookie.js');

const signup = async (req, res) => {
    try {
        const { name, age, education, gender, dateOfBirth, email, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords don't match" })
        }

        const existingUser = await User.findOne({ email })

        if (existingUser) {
            return res.status(400).json({ error: "User with this Email already exists" })
        }

        //password hashing
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            age,
            education,
            gender,
            dateOfBirth,
            email,
            password: hashedPassword,
        })

        if (newUser) {

            //jwt token generation 
            generateTokenAndSetCookie(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                name,
                age,
                education,
                gender,
                dateOfBirth,
                email
            })
        }
        else {
            res.status(400).json({ error: "Invalid user data" });
        }




    } catch (error) {
        console.log("Error in signup controller", error.message)
        res.status(500).json({ error: "Internal Server Error" })
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(req.body); 

        const user = await User.findOne({ email });
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

        if (!user || !isPasswordCorrect) {
            return res.status(400).json({ error: "Invalid Credentials" });
        }

        // Set user status to "online"
        user.status = 'online';
        await user.save();

        generateTokenAndSetCookie(user._id, res);

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            status: user.status,
            message: `User is now ${user.status}`
        });


    } catch (error) {
        console.log("Error in login controller", error.message)
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const logout = async (req, res) => {
    try {
        
        const userId = req.user?._id;
        if (!userId) {
            return res.status(400).json({ error: "User is not logged in" });
        }

        // Find the user in the database by the ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Update the status to offline
        user.status = 'offline';
        await user.save(); 

        //remove cookie
        res.cookie("jwt", "", { maxAge: 0 });

        // Send the response
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            status: user.status,
            message: `User is now ${user.status}`
        });

    } catch (error) {
        console.log("Error in logout controller: ", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


module.exports = { signup, login, logout };