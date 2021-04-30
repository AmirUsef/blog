const express = require("express")
const router = express.Router()
const acc = require('../tools/access-control')

router.get('/', (req, res) => res.render('home'))
router.use('/auth', require('./auth'))
router.use('/user', acc.isLoggedIn, require('./user'))
router.use('/article', acc.isLoggedIn, require('./article'))
router.use('/comment', acc.isLoggedIn, require('./comment'))

module.exports = router;