const express = require('express');
const router = express.Router();
const generalTools = require('../tools/general-tools')

const {
    rgisterPage,
    register,
    loginPage,
    login,
    logout
} = require("../controllers/auth.controller");

router.get("/registerpage", generalTools.sessionChecker, rgisterPage);

router.post("/register", register);

router.get("/loginpage", generalTools.sessionChecker, loginPage);

router.post("/login", login);

router.get("/logout", logout);


module.exports = router;