//Import modules
const mongoose = require("mongoose");

//Define Schema
const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        require: true
    },
    lastName: {
        type: String,
        require: true
    },
    role: {
        type: String,
        require: true
    },
    contactNumber: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    }

});

//Export Models
module.exports = mongoose.model("User", userSchema);