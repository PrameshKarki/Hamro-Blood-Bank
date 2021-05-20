exports.get404 = (req, res) => {
    res.status(404).render("errors/404", {
        pageTitle: "Page Not Found-Hamro Blood Bank",
        path: "/404",
        errMessage:[]
    })
}