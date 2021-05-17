//Import modules
const express = require("express");

//Instantiate router
const router = express.Router();

//Import controller
const appController = require("../controllers/appController");

//Import Middleware
const { ensureAuth, ensureGuest } = require("../middleware/isAuth");


//Index page
router.get("/", ensureAuth, appController.getIndex);

//Details page
router.get("/details", ensureAuth, appController.getDetails);

//Manage Page
router.get("/manage", ensureAuth, appController.getManage);

//Add Record
router.get("/add-record", ensureAuth, appController.getAddRecord);

//Export router
module.exports = router;