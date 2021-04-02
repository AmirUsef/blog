const express = require('express');
const router = express.Router();

const {
    dashboardPage,
    addArticlePage,
    updateUser,
    updateAvatar,
    deleteUser
} = require("../controllers/user.controller");

router.get('/dashboard', dashboardPage)

router.get('/addArticle', addArticlePage)

router.post('/update', updateUser)

router.post('/avatar', updateAvatar)

router.delete('/delete', deleteUser)

module.exports = router;