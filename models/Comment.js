const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const requiredFields = {
    type: String,
    required: true,
    trim: true,
    // maxlength: 30,
};

const CommentSchema = new Schema({
    text: {
        ...requiredFields,
        minlength: 10
    },
    createdAt: {
        type: Date,
        default: Date.now
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
    }
});

// UserSchema.pre('save', function(next) {
//     const user = this
//     if (this.isNew || this.isModified()) {
//         console.log(1);
//         bcrypt.genSalt(10, function(err, salt) {
//             if (err) return next(err)
//             bcrypt.hash(user.password, salt, function(err, hash) {
//                 if (err) return next(err)
//                 user.password = hash
//                 next()
//             });
//         });
//     } else
//         next()
// });

// UserSchema.pre('updateOne', function(next) {
//     let user = this.getUpdate()
//     if (user.password) {
//         bcrypt.genSalt(10, function(err, salt) {
//             if (err) return next(err)
//             bcrypt.hash(user.password, salt, function(err, hash) {
//                 if (err) return next(err)
//                 user.password = hash
//                 next()
//             });
//         });
//     } else
//         next()

// })

module.exports = mongoose.model('Comment', CommentSchema);