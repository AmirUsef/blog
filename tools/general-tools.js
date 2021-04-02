const multer = require('multer')
const path = require('path')
const fs = require('fs')
const rimraf = require("rimraf");
const generalTools = {};

generalTools.sessionChecker = function(req, res, next) {
    if (req.cookies.user_sid && req.session.user)
        return res.redirect('/user/dashboard')

    return next()
};

generalTools.loginChecker = function(req, res, next) {
    if (!req.session.user)
        return res.redirect('/auth/loginPage')

    return next()
};

const avatarStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, '../public/images/avatars'))
    },
    filename: function(req, file, cb) {
        cb(null, req.session.user.username + '-' + Date.now() + '-' + file.originalname)
    }
})

generalTools.uploadAvatar = multer({
    storage: avatarStorage,
    fileFilter: function(req, file, cb) {
        if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg')
            cb(null, true)
        else
            cb(new Error('invalid type!'), false);
    }
})

const articleStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        const dir = path.join(__dirname, `../public/images/temp/${req.session.user._id}-temp`)
        try {
            if (!fs.existsSync(dir))
                fs.mkdirSync(dir);
        } catch (error) {
            return console.log(error);
        }
        cb(null, dir)
    },
    filename: function(req, file, cb) {
        cb(null, req.session.user.username + '-' + Date.now() + '-' + file.originalname)
    }
})

generalTools.uploadArticleImage = multer({
    storage: articleStorage,
    fileFilter: function(req, file, cb) {
        if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg')
            cb(null, true)
        else
            cb(new Error('invalid type!'), false);
    }
})

generalTools.copyFiles = function(dirName, text, id) {
    try {
        fs.mkdirSync(path.join(__dirname, '../public/images/articles/' + dirName))
        files = fs.readdirSync(path.join(__dirname, `../public/images/temp/${id}-temp`))
        files.forEach(file => {
            if (text.includes(file)) {
                fs.copyFileSync(path.join(__dirname, `../public/images/temp/${id}-temp/${file}`), path.join(__dirname, `../public/images/articles/${dirName}/${file}`), fs.constants.COPYFILE_EXCL)
            }
        });
        rimraf.sync(path.join(__dirname, `../public/images/temp/${id}-temp`))
    } catch (error) {
        console.log(error);
    }
}

module.exports = generalTools;