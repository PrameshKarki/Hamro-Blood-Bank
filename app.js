//Import modules
const path=require("path");

const express = require("express");
const ejs = require("ejs");

//Import routes
const indexRoutes = require("./routes/index");

//Instantiate express app
const app = express();

//Set view engine
app.set("view engine", "ejs");
app.set("views", "views");

//Set static folder
app.use(express.static(path.join(__dirname,"public")));

//Use routes
app.use(indexRoutes);


//Run server
app.listen(process.env.PORT || 3000);