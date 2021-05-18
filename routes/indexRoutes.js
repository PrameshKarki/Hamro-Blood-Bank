//Import modules
const express = require("express");

//Instantiate router
const router = express.Router();

//Import controller
const appController = require("../controllers/appController");

//Import validator
const { body } = require("express-validator/check");

//Import Middleware
const { ensureAuth, ensureGuest } = require("../middleware/isAuth");

//Import models
const Patient = require("../models/Patient");


//Index page
router.get("/", ensureAuth, appController.getIndex);

//Details page
router.get("/details", ensureAuth, appController.getDetails);

//Manage Page
router.get("/manage", ensureAuth, appController.getManage);

//Add Record
router.get("/add-record", ensureAuth, appController.getAddRecord);

//POST=>Add Record
router.post("/add-record", ensureAuth, [
    body("firstName", "Invalid first name").isAlpha().isLength({ min: 2, max: 20 }).trim(),
    body("lastName", "Invalid last name").isAlpha().isLength({ min: 2, max: 15 }).trim(),
    body("address", "Invalid address").isString().isLength({ min: 5, max: 25 }).trim(),
    body("dateOfBirth").custom(value => {
        let givenDate = new Date(value);
        let minDate = new Date("2000-1-1");
        if (givenDate > minDate && givenDate < Date.now())
            return true;
        throw new Error("Invalid date");

    }),
    body("email", "Invalid email").isEmail().normalizeEmail(),
    body("phoneNumber", "Invalid phoneNumber").isNumeric().isLength({ min: 10 }).trim(),
    body("email").custom((value, { req }) => {
        return Patient.findOne({ email: value, phoneNumber: req.body.phoneNumber }).then(user => {
            console.log(user);
            if (user) {
                return Promise.reject("Email/PhoneNumber already exists!");
            }
            return true;
        })
    })
], appController.postAddRecord);

//Export router
module.exports = router;