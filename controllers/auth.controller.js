const User = require('../models/User');

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
        return res.status(400).send()
    try {
        const user = await User.findOne({ $or: [{ username: req.body.username }, { phoneNumber: req.body.phoneNumber }] })
        if (user) return res.status(409).send()
    } catch (error) {
        return res.status(500).send()
    }
    new User(req.body).save((err, user) => {
        if (err) return res.status(500).send()
        res.status(201).send()
    })
}

const loginPage = (req, res) => {
    res.render('auth/login')
}

const login = async(req, res) => {
    const keys = Object.keys(req.body);
    if (!keys.includes("username") || !keys.includes("password") || keys.length != 2)
        return res.status(400).send()

    try {
        const user = await User.findOne({ username: req.body.username })
        if (!user) return res.status(404).send()
        const isEqualPass = await user.comparePassword(req.body.password)
        if (!isEqualPass) return res.status(404).send()
        req.session.user = user
        res.status(200).send()
    } catch (error) {
        return res.status(500).send()
    }
}

const logout = (req, res) => {
    res.clearCookie('user_sid').redirect('/auth/loginPage')
}

module.exports = {
    rgisterPage,
    register,
    loginPage,
    login,
    logout
}