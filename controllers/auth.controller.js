const User = require('../models/User')
const config = require('../config/config');
const Kavenegar = require('kavenegar');
const generalTools = require('../tools/general-tools')

const fieldsPattern = [
    "firstName",
    "lastName",
    "username",
    "password",
    "phoneNumber",
    "gender"
]

const rgisterPage = (req, res) => {
    res.render('auth/register')
}

const register = async(req, res) => {
    const keys = Object.keys(req.body);
    const validateBody = fieldsPattern.every((field) => keys.includes(field))
    if (!validateBody || keys.length != 6)
        return res.status(400).json({ msg: "User validation failed: incorrect fields" })

    new User(req.body).save((err, user) => {
        if (err) {
            if (err.code == '11000')
                return res.status(409).json({ msg: "User already exist" })

            if (err.name == "ValidationError")
                return res.status(400).json({ msg: err.message })

            return res.status(500).json({ msg: "server error" })
        }
        res.status(201).send()
    })
}

const loginPage = (req, res) => {
    res.render('auth/login')
}

const login = async(req, res) => {
    const keys = Object.keys(req.body);
    if (!keys.includes("username") || !keys.includes("password") || keys.length != 2)
        return res.status(400).json({ msg: "User validation failed: incorrect fields" })

    try {
        const user = await User.findOne({ username: req.body.username })
        if (!user) return res.status(404).json({ msg: "User not found" })
        const isEqualPass = await user.comparePassword(req.body.password)
        if (!isEqualPass) return res.status(404).json({ msg: "User not found" })
        req.session.user = user
        res.status(200).send()
    } catch (error) {
        return res.status(500).json({ msg: "server error" })
    }
}

const resetPassPage = (req, res) => {
    res.render('auth/resetPass')
}

const resetPass = async(req, res) => {
    if (!req.body.username)
        return res.status(400).json({ msg: "Incorrect fields" })

    try {
        const user = await User.findOne({ username: req.body.username })
        if (!user || user.role == 'admin')
            return res.status(404).json({ msg: "User not found" })
        const password = generalTools.generatePassword()
        const phone = user.phoneNumber
        await user.updateOne({ password }, { new: true, runValidators: true, useFindAndModify: false })
        Kavenegar.KavenegarApi({ apikey: config.Kavenegar }).Send({ message: `رمز جدید شما : ${password}`, sender: "1000596446", receptor: phone });
        return res.status(200).send()
    } catch (error) {
        return res.status(500).json({ msg: "server error" })
    }
}

const logout = (req, res) => {
    res.clearCookie('user_sid').redirect('/auth/login')
}

module.exports = {
    rgisterPage,
    register,
    loginPage,
    login,
    resetPassPage,
    resetPass,
    logout
}