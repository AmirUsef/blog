const Article = require('../models/Article')
const User = require('../models/User');
const acc = {}

acc.sessionChecker = function(req, res, next) {
    if (req.cookies.user_sid && req.session.user)
        return res.redirect('/user/dashboard')

    return next()
};

acc.loginChecker = async function(req, res, next) {
    if (!req.session.user)
        return res.redirect('/auth/login')

    const user = await User.findById(req.session.user._id)
    if (!user)
        return res.clearCookie('user_sid').redirect('/auth/login')

    return next()
};

acc.resetPass = async function(req, res, next) {
    if (!req.session.user || req.session.user.role === 'admin')
        return next()

    res.status(403).json({ msg: "Access denied" })
};

acc.owner = (req, res, next) => {
    if (req.session.user._id == req.params.id)
        return next()
    res.status(403).json({ msg: "Access denied" })
}

acc.adminOwner = (req, res, next) => {
    if (req.session.user.role === 'admin' || req.session.user._id == req.params.id)
        return next()
    res.status(403).json({ msg: "Access denied" })
}

acc.admin = async(req, res, next) => {
    if (req.session.user.role === 'admin')
        return next()
    res.status(403).json({ msg: "Access denied" })
}

acc.articles = (req, res, next) => {
    if (req.session.user.role === 'admin' || req.session.user._id == req.params.id)
        return next()
    res.status(403).json({ msg: "Access denied" })
}

acc.editArticle = async(req, res, next) => {
    try {
        const article = await Article.findById(req.params.id)
        if (!article)
            return res.status(404).json({ msg: "Article not found" })

        if (article.owner == req.session.user._id)
            return next()
    } catch (error) {
        return res.status(500).json({ msg: "server error" })
    }
    res.status(403).json({ msg: "Access denied" })
}

acc.deleteArticle = async(req, res, next) => {
    try {
        const article = await Article.findById(req.params.id)
        if (!article)
            return res.status(404).json({ msg: "Article not found" })

        if (req.session.user.role === 'admin' || article.owner == req.session.user._id)
            return next()
    } catch (error) {
        return res.status(500).json({ msg: "server error" })
    }
    res.status(403).json({ msg: "Access denied" })
}

module.exports = acc;