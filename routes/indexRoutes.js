//Import modules
const express=require("express");

//Instantiate router
const router=express.Router();

//Import controller
const appController=require("../controllers/appController");

//Index page
router.get("/",appController.getIndex);

//Details page
router.get("/details",appController.getDetails);

//Manage Page
router.get("/manage",appController.getManage);

//Add Record
router.get("/add-record",appController.getAddRecord);

//Export router
module.exports=router;