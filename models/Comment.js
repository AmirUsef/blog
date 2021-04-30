const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    text: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 100
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    article: {
        type: Schema.Types.ObjectId,
        ref: "Article",
        required: true
    },
    confirmed: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

CommentSchema.pre('find', function(next) {
    this.populate('owner', { username: 1, avatar: 1, _id: 0 }).sort({ createdAt: -1 })
    next()
});

module.exports = mongoose.model('Comment', CommentSchema);