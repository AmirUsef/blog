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

const dashboardPage = (req, res) => {
    res.render('dashboard/profile', { user: req.session.user })
}

const addArticlePage = (req, res) => {
    res.render('dashboard/addArticle')
}

const updateUser = async(req, res) => {
    const keys = Object.keys(req.body);
    const validateBody = keys.every((field) => fieldsPattern.includes(field))
    if (!validateBody)
        return res.status(400).send()
    let user
    try {
        user = await User.findOne({ _id: req.session.user._id })
        if (!user) return res.status(500).send()
    } catch (error) {
        return res.status(500).send()
    }
    if (keys.includes("password") || keys.includes("newpassword")) {
        try {
            const isEqualPass = await user.comparePassword(req.body.password)
            if (!isEqualPass) return res.status(404).send()
            user = await user.updateOne({ password: req.body.newpassword }, { new: true, runValidators: true, useFindAndModify: false })
            return res.status(200).send()
        } catch (error) {
            return res.status(500).send()
        }

    } else {
        try {
            user = await User.findByIdAndUpdate({ _id: req.session.user._id }, req.body, { new: true, runValidators: true, useFindAndModify: false })
        } catch (error) {
            if (error.code == 11000) return res.status(409).send()
            return res.status(500).send()
        }
        req.session.user = user
        res.status(200).send()
    }
}

const updateAvatar = async(req, res) => {
    const upload = generalTools.uploadAvatar.single('avatar');
    upload(req, res, async function(err) {
        if (err) {
            if (err instanceof multer.MulterError) return res.status(500).send()

            return res.status(400).send()
        }
        if (req.session.user.avatar != 'profile.png') {
            fs.unlink(`./public/images/avatars/${req.session.user.avatar}`, (err) => {
                if (err) console.log(err);
            })
        }
        try {
            user = await User.findByIdAndUpdate({ _id: req.session.user._id }, { avatar: req.file.filename }, { new: true, runValidators: true, useFindAndModify: false })
            req.session.user = user
            res.redirect('/user/dashboard')
        } catch (error) {
            return res.status(500).send()
        }
    })
}

const deleteUser = async(req, res) => {
    try {
        const user = await User.findById(req.session.user._id)
        await user.deleteOne()
    } catch (error) {
        return res.status(500).send()
    }
    res.clearCookie('user_sid')
    res.status(202).send();
}

module.exports = {
    dashboardPage,
    addArticlePage,
    updateUser,
    updateAvatar,
    deleteUser
};