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
        const number = await Article.countDocuments({ owner: req.params.id })
        const articles = await Article.find({ owner: req.params.id }).populate('owner', { firstName: 1, lastName: 1, avatar: 1, _id: 0 }).sort({ createdAt: -1 }).skip((page - 1) * 6).limit(6)
        if (isNaN(page) || page < 1 || (number + 6 <= page * 6 && page != 1))
            return res.status(404).send()
        res.render('dashboard/myArticles', { articles, number })
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
        res.render('dashboard/allArticles', { articles, number })
    } catch (error) {
        res.status(500).send()
    }
}

const addArticle = (req, res) => {
    const keys = Object.keys(req.body);
    if (!keys.includes("title") || !keys.includes("editordata") || !keys.includes("files") || keys.length != 3)
        return res.status(400).send()

    new Article({
        title: req.body.title,
        text: req.body.editordata,
        owner: req.session.user._id
    }).save((err, article) => {
        if (err) return res.status(500).send()
        res.redirect('/user/dashboard')
    })
}

const editArticlePage = async(req, res) => {
    try {
        const article = await Article.findById(req.params.id)
        if (!article)
            return res.status(404).send()
        res.render('dashboard/editArticle', { article, text: article.text })
    } catch (error) {
        res.status(500).send()
    }
}

const editArticle = async(req, res) => {
    const keys = Object.keys(req.body);
    if (!keys.includes("title") || !keys.includes("editordata") || !keys.includes("files") || keys.length != 3)
        return res.status(400).send()

    try {
        const article = await Article.findById(req.params.id)
        if (!article)
            return res.status(404).send()
        await article.updateOne({ title: req.body.title, text: req.body.editordata, _id: article._id, owner: article.owner }, { new: true, runValidators: true })
        res.redirect(`/article/${article._id}`);
    } catch (error) {
        res.status(500).send()
    }
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
        res.status(202).send()
    } catch (error) {
        return res.status(500).send()
    }
}

module.exports = {
    getArticle,
    getAllArticles,
    getMyArticles,
    editArticlePage,
    addArticle,
    editArticle,
    addImage,
    deleteArticle
}