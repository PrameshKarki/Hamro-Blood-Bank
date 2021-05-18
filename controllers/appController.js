//Import validator
const { validationResult } = require("express-validator/check");

//Import Models
const Patient = require("../models/Patient");

exports.getIndex = (req, res) => {
    res.render("index", {
        pageTitle: "Home-Hamro Blood Bank",
        path: "/"
    })
}

exports.getDetails = (req, res) => {
    Patient.find()
        .populate("userID", "firstName").then(data => {
            res.render("details", {
                pageTitle: "Details-Hamro Blood Bank",
                path: "/details",
                data: data
            })

        }).catch(err => {
            console.log(err);
        })
}

exports.getManage = (req, res) => {
    Patient.find({ userID: req.session.user._id }).then(data => {
        res.render("manage", {
            pageTitle: "Manage-Hamro Blood Bank",
            path: "/manage",
            data: data
        })
    }).catch(err => {
        console.log(err);
    })
}

exports.getAddRecord = (req, res) => {
    res.render("add-record", {
        pageTitle: "Add Record-Hamro Blood Bank",
        path: "/manage",
        oldValue: {
            firstName: "",
            lastName: "",
            address: "",
            dateOfBirth: "",
            email: "",
            phoneNumber: ""
        },
        errMessage: [],
        errors: [],
        user: req.session.user

    })
}

exports.postAddRecord = (req, res) => {
    const body = JSON.parse(JSON.stringify(req.body));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).render("add-record", {
            pageTitle: "Add Record-Hamro Blood Bank",
            path: "/manage",
            oldValue: body,
            errMessage: errors.array().map(i => i.msg),
            errors: errors.array(),
            user: req.session.user,
        })

    } else {
        //TO DO
        let imageURL = "";
        const patient = new Patient({
            image: imageURL,
            firstName: body.firstName,
            lastName: body.lastName,
            address: body.address,
            dateOfBirth: body.dateOfBirth,
            email: body.email,
            phoneNumber: body.phoneNumber,
            bloodGroup: body.bloodGroup,
            userID: body.userID
        })
        patient.save().then(() => {
            res.redirect("/manage");

        }).catch(err => {
            console.log(err);
        });


    }
}

exports.postDeleteRecord = (req, res) => {
    const body = JSON.parse(JSON.stringify(req.body));
    Patient.deleteOne({ _id: body.patientID }).then(() => {
        res.redirect("/manage");

    }).catch(err => {
        console.log(err);
    })
}



