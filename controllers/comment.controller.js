const Comment = require('../models/Comment')
const { catchError, deleteDocument } = require('./general.controller')

const requiredFields = ["text", "article"]

module.exports.addComment = catchError(async(req, res, next) => {
    if (!requiredFields.isEqualTo(Object.keys(req.body)))
        return res.status(400).json({ msg: "Article validation failed: incorrect fields" })

    const comment = await new Comment({
        owner: req.session.user._id,
        ...req.body
    }).save()
    res.json(comment)
})

module.exports.confirmComment = catchError(async(req, res, next) => {
    await Comment.findByIdAndUpdate(req.params.id, { confirmed: true })
    res.status(200).send()
})

module.exports.deleteComment = catchError(async(req, res, next) => deleteDocument(req, res, next, Comment))