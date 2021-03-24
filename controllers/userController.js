const User = require('../models/User');
const bcrypt = require('bcrypt');
const session = require('express-session');

const fieldsPattern = [
    "newpassword",
    "password",
    "phoneNumber",
    "gender",
    "firstName",
    "lastName"
];

const dashboardPage = (req, res) => {
    res.render('dashboard', { user: req.session.user })
}

const updateUser = async(req, res) => {
    const keys = Object.keys(req.body);
    const validateBody = keys.every((field) => fieldsPattern.includes(field))
    if (!req.session.user || !validateBody)
        return res.status(400).send()
    let user
    try {
        user = await User.findOne({ _id: req.session.user._id })
        if (!user) return res.status(500).send()
    } catch (error) {
        return res.status(500).send()
    }
    if (keys.includes("password") || keys.includes("newpassword")) {
        bcrypt.compare(req.body.password.trim(), user.password, async function(err, isEqual) {
            if (err) return res.status(500).send()

            if (!isEqual) return res.status(404).send()
            try {
                user = await user.updateOne({ password: req.body.newpassword.trim() }, { new: true, runValidators: true, useFindAndModify: false })
            } catch (error) {
                return res.status(500).send()
            }
            return res.status(200).send()
        });
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

const deleteUser = async(req, res) => {
    if (!req.session.user)
        return res.status(400).send()
    try {
        await User.findOneAndDelete({ _id: req.session.user._id })
    } catch (error) {
        return res.status(500).send()
    }
    res.clearCookie('user_sid')
    res.status(202).send();
}

module.exports = {
    dashboardPage,
    updateUser,
    deleteUser
};