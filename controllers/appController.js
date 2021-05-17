exports.getIndex = (req, res) => {
    res.render("index", {
        pageTitle: "Home-Hamro Blood Bank",
        path:"/"
    })
}

exports.getDetails = (req, res) => {
    res.render("details", {
        pageTitle: "Details-Hamro Blood Bank",
        path:"/details"
    })
}

exports.getManage = (req, res) => {
    res.render("manage", {
        pageTitle: "Manage-Hamro Blood Bank",
        path:"/manage"
    })
}

exports.getAddRecord=(req,res)=>{
    res.render("add-record",{
        pageTitle:"Add Record-Hamro Blood Bank",
        path:"/manage"
    })
}


