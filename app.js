var express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    flash = require('connect-flash'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
	mongoose = require("mongoose"),
	passport = require('passport'),
	dotenv = require('dotenv');

dotenv.config();
mongoose.connect(process.env.MONGODB_URI);

var index = require('./routes/index'),
	game = require('./routes/game'),
	home = require('./routes/home')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')))
app.use(flash())

require(path.join(__dirname, 'utility', 'strategy'))(passport);
var keys = ['random', 'laptop'],
    expiryDate = new Date( 5 * Date.now() + 60 * 60 * 1000 ); // 5 hours

app.use(require('cookie-session')({
    keys    :  keys,
    secret  : process.env.COOKIE_SECRET || 'cookie-secret',
    cookie  :
    {
        secure: true,
        expires: expiryDate
    }
}));
app.use(passport.initialize());
app.use(passport.session());


app.use('/', index);
app.use('/home', home);
app.use('/game', game);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
