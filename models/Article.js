const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const requiredFields = {
    type: String,
    required: true,
    trim: true,
    // maxlength: 30,
};

const ArticleSchema = new Schema({
    title: {
        ...requiredFields,
        minlength: 3
    },
    text: {
        ...requiredFields,
        minlength: 100
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

module.exports = mongoose.model('Article', ArticleSchema);