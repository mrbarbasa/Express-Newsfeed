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

var CONNECTION_STRING = 'mongodb://dbadmin:' + process.env.DBPASS + '@ds063170.mongolab.com:63170/newsdb';

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

// MongoLab CONNECTION_STRING
mongoose.connect(CONNECTION_STRING);

var newsSchema = mongoose.Schema({
  title: String,
  author: String,
  body: String
});

var NewsItem = mongoose.model('New', newsSchema);

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
  done(null, user);
});

// ROUTES

app.get('/login', function (req, res) {
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

app.get('/', ensureAuthenticated, function(req, res) {
  NewsItem.find(function(err, news) {
    if(err) {
      throw err;
    } else {
      var locals = {
        newsContent: news
      };
      res.render('./index', locals);
    }
  });
});

app.get('/news/:id', ensureAuthenticated, function(req, res) {
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


var User = {
  findOne: function(opts, cb) {
    var user = {
      id: 1,
      username: "admin",
      password: "admin",
      validPassword: function(password) {
        return (password === "admin");
      }
    };
    cb(null, user);
  }
};

function ensureAuthenticated (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  // not authenticated
  res.redirect('/login');
}



/* ROUTES */
/* ====== */

// GET / to view a list of news post entries

// GET /news/:id to see a single news post

// each news post should include a link to delete this news post

// each news post should include a link to edit this news post

// GET /new_news to see a "new news post" form

// the form fields are:
// author : Text
// title : Text
// body : TextArea

// POST /news to create a new news post i


// GET /news/:id/edit to see a form to edit a news post identified by the :id param

// the form fields are:
// author : Text
// title : Text
// body : TextArea

// PUT /news/:id updates a single news post identified by the :id param

// DELETE /news/:id to delete a single news post identified by the :id param
// EXPORT THIS FILE AS A MODULE

module.exports.app = app;
