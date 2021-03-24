const generalTools = {};

generalTools.sessionChecker = function(req, res, next) {
    if (req.cookies.user_sid && req.session.user)
        return res.redirect('/user/dashboard')

    return next()
};

generalTools.loginChecker = function(req, res, next) {
    if (!req.session.user)
        return res.redirect('/auth/loginPage')

    return next()
};

module.exports = generalTools;