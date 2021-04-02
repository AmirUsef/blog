const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const mongoose = require('mongoose');
const config = require('./config/config');
const api = require('./routes/api');
require('./tools/initializer')

const app = express();

mongoose.connect(
    config.mongoURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    key: 'user_sid',
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}))

app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user)
        res.clearCookie('user_sid')

    next();
})

app.use('/', api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;