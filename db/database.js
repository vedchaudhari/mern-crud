const mongoose = require('mongoose')


//async function connectDB

const connectDB = async(uri) => {

    try {
        await mongoose.connect(uri);
        console.log('MongoDB connected successfully')
    } catch (error) {
        console.error("Error: ",error.message)
        throw new Error('Connection Failed')
    }
}



module.exports = connectDB;