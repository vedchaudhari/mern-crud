const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name:{
        type:String,
    },
    age:{
        type:Number,
    },
    education:{
        type:String,
    },
    gender:{
        type:String,
        enum:["male","female"]
    },
    dateOfBirth:{
        type: Date,
    },
    email:{
        type:String,
        unique:true,
    },
    status: {
        type: String,
        enum: ['online', 'offline'],
        default: 'offline'
    },
    password:{
        type:String,
    }
});

const User = mongoose.model('User',userSchema);
module.exports = User;