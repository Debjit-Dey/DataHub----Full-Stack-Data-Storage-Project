const mongoose = require("mongoose");

const fileSchema = mongoose.Schema({
    path:{
        type: String,
        required: true
    },
    originalName:{
        type: String,
        required: true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "userModel",
        required: true
    },
    public_id:{
        type: String,
        required: true
    }
});

const fileModel = mongoose.model("fileModel", fileSchema);
module.exports = fileModel;