exports.getIndex = (req, res) => {
    res.render("index", {
        pageTitle: "Welcome to Hamro Blood Bank"
    })
}