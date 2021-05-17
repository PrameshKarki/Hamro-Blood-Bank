//Import modules
const express = require("express");

//Instantiate router
const router = express.Router();

//Import controllers
const authController = require("../controllers/authController");

//Import validator
const { body } = require("express-validator/check");

//Import Model
const User = require("../models/User");

//Import bcryptJS
const bcrypt = require("bcryptjs");

//Index page
router.get("/login", authController.getLogIn);

//Signup page
router.get("/signup", authController.getSignUp);

//Post:=>SignUp Page
router.post("/signup", [
    body("firstName", "Invalid first name").isAlpha().isLength({ min: 2 }).trim(),
    body("lastName", "Invalid last name").isAlpha().isLength({ min: 2 }).trim(),
    body("contactNumber", "Invalid contact number").isNumeric().isLength({ min: 10 }).trim(),
    body("email", "Invalid email").isEmail().custom(value => {
        return User.findOne({ email: value }).then(user => {
            if (user) {
                return Promise.reject("Email already exists");
            } else {
                return true;
            }
        })
    }).normalizeEmail(),
    body("password", "Weak password").isLength({ min: 6 }).trim(),
    body("confirmPassword").custom((value, { req }) => {
        if (value === req.body.password)
            return true;
        throw new Error("Password doesn't match");
    })
], authController.postSignUp);

router.post("/login",authController.postLogIn);


//Export router
module.exports = router;