exports.getIndex = (req, res) => {
    res.render("index", {
        pageTitle: "Home-Hamro Blood Bank"
    })
}

exports.getDetails = (req, res) => {
    res.render("details", {
        pageTitle: "Details-Hamro Blood Bank"
    })
}

exports.getManage = (req, res) => {
    res.render("manage", {
        pageTitle: "Manage-Hamro Blood Bank"
    })
}

exports.getAddRecord=(req,res)=>{
    res.render("add-record",{
        pageTitle:"Add Record-Hamro Blood Bank"
    })
}


