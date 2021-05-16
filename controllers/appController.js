exports.getIndex = (req, res) => {
    res.render("index", {
        pageTitle: "Welcome to Hamro Blood Bank"
    })
}

exports.getSignUp = (req, res) => {
    res.render("signup", {
        pageTitle: "Sign Up-Hamro Blood Bank"
    })
}