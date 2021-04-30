const Article = require('../models/Article')
const Comment = require('../models/Comment')
const User = require('../models/User');
const createError = require('http-errors');
const generalController = require('../controllers/general.controller')
const acc = {}

acc.hasSession = function(req, res, next) {
    req.cookies.user_sid && req.session.user ? res.redirect('/user/dashboard') : next()
}

acc.isLoggedIn = async function(req, res, next) {
    if (!req.session.user) return res.redirect('/auth/login')

    const user = await User.findById(req.session.user._id)
    user ? next() : res.clearCookie('user_sid').redirect('/auth/login')
}

acc.resetPass = async function(req, res, next) {
    if (!req.session.user || req.session.user.role === 'admin')
        return next()
    next(createError(404))
}

acc.isOwner = (req, res, next) => req.session.user._id == req.params.id ? next() : next(createError(404))

acc.adminOwner = (req, res, next) => {
    if (req.session.user.role === 'admin' || req.session.user._id == req.params.id)
        return next()
    next(createError(404))
}

acc.isAdmin = (req, res, next) => req.session.user.role === 'admin' ? next() : next(createError(404))

acc.isUser = (req, res, next) => req.session.user.role === 'blogger' ? next() : next(createError(404))

acc.article = generalController.catchError(async(req, res, next) => {
    const article = await Article.findById(req.params.id)
    if (!article || (req.session.user.role !== 'admin' && article.owner._id != req.session.user._id))
        return next(createError(404))
    next()
})

acc.comment = generalController.catchError(async(req, res, next) => {
    const comment = await Comment.findById(req.params.id).populate('article', { owner: 1 })
    if (!comment || (req.session.user.role !== 'admin' && comment.article.owner._id != req.session.user._id))
        return next(createError(404))
    next()
})

module.exports = acc;