exports.getLogIn = (req, res) => {
    res.render("login", {
        pageTitle: "Welcome to Hamro Blood Bank"
    })
}

exports.getSignUp = (req, res) => {
    res.render("signup", {
        pageTitle: "Sign Up-Hamro Blood Bank"
    })
}