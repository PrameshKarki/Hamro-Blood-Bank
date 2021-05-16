//Import modules
const express = require("express");

//Instantiate router
const router = express.Router();

//Import controllers
const authController = require("../controllers/authController");

//Index page
router.get("/login", authController.getLogIn);

//Signup page
router.get("/signup", authController.getSignUp);


//Export router
module.exports = router;