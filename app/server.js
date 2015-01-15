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
var NewsItem = require('./models/news.js');
var User = require('./models/user.js');

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

app.get('/account', ensureAuthenticated, function(req, res) {
  // console.log(req.user);
  var locals = {
    user: req.user
  };
  res.render('account/show', locals);
});

app.get('/account/:id/edit', ensureAuthenticated, function(req, res) {
  var locals = {
    user: req.user
  };
  res.render('account/edit', locals);
});


app.put('/account/:id', ensureAuthenticated, function(req, res) {
  User.update({
    "_id": req.params.id
  }, {
    "username": req.body.username,
    "password": User.hashPassword(req.body.password),
    "email": req.body.email,
    "first_name": req.body.first_name,
    "last_name": req.body.last_name
  }, function(err) {
    if (err) {
      throw err;
    }
    else {
      res.redirect('/account');
    }
  });
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

app.get('/news/:id', function(req, res) {
  NewsItem.find({
    "_id": req.params.id
  }, function(err, news) {
    if (err) {
      throw err;
    }
    else {
      var locals = {
        newsItem: news[0]
      };
      res.render('./news', locals);
    }
  });
});

app.get('/new_news', ensureAuthenticated, function(req, res) {
  res.render('./new_news');
});

app.post('/news', ensureAuthenticated, function(req, res) {
  var news = NewsItem({
    "title": req.body.title,
    "author": req.body.author,
    "body": req.body.body
  });

  news.save(function(err) {
    if (err) {
      throw err;
    }
    else {
      res.redirect('/'); // Can't pass locals in to redirect
    }
  });
});

app.get('/news/:id/edit', ensureAuthenticated, function(req, res) {
  NewsItem.find({
    "_id": req.params.id
  }, function(err, news) {
    if (err) {
      throw err;
    }
    else {
      var locals = {
        newsItem: news[0]
      };
      res.render('./edit_news', locals);
    }
  });
});

app.put('/news/:id', ensureAuthenticated, function(req, res) {
  NewsItem.update({
    "_id": req.params.id
  }, {
    "title": req.body.title,
    "author": req.body.author,
    "body": req.body.body
  }, function(err) {
    if (err) {
      throw err;
    }
    else {
      res.redirect('/news/' + req.params.id);
    }
  });
});

app.delete('/news/:id', ensureAuthenticated, function(req, res) {
  NewsItem.remove({
    "_id": req.params.id
  }, function(err) {
    if (err) {
      throw err;
    }
    else {
      res.redirect('/');
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
