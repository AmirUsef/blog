const Article = require('../models/Article')
const generalTools = require('../tools/general-tools')
const multer = require('multer')

const getArticle = async(req, res) => {
    try {
        const article = await Article.findById(req.params.id).populate('owner', { firstName: 1, lastName: 1, avatar: 1, _id: 0 })
        if (!article)
            return res.status(404).send()
        res.render('dashboard/article', { article })
    } catch (error) {
        res.status(500).send()
    }
}

const getMyArticles = async(req, res) => {
    let page = req.query.pageno
    if (!req.query.pageno)
        page = 1;
    try {
        const number = await Article.countDocuments({})
        const articles = await Article.find({ owner: req.session.user._id }).populate('owner', { firstName: 1, lastName: 1, avatar: 1, _id: 0 }).sort({ createdAt: -1 }).skip((page - 1) * 6).limit(6)
        if (isNaN(page) || page < 1 || (number + 6 <= page * 6 && page != 1))
            return res.status(404).send()
        res.render('dashboard/articles', { articles, number })
    } catch (error) {
        res.status(500).send()
    }
}

const getAllArticles = async(req, res) => {
    let page = req.query.pageno
    if (!req.query.pageno)
        page = 1;
    try {
        const number = await Article.countDocuments({})
        const articles = await Article.find({}).populate('owner', { firstName: 1, lastName: 1, avatar: 1, _id: 0 }).sort({ createdAt: -1 }).skip((page - 1) * 6).limit(6)
        if (isNaN(page) || page < 1 || (number + 6 <= page * 6 && page != 1))
            return res.status(404).send()
        res.render('dashboard/articles', { articles, number })
    } catch (error) {
        res.status(500).send()
    }
}

const addArticle = (req, res) => {
    new Article({
        title: req.body.title,
        text: req.body.editordata,
        owner: req.session.user._id
    }).save((err, article) => {
        if (err) return res.status(500).send()
        res.redirect('/user/dashboard')
    })
}

const addImage = (req, res) => {
    const upload = generalTools.uploadArticleImage.single('file')
    upload(req, res, function(err) {
        if (err) {
            if (err instanceof multer.MulterError) return res.status(500).send()

            return res.status(400).send()
        }
        res.status(200).send(`/images/temp/${req.session.user._id}-temp/${req.file.filename}`)
    })
}

const deleteArticle = async(req, res) => {
    try {
        const article = await Article.findById(req.params.id)
        if (!article)
            return res.status(404).send()
        await article.deleteOne()
    } catch (error) {
        return res.status(500).send()
    }
}

module.exports = {
    getArticle,
    getAllArticles,
    getMyArticles,
    addArticle,
    addImage,
    deleteArticle
}