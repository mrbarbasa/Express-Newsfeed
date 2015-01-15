// INIT AND LIBRARIES
var express = require('express');
var app = express();
var flash = require('connect-flash');
var passport = require('passport');
var session = require('express-session');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var methodOverride = require('method-override');
var LocalStrategy = require('passport-local').Strategy;

// MODELS
var NewsItem = require('./models/news');
var User = require('./models/user');

// ROUTES
var routes = require('./routes');
// var account = require('./controllers/account');
// var news = ('./controllers/news');

// DB CONNECTION
var CONNECTION_STRING = 'mongodb://dbadmin:' + process.env.DBPASS + '@ds063170.mongolab.com:63170/newsdb';
mongoose.connect(CONNECTION_STRING);

// MIDDLEWARE
app.use(express.static('./public'));
app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({ extended: true }));
// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));

app.use(session({
  secret: 'The Newsfeed Express',  // ??
  resave: false,
  saveUninitialized: true
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  User.findById(user._id, function(err, user) {
    done(null, user);
  });
});

// ROUTES

app.get('/signup', function(req, res) {
  var locals = {
    messages: req.flash('error')
  };
  res.render('signup', locals);
});

app.post('/signup', function(req, res) {
  if (req.body.password !== req.body.password_confirm) {
    var locals = {
      messages: "Password confirmation does not match password."
    };
    return res.render('signup', locals);
  }

  var newUser = User({
    "username": req.body.username,
    "password": User.hashPassword(req.body.password),
    "first_name": req.body.first_name,
    "last_name": req.body.last_name,
    "email": req.body.email
  });

  newUser.save(function(err) {
    if (err) {
      throw err;
    }
    else {
      req.login(newUser, function(err) {
        if (err) {
          throw err;
        }
        return res.redirect('/');
      });
    }
  });
});

app.get('/login', function(req, res) {
  var locals = {
    messages: req.flash('error')
  };
  res.render('login', locals);
});

app.post('/login',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login',
                                   failureFlash: true })
);

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.get('/', function(req, res) {
  NewsItem.find(function(err, news) {
    if(err) {
      throw err;
    } else {
      var locals = {
        newsContent: news,
        user: req.user
      };
      res.render('./index', locals);
    }
  });
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  // Not authenticated
  res.redirect('/login');
}

module.exports.app = app;
