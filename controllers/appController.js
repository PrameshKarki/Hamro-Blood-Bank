//Import validator
const { validationResult } = require("express-validator/check");

//Import Models
const Patient = require("../models/Patient");

//Import modules
const shortID = require("shortid");

exports.getIndex = (req, res) => {
    let counts = {
        totalPatients: 0,
        totalMalePatients: 0,
        totalFemalePatients: 0,
        totalAPositivePatients: 0,
        totalANegativePatients: 0,
        totalBPositivePatients: 0,
        totalBNegativePatients: 0,
        totalABPositivePatients: 0,
        totalABNegativePatients: 0,
        totalOPositivePatients: 0,
        totalONegativePatients: 0,
    };
    let totalPatients = Patient.countDocuments().exec();
    let totalMalePatients = Patient.countDocuments({ gender: "Male" }).exec();
    let totalFemalePatients = Patient.countDocuments({ gender: "Female" }).exec();
    let totalAPositivePatients = Patient.countDocuments({ bloodGroup: "A +ve" }).exec();
    let totalANegativePatients = Patient.countDocuments({ bloodGroup: "A -ve" }).exec();
    let totalBPositivePatients = Patient.countDocuments({ bloodGroup: "B +ve" }).exec();
    let totalBNegativePatients = Patient.countDocuments({ bloodGroup: "B -ve" }).exec();
    let totalABPositivePatients = Patient.countDocuments({ bloodGroup: "AB +ve" }).exec();
    let totalABNegativePatients = Patient.countDocuments({ bloodGroup: "AB -ve" }).exec();
    let totalOPositivePatients = Patient.countDocuments({ bloodGroup: "O +ve" }).exec();
    let totalONegativePatients = Patient.countDocuments({ bloodGroup: "O -ve" }).exec();

    Promise.all([totalPatients, totalMalePatients, totalFemalePatients, totalAPositivePatients,
        totalANegativePatients, totalBPositivePatients, totalBNegativePatients, totalABPositivePatients,
        totalABNegativePatients, totalOPositivePatients, totalONegativePatients]).then(data => {

            Object.keys(counts).forEach((key, index) => {
                counts[key] = data[index];
            })
            res.render("index", {
                pageTitle: "Home-Hamro Blood Bank",
                path: "/",
                counts: counts
            })
        })

}

exports.getDetails = (req, res) => {
    Patient.find()
        .populate("userID", "firstName").then(data => {
            res.render("details", {
                pageTitle: "Details-Hamro Blood Bank",
                path: "/details",
                data: data,
                hasSearched:false
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
            data: data,
            hasSearched:false
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
            ID: shortID.generate(),
            firstName: body.firstName,
            lastName: body.lastName,
            image: imageURL,
            address: body.address,
            dateOfBirth: body.dateOfBirth,
            email: body.email,
            phoneNumber: body.phoneNumber,
            gender: body.gender,
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

exports.getSearch = (req, res) => {
    let searchString = req.query.firstName;
    let page = +req.params.page;
    if (page === 1) {
        if (searchString) {
            Patient.find({ firstName: { $regex: new RegExp(searchString, "i") } }).populate("userID", "firstName").then(data => {
                res.render("details", {
                    pageTitle: "Details-Hamro Blood Bank",
                    path: "/details",
                    data: data,
                    hasSearched:true,
                    searchString: searchString

                })

            }).catch(err => {
                console.log(err);
            })
        } else {
            req.flash("err-message", "Invalid search!");
            res.redirect("/details");

        }
    } else if (page === 2) {
        if (searchString) {
            Patient.find({ userID: req.session.user._id, firstName: { $regex: new RegExp(searchString, 'i') } }).then(data => {
                res.render("manage", {
                    pageTitle: "Manage-Hamro Blood Bank",
                    path: "/manage",
                    data: data,
                    hasSearched:true,
                    searchString: searchString
                })
            }).catch(err => {
                console.log(err);
            })
        } else {
            req.flash("err-message", "Invalid search!");
            res.redirect("/manage");
        }

    } else {
        res.redirect("/");
    }
}



