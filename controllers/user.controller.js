const User = require('../models/User');
const session = require('express-session');
const generalTools = require('../tools/general-tools')
const multer = require('multer')
const fs = require('fs')

const fieldsPattern = [
    "newpassword",
    "password",
    "phoneNumber",
    "gender",
    "firstName",
    "lastName"
];

const dashboardPage = async(req, res) => {
    return res.render('dashboard/profile', { user: req.session.user })
}

const getAllUsers = async(req, res) => {
    try {
        const users = await User.find({ role: 'blogger' })
        res.render('admin/users', { users })
    } catch (error) {
        return res.status(500).json({ msg: "server error" })
    }
}

const addArticlePage = (req, res) => {
    res.render('dashboard/addArticle')
}

const updateUser = async(req, res) => {
    const keys = Object.keys(req.body);
    const validateBody = keys.every((field) => fieldsPattern.includes(field))
    if (!validateBody)
        return res.status(400).json({ msg: "User validation failed: incorrect fields" })
    let user
    try {
        user = await User.findOne({ _id: req.params.id })
        if (!user)
            return res.status(404).json({ msg: "User not found" })
    } catch (error) {
        return res.status(500).json({ msg: "server error" })
    }
    if (keys.includes("password") || keys.includes("newpassword")) {
        try {
            const isEqualPass = await user.comparePassword(req.body.password)
            if (!isEqualPass) return res.status(404).json({ msg: "User not found" })
            await user.updateOne({ password: req.body.newpassword }, { new: true, runValidators: true, useFindAndModify: false })
            res.clearCookie('user_sid')
            return res.status(200).send()
        } catch (error) {
            return res.status(500).json({ msg: "server error" })
        }

    }
    try {
        req.body.lastUpdate = Date.now()
        user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true, useFindAndModify: false })
    } catch (err) {
        if (err.code == '11000')
            return res.status(409).json({ msg: "User already exist" })

        if (err.name == "ValidationError")
            return res.status(400).json({ msg: err.message })

        return res.status(500).json({ msg: "server error" })
    }
    req.session.user = user
    res.status(200).send()
}

const updateAvatar = async(req, res) => {
    const upload = generalTools.uploadAvatar.single('avatar');
    upload(req, res, async function(err) {
        if (err) {
            if (err instanceof multer.MulterError) return res.status(500).json({ msg: "server error" })

            return res.status(400).json({ msg: err.message })
        }
        if (req.session.user.role != 'admin' && req.session.user.avatar != 'profile.png') {
            fs.unlink(`./public/images/avatars/${req.session.user.avatar}`, (err) => {
                if (err) console.log(err);
            })
        }
        try {
            user = await User.findByIdAndUpdate({ _id: req.params.id }, { avatar: req.file.filename }, { new: true, runValidators: true, useFindAndModify: false })
            if (req.session.user.role === 'blogger')
                req.session.user = user
            res.redirect('/user/dashboard')
        } catch (error) {
            return res.status(500).json({ msg: "server error" })
        }
    })
}

const deleteUser = async(req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user)
            return res.status(404).json({ msg: "User not found" })
        await user.deleteOne()
    } catch (error) {
        return res.status(500).json({ msg: "server error" })
    }
    if (req.session.user.role === 'blogger')
        res.clearCookie('user_sid')
    res.status(202).send();
}

module.exports = {
    dashboardPage,
    getAllUsers,
    addArticlePage,
    updateUser,
    updateAvatar,
    deleteUser
};