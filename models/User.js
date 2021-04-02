const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const Article = require('./Article')
const fs = require('fs')

const requiredFields = {
    type: String,
    required: true,
    trim: true,
};

const UserSchema = new Schema({
    firstName: {
        ...requiredFields,
        minlength: 3,
        maxlength: 15,
        lowercase: true,
        match: [/^[a-zA-Z\s]*$/, 'firstName is not valid']
    },
    lastName: {
        ...requiredFields,
        minlength: 3,
        maxlength: 15,
        lowercase: true,
        match: [/^[a-zA-Z\s]*$/, 'lastName is not valid']
    },
    username: {
        ...requiredFields,
        unique: true,
        lowercase: true,
        match: [/^(?=.{4,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/, 'username is not valid']
    },
    password: {
        ...requiredFields,
    },
    phoneNumber: {
        ...requiredFields,
        unique: true,
        lowercase: true,
        match: [/^09[0-9]{9}$/, 'phone number is not valid']
    },
    gender: {
        ...requiredFields,
        enum: ['male', 'female']
    },
    avatar: {
        type: String,
        default: 'profile.png'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastUpdate: {
        type: Date,
        default: Date.now
    },
    role: {
        type: String,
        enum: ['admin', 'blogger'],
        default: 'blogger'
    }
});

UserSchema.methods.toJSON = function() {
    let user = this
    user = user.toObject()
    delete user.__v
    delete user.password
    return user
}

UserSchema.methods.comparePassword = async function(pass) {
    const user = this
    return await new Promise((resolve, reject) => {
        bcrypt.compare(pass, user.password, async function(err, isEqual) {
            if (err) reject(err)

            resolve(isEqual)
        })
    });
}

UserSchema.pre('save', function(next) {
    const user = this
    if (this.isNew || this.isModified()) {
        bcrypt.genSalt(10, function(err, salt) {
            if (err) return next(err)
            bcrypt.hash(user.password, salt, function(err, hash) {
                if (err) return next(err)
                user.password = hash
                next()
            });
        });
    } else
        next()
});

UserSchema.pre('updateOne', function(next) {
    this.getUpdate().lastUpdate = Date.now()
    let user = this.getUpdate()
    if (user.password) {
        bcrypt.genSalt(10, function(err, salt) {
            if (err) return next(err)
            bcrypt.hash(user.password, salt, function(err, hash) {
                if (err) return next(err)
                user.password = hash
                next()
            });
        });
    } else
        next()
})

UserSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
    if (this.avatar != 'profile.png') {
        fs.unlink(`./public/images/avatars/${this.avatar}`, (err) => {
            if (err) console.log(err);
        })
    }
    try {
        const articles = await Article.find({ owner: this._id })
        for (let index = 0; index < articles.length; index++)
            await articles[index].deleteOne()
    } catch (error) {
        return res.status(500).send()
    }
    next()
});

module.exports = mongoose.model('User', UserSchema);