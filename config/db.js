const mongoose = require("mongoose")


const DBConnection = ()=>{
    // console.log(process.env.MONGODB_URI);
    mongoose.connect(`${process.env.MONGODB_URI}`).then(
    console.log("db connected"))
    // mongoose.connect(`mongodb://localhost:27017/man`).then(
    //     console.log("db connected"))
}

module.exports = DBConnection;