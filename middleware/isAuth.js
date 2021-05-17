module.exports = {
    ensureAuth: function (req, res, next) {
        if (req.session.isLoggedIn) {
            return next();
        } else {
            return res.redirect("/login");
        }
    },
    ensureGuest: function (req, res, next) {
        if (req.session.isLoggedIn) {
            return res.redirect("/");
        } else {
            return next();
        }
    }
}
