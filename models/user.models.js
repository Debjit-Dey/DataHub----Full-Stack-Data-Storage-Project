const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        trim: true,
        required: true,
        minLength: [6, "User of minimum length of 6 is required"]

    },
    email:{
        type: String,
        unique: true,
        trim: true,
        required: true,
        minLength: [12, "Email of minimum length of 12 is required"]
    },
    password:{
        type: String,
       
       
        required: true,
        minLength: [6, "Password of minimum length of 6 is required"]
    }

})
const userModel = mongoose.model('userModel', userSchema);
// const a=10;
// module.exports = a;
module.exports = userModel;
