const User = require('../models/User')
const Kavenegar = require('kavenegar');
const generalTools = require('../tools/general-tools')
const { catchError } = require('./general.controller')

const requiredFields = ["firstName", "lastName", "username", "password", "phoneNumber", "gender"]

module.exports.rgisterPage = (req, res) => res.render('auth/register')

module.exports.register = catchError(async(req, res, next) => {
    if (!requiredFields.isEqualTo(Object.keys(req.body)))
        return res.status(400).json({ msg: "User validation failed: incorrect fields" })

    const user = await new User(req.body).save()
    res.json(user)
})

module.exports.loginPage = (req, res) => res.render('auth/login')

module.exports.login = catchError(async(req, res, next) => {
    const keys = Object.keys(req.body);
    if (!keys.includes("username") || !keys.includes("password") || keys.length != 2)
        return res.status(400).json({ msg: "User validation failed: incorrect fields" })

    const user = await User.findOne({ username: req.body.username })
    if (user && await user.comparePassword(req.body.password)) {
        req.session.user = user
        return res.status(200).send()
    }
    res.status(404).json({ msg: "User not found" })
})

module.exports.resetPassPage = (req, res) => res.render('auth/resetPass')

module.exports.resetPass = catchError(async(req, res, next) => {
    if (!req.body.username)
        return res.status(400).json({ msg: "Incorrect fields" })

    const user = await User.findOne({ username: req.body.username })
    if (!user || user.role === 'admin')
        return res.status(404).json({ msg: "User not found" })
    const password = generalTools.generatePassword()
    const phone = user.phoneNumber
    await user.updateOne({ password }, { new: true, runValidators: true, useFindAndModify: false })
    Kavenegar.KavenegarApi({ apikey: process.env.Kavenegar }).Send({ message: `رمز جدید شما : ${password}`, sender: "1000596446", receptor: phone });
    res.status(200).send()
})

module.exports.logout = (req, res) => res.clearCookie('user_sid').redirect('/auth/login')