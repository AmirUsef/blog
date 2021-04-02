const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const generalTools = require('../tools/general-tools')
const rimraf = require("rimraf");
const path = require('path')

const requiredFields = {
    type: String,
    required: true,
    trim: true,
};

const ArticleSchema = new Schema({
    title: {
        ...requiredFields,
        minlength: 3,
        maxlength: 30
    },
    text: {
        ...requiredFields,
        minlength: 20
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastUpdate: {
        type: Date,
        default: Date.now
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
});

ArticleSchema.methods.toJSON = function() {
    let article = this
    article = article.toObject()
    delete article.__v
    return article
}

ArticleSchema.pre('save', function(next) {
    generalTools.copyFiles(this._id, this.text, this.owner)
    this.text = this.text.replace(`temp/${this.owner}-temp`, `articles/${this._id}`);
    next()
});

ArticleSchema.pre('deleteOne', { document: true, query: false }, function(next) {
    try {
        rimraf.sync(path.join(__dirname, `../public/images/articles/${this._id}`))
    } catch (error) {
        console.log(error);
    }
    next()
        // Comment.deleteMany({ article: this._id }, (err, comments) => {
        //     if (err) return res.status(500).json({ msg: "Server Error :)", err: err.message });
        // });
});


module.exports = mongoose.model('Article', ArticleSchema);