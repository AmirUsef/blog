const Article = require('../models/Article')
const createError = require('http-errors')
const Comment = require('../models/Comment')
const generalTools = require('../tools/general-tools')
const { catchError, deleteDocument } = require('./general.controller')
const multer = require('multer')

const requiredFields = ["title", "editordata", "files"]

module.exports.getArticle = catchError(async(req, res, next) => {
    const article = await Article.findOne({ _id: req.params.id })
    if (!article) return next(createError(404))
    await article.getComments({ confirmed: true })
    res.render('dashboard/article', { article, user: req.session.user })
})

module.exports.getArticles = catchError(async(req, res, next) => {
    const page = req.query.pageno || 1
    const owner = req.params.id ? { owner: req.params.id } : {}
    const number = await Article.countDocuments(owner)
    if (isNaN(page) || page < 1 || (number + 6 <= page * 6 && page != 1))
        return next(createError(404))
    const articles = await Article.find(owner).skip((page - 1) * 6).limit(6)
    if (req.params.id) {
        for (let index = 0; index < articles.length; index++)
            await articles[index].countComments({ confirmed: false })

        return res.render('dashboard/myArticles', { articles, number, role: req.session.user.role })
    }
    res.render('dashboard/allArticles', { articles, number, role: req.session.user.role })
})

module.exports.addArticle = catchError(async(req, res, next) => {
    if (!requiredFields.isEqualTo(Object.keys(req.body)))
        return res.status(400).json({ msg: "Article validation failed: incorrect fields" })

    await new Article({
        title: req.body.title,
        text: req.body.editordata,
        owner: req.session.user._id
    }).save()
    res.redirect('/user/dashboard')
})

module.exports.editArticlePage = catchError(async(req, res, next) => {
    const article = await Article.findOne({ _id: req.params.id })
    await article.getComments({})
    res.render('dashboard/editArticle', { article })
})

module.exports.editArticle = catchError(async(req, res) => {
    if (!requiredFields.isEqualTo(Object.keys(req.body)))
        return res.status(400).json({ msg: "Article validation failed: incorrect fields" })

    const article = await Article.findById(req.params.id)
    await article.updateOne({ title: req.body.title, text: req.body.editordata, _id: article._id, owner: article.owner }, { new: true, runValidators: true })
    res.redirect(`/article/${article._id}`);
})

module.exports.addImage = (req, res) => {
    const upload = generalTools.uploadArticleImage.single('file')
    upload(req, res, function(err) {
        if (err) {
            if (err instanceof multer.MulterError) return res.status(500).json({ msg: "server error" })

            return res.status(400).json({ msg: err.message })
        }
        res.status(200).send(`/images/temp/${req.session.user._id}-temp/${req.file.filename}`)
    })
}

module.exports.deleteArticle = catchError(async(req, res, next) => deleteDocument(req, res, next, Article))