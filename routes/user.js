const express = require('express');
const router = express.Router();
const generalTools = require('../tools/general-tools')

const {
    dashboardPage,
    updateUser,
    deleteUser
} = require("../controllers/userController");

router.get('/dashboard', generalTools.loginChecker, dashboardPage)

router.post('/update', updateUser)

router.delete('/delete', deleteUser)

module.exports = router;