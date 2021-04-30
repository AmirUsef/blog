const express = require('express')
const router = express.Router()
const acc = require('../tools/access-control')

const {
    getArticles,
    editArticlePage,
    getArticle,
    addArticle,
    editArticle,
    addImage,
    deleteArticle
} = require("../controllers/article.controller.js")

router.get("/", getArticles)

router.get("/user/:id", acc.adminOwner, getArticles)

router.get("/edit/:id", acc.isUser, acc.article, editArticlePage)

router.get("/:id", getArticle)

router.post("/", addArticle)

router.post("/image", addImage)

router.post("/:id", acc.isUser, acc.article, editArticle)

router.delete("/:id", acc.article, deleteArticle)

module.exports = router;