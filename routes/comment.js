const express = require('express')
const router = express.Router()
const acc = require('../tools/access-control')

const {
    addComment,
    confirmComment,
    deleteComment
} = require("../controllers/comment.controller.js")

router.post("/", addComment)

router.put("/:id", acc.isUser, acc.comment, confirmComment)

router.delete("/:id", acc.comment, deleteComment)

module.exports = router;