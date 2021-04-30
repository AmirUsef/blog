const express = require('express');
const router = express.Router();
const acc = require('../tools/access-control')

const {
    rgisterPage,
    register,
    loginPage,
    login,
    resetPassPage,
    resetPass,
    logout
} = require("../controllers/auth.controller");

router.get("/register", acc.hasSession, rgisterPage);

router.post("/register", register);

router.get("/login", acc.hasSession, loginPage);

router.post("/login", login);

router.get('/resetPass', acc.hasSession, resetPassPage)

router.post('/resetPass', acc.resetPass, resetPass)

router.get("/logout", logout);


module.exports = router;