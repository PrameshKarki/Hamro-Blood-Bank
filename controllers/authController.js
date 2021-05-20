//Import modules
const bcrypt = require("bcryptjs");

//To check validation result
const { validationResult } = require("express-validator/check");
const User = require("../models/User");

exports.getLogIn = (req, res) => {
    res.render("auth/login", {
        pageTitle: "Welcome to Hamro Blood Bank",
        errMessage: [],
        oldValue: {
            email: "",
            password: ""
        }
    })
}

exports.getSignUp = (req, res) => {
    res.render("auth/signup", {
        pageTitle: "Sign Up-Hamro Blood Bank",
        oldValue: {
            firstName: "",
            lastName: "",
            contactNumber: "",
            email: "",
            password: "",
            confirmPassword: ""
        },
        errMessage: [],
        errors: []
    })
}

exports.postSignUp = (req, res) => {
    const body = JSON.parse(JSON.stringify(req.body));
    const errors = validationResult(req);
    //If error occurs in validation
    if (!errors.isEmpty()) {
        return res.status(422).render("auth/signup", {
            pageTitle: "Sign Up-Hamro Blood Bank",
            errMessage: errors.array().map(i => i.msg),
            errors: errors.array(),
            oldValue: body

        })
    } else {
        //Encrypt password to store in database
        //12:=> Salt value
        bcrypt.hash(body.password, 12).then(hashedPassword => {
            const user = new User({ firstName: body.firstName, lastName: body.lastName,role:"User",phoneNumber: body.phoneNumber, email: body.email, password: hashedPassword });
            return user.save();
        }).then(() => {
            res.redirect("/login");
        }).catch(err => {
            let error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
    
        })


    }
}

exports.postLogIn = (req, res) => {
    const body = JSON.parse(JSON.stringify(req.body));
    User.findOne({ email: body.email }).then(user => {
        if (user) {
            bcrypt.compare(body.password, user.password).then(doMatch => {
                if (doMatch) {
                    //Store Session
                    req.session.isLoggedIn = true;
                    req.session.user = user;
                    //OPTIONAL!
                    req.session.save(err => {
                        res.redirect("/");
                    })
                } else {
                    res.status(422).render("auth/login", {
                        pageTitle: "Welcome to Hamro Blood Bank",
                        oldValue: body,
                        errMessage: ["Invalid credentials"]
                    })
                }
            }).catch(err => {
                let error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
        
            })

        } else {
            res.status(422).render("auth/login", {
                pageTitle: "Welcome to Hamro Blood Bank",
                oldValue: body,
                errMessage: ["Invalid credentials"]
            })

        }
    }).catch(err => {
        let error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    })

}

exports.postLogOut = (req, res) => {
    req.session.destroy();
    res.redirect("/login");
}