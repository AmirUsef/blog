const express = require('express')
const router = express.Router()

const {
    getAllArticles,
    getMyArticles,
    getArticle,
    addArticle,
    addImage,
    deleteArticle
} = require("../controllers/article.controller.js")

router.get("/", getAllArticles)

router.get("/myArticles", getMyArticles)

router.get("/:id", getArticle)

router.post("/", addArticle)

router.post("/image", addImage)

router.delete("/:id", deleteArticle)

module.exports = router;