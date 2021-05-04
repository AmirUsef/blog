const User = require('../models/User');
const generalTools = require('../tools/general-tools')
const multer = require('multer')
const fs = require('fs')
const createError = require('http-errors');
const { catchError, deleteDocument } = require('./general.controller')

const requiredFields = ["phoneNumber", "gender", "firstName", "lastName"]
const passwordFields = ["password", "newpassword"]

module.exports.dashboardPage = (req, res) => res.render('dashboard/profile', { user: req.session.user })

module.exports.getAllUsers = catchError(async(req, res, next) => res.render('admin/users', { users: await User.find({ role: 'blogger' }) }))

module.exports.addArticlePage = (req, res) => res.render('dashboard/addArticle')

module.exports.updateUser = catchError(async(req, res, next) => {
    const keys = Object.keys(req.body);
    if (!passwordFields.isEqualTo(keys) && !(keys.length == 1 && requiredFields.includes(keys[0])))
        return res.status(400).json({ msg: "User validation failed: incorrect fields" })
    const user = await User.findOne({ _id: req.params.id })
    if (!user) return next(createError(404))
    if (keys.includes("password")) {
        const isEqualPass = await user.comparePassword(req.body.password)
        if (!isEqualPass) return res.status(404).json({ msg: "User not found" })
        await user.updateOne({ password: req.body.newpassword }, { new: true, runValidators: true })
        return res.clearCookie('user_sid').status(200).send()
    }
    req.body.lastUpdate = Date.now()
    req.session.user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    res.status(200).send()
})

module.exports.updateAvatar = catchError(async(req, res, next) => {
    const upload = generalTools.uploadAvatar.single('avatar');
    upload(req, res, async function(err) {
        if (err) {
            if (err instanceof multer.MulterError) return res.status(500).json({ msg: "server error" })

            return res.status(400).json({ msg: err.message })
        }
        if (req.session.user.avatar != 'profile.png') {
            fs.unlink(`./public/images/avatars/${req.session.user.avatar}`, (err) => {
                if (err) console.log(err);
            })
        }
        req.session.user = await User.findByIdAndUpdate({ _id: req.params.id }, { avatar: req.file.filename }, { new: true, runValidators: true, useFindAndModify: false })
        res.redirect('/user/dashboard')
    })
})

module.exports.deleteUser = catchError(async(req, res, next) => deleteDocument(req, res, next, User))