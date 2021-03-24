const express = require("express")
const router = express.Router()
const userRouter = require('./user')
const authRouter = require('./auth')
const commentRouter = require('./comment')
const articleRouter = require('./article')
const User = require('../models/User')

router.use('/user', userRouter)
router.use('/auth', authRouter)
    // router.use('/comment', commentRouter)
    // router.use('/article', articleRouter)

router.post('/createAdmin', async(req, res) => {
    try {
        const admin = await User.findOne({ role: "admin" })
        if (admin) return res.status(404).send();

        let newAdmin = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            role: "admin",
            password: req.body.password,
            gender: req.body.gender,
            phoneNumber: req.body.phoneNumber
        })
        newAdmin = await newAdmin.save()
        res.json(newAdmin)
    } catch (error) {
        res.status(500).send()
    }
})

module.exports = router;