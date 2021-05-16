//Import modules
const express = require("express");

//Instantiate router
const router = express.Router();

//Import controllers
const appController=require("../controllers/appController");

//Index page
router.get("/",appController.getIndex);

//Signup page
router.get("/signup",appController.getSignUp);


//Export router
module.exports = router;