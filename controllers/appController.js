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
    res.render("edit-record", {
        pageTitle: "Add Record-Hamro Blood Bank",
        path: "/manage",
        editMode: false,
        hasError: false,
        errMessage: [],
        errors: [],
        user: req.session.user

    })
}

exports.postAddRecord = (req, res) => {
    const body = JSON.parse(JSON.stringify(req.body));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let formattedDate = new Date(body.dateOfBirth).toISOString().split('T')[0];
        res.status(422).render("edit-record", {
            pageTitle: "Add Record-Hamro Blood Bank",
            path: "/manage",
            editMode: false,
            hasError: true,
            oldValue: { ...body, formattedDate },
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

exports.getEditRecord = (req, res) => {
    let editMode = req.query.edit;
    if (editMode) {
        let patientID = req.params.patientID;
        Patient.findOne({ _id: patientID, userID: req.session.user._id }).then(data => {
            if (data) {
                let formattedDate = new Date(data.dateOfBirth).toISOString().split('T')[0];
                res.render("edit-record", {
                    pageTitle: "Edit Info-Hamro Blood Bank",
                    path: "/manage",
                    editMode: true,
                    hasError: false,
                    oldValue: { ...data._doc, formattedDate },
                    user: req.session.user,
                    errors: [],
                    errMessage: []
                })
            }
            else {
                req.flash("err-message", "You are not authorized!");
                res.redirect("/manage");
            }
        }).catch(err => {
            console.log(err);
        })

    } else {
        res.redirect("/manage");
    }
}

exports.postEditRecord = (req, res) => {
    const body = JSON.parse(JSON.stringify(req.body));
    let errors = validationResult(req);
    console.log(errors.array());
    if (!errors.isEmpty()) {
        let formattedDate = new Date(body.dateOfBirth).toISOString().split('T')[0];
        res.status(422).render("edit-record", {
            pageTitle: "Update Record-Hamro Blood Bank",
            path: "/manage",
            editMode: true,
            hasError: true,
            oldValue: { ...body, formattedDate },
            errMessage: errors.array().map(i => i.msg),
            errors: errors.array(),
            user: req.session.user,
        })

    } else {
        //Update Record
        Patient.findOne({ _id: body._id }).then(data => {
            if (data.userID.toString() === req.session.user._id.toString()) {
                data.firstName = body.firstName;
                data.lastName = body.lastName;
                data.address = body.address;
                data.dateOfBirth = body.dateOfBirth;
                data.email = body.email;
                data.phoneNumber = body.phoneNumber;
                data.bloodGroup = body.bloodGroup;
                return data.save();

            } else {
                req.flash("err-message", "You are not authorized");
                res.redirect("/manage");
            }

        }).then(() => {
            res.redirect("/manage");
        }).catch(err => {
            console.log(err);
        })


    }
}



