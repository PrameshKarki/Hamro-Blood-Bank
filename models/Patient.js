//Import Modules
const mongoose = require("mongoose");

//Define Schema
const patientSchema = mongoose.Schema({
    ID:{
        type:String,
        required:true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    bloodGroup: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})

//Export model
module.exports = mongoose.model("Patient", patientSchema);