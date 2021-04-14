const Article = require('../models/Article')
const generalTools = require('../tools/general-tools')
const multer = require('multer')

const getArticle = async(req, res) => {
    try {
        const article = await Article.findById(req.params.id).populate('owner', { firstName: 1, lastName: 1, avatar: 1, _id: 0 })
        if (!article)
            return res.status(404).json({ msg: "Article not found" })
        res.render('dashboard/article', { article })
    } catch (error) {
        res.status(500).json({ msg: "server error" })
    }
}

const getUserArticles = async(req, res) => {
    let page = req.query.pageno
    if (!req.query.pageno)
        page = 1;
    try {
        const number = await Article.countDocuments({ owner: req.params.id })
        const articles = await Article.find({ owner: req.params.id }).populate('owner', { firstName: 1, lastName: 1, avatar: 1, _id: 0 }).sort({ createdAt: -1 }).skip((page - 1) * 6).limit(6)
        if (isNaN(page) || page < 1 || (number + 6 <= page * 6 && page != 1))
            return res.status(404).json({ msg: "page not found" })
        res.render('dashboard/myArticles', { articles, number, role: req.session.user.role })
    } catch (error) {
        res.status(500).json({ msg: "server error" })
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
            return res.status(404).json({ msg: "page not found" })
        res.render('dashboard/allArticles', { articles, number, role: req.session.user.role })
    } catch (error) {
        res.status(500).json({ msg: "server error" })
    }
}

const addArticle = (req, res) => {
    const keys = Object.keys(req.body);
    if (!keys.includes("title") || !keys.includes("editordata") || !keys.includes("files") || keys.length != 3)
        return res.status(400).json({ msg: "Article validation failed: incorrect fields" })

    new Article({
        title: req.body.title,
        text: req.body.editordata,
        owner: req.session.user._id
    }).save((err, article) => {
        if (err) {
            console.log(err);
            if (err.name == "ValidationError")
                return res.status(400).json({ msg: err.message })

            return res.status(500).json({ msg: "server error" })
        }
        res.redirect('/user/dashboard')
    })
}

const editArticlePage = async(req, res) => {
    try {
        const article = await Article.findById(req.params.id)
        res.render('dashboard/editArticle', { article, text: article.text })
    } catch (error) {
        return res.status(500).json({ msg: "server error" })
    }
}

const editArticle = async(req, res) => {
    const keys = Object.keys(req.body);
    if (!keys.includes("title") || !keys.includes("editordata") || !keys.includes("files") || keys.length != 3)
        return res.status(400).json({ msg: "Article validation failed: incorrect fields" })

    try {
        const article = await Article.findById(req.params.id)
        await article.updateOne({ title: req.body.title, text: req.body.editordata, _id: article._id, owner: article.owner }, { new: true, runValidators: true })
        res.redirect(`/article/${article._id}`);
    } catch (error) {
        if (err.name == "ValidationError")
            return res.status(400).json({ msg: err.message })

        res.status(500).json({ msg: "server error" })
    }
}

const addImage = (req, res) => {
    const upload = generalTools.uploadArticleImage.single('file')
    upload(req, res, function(err) {
        if (err) {
            if (err instanceof multer.MulterError) return res.status(500).json({ msg: "server error" })

            return res.status(400).json({ msg: err.message })
        }
        res.status(200).send(`/images/temp/${req.session.user._id}-temp/${req.file.filename}`)
    })
}

const deleteArticle = async(req, res) => {
    try {
        const article = await Article.findById(req.params.id)
        await article.deleteOne()
        res.status(202).send()
    } catch (error) {
        res.status(500).json({ msg: "server error" })
    }
}

module.exports = {
    getArticle,
    getAllArticles,
    getUserArticles,
    editArticlePage,
    addArticle,
    editArticle,
    addImage,
    deleteArticle
}