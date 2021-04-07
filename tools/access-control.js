const Article = require('../models/Article')
const acc = {}

acc.editUser = (req, res, next) => {
    if (req.session.user.role === 'admin' || req.session.user._id == req.params.id)
        return next()
    res.status(403).send()
}

acc.myArticles = (req, res, next) => {
    if (req.session.user.role === 'admin' || req.session.user._id == req.params.id)
        return next()
    res.status(403).send()
}

acc.editArticle = async(req, res, next) => {
    try {
        const article = await Article.findById(req.params.id)
        if (!article)
            return res.status(404).send()

        if (article.owner == req.session.user._id)
            return next()
    } catch (error) {
        return res.status(500).send()
    }
    res.status(403).send()
}

acc.deleteArticle = async(req, res, next) => {
    try {
        const article = await Article.findById(req.params.id)
        if (!article)
            return res.status(404).send()

        if (req.session.user.role === 'admin' || article.owner == req.session.user._id)
            return next()
    } catch (error) {
        return res.status(500).send()
    }
    res.status(403).send()
}

module.exports = acc;