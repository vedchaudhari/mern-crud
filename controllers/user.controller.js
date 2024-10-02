const User = require('../models/user.model.js');
const bcrypt = require('bcryptjs');

const getUserProfile = async (req, res) => {
    try {
        const userId = req.user?._id;
        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        res.status(200).json(user);



    } catch (error) {
        console.log('Error in getUserProfile controller', error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const updateUserProfile = async (req, res) => {
    const { name, age, education, gender, dateOfBirth, email, currentPassword, newPassword } = req.body;
    const userId = req.user._id;
    try {

        // Find the user
        let user = await User.findById(userId)
        if (!user) return res.status(404).json({ message: "User not found" });

        // Check for current and new password
        if ((!newPassword && currentPassword) || (!currentPassword && newPassword)) {
            return res.status(400).json({ error: "Please provide both current password and new password" });
        }

        // Validate current and new password
        if (currentPassword && newPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) return res.status(400).json({ error: "Current password is incorrect" });

            if (newPassword.length < 6) {
                return res.status(400).json({ error: "Password must be at least 6 characters long" });
            }

            // Hash the new password
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
        }

        //final update 
        user.name = name || user.name;
        user.age = age || user.age;
        user.education = education || user.education;
        user.gender = gender || user.gender;
        user.dateOfBirth = dateOfBirth || user.dateOfBirth;
        user.email = email || user.email;

        user = await user.save();

        //remove password in response
        user.password = undefined;

        return res.status(200).json(user);




    } catch (error) {
        console.log('Error in updateUserProfile controller', error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }

}

module.exports = { getUserProfile, updateUserProfile };