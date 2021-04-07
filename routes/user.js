const express = require('express');
const router = express.Router();
const acc = require('../tools/access-control')

const {
    dashboardPage,
    addArticlePage,
    updateUser,
    updateAvatar,
    deleteUser
} = require("../controllers/user.controller");

router.get('/dashboard', dashboardPage)

router.get('/addArticle', addArticlePage)

router.put('/:id', acc.editUser, updateUser)

router.post('/avatar/:id', acc.editUser, updateAvatar)

router.delete('/:id', acc.editUser, deleteUser)

module.exports = router;