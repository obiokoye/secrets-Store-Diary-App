//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require ("mongoose-encryption");
// const { Hash } = require("crypto");
// const { response } = require("express");


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


mongoose.set('strictQuery', false);
mongoose.connect("mongodb://127.0.0.1:27017/userDB", {useNewUrlParser: true});

const userSchema = new mongoose.Schema({
    email: String,
     password: String
});

//This code will encrypt the specified field password, remember to put it above new User creation
//This will also hide the password on the database incase they hack it//
//This code below was copied into the .env file and named SECRET=thisismysecret
// const secret = "Thisismysecret.";

//tHIS CODE IS NOW REFORMATED TO USE THE .env file by adding process.env.SECRET //
// userSchema.plugin(encrypt, {secret: secret, encryptedFields: ["password"]});

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

 const User = mongoose.model("User", userSchema);


app.get("/", function(req, res){
    res.render("home");
});


app.get("/login", function(req, res){
    res.render("login");
});

app.get("/register", function(req, res){
    res.render("register");
});





app.post("/", function(req, res){

}); 

app.listen(3000, function(){
console.log("server started on port 3000");

});

app.post("/register", function(req, res){
    //this code will create a new user, the username and password field must be same with the form name input....//
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
    //this code will save the new user to the database and send the user to the secrets page, this means that you must be registered before you can see the secerets page//
    newUser.save(function(err){
        if(err){
            console.log(err);
        }else{
            res.render("secrets");
        }
    });
});

app.post("/login", function(req, res){
    const username = req.body.username;
    const password = req.body.password;
    
    //this code will check and find the registered user and allow him to login if the details are wrong it will not login
    User.findOne({email: username}, function(err, foundUser){
        if (err){
            console.log(err);
        }else{
            if (foundUser){
                if (foundUser.password === password){
                    res.render ("secrets");
                }
            }
        }
    });
});