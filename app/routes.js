var express = require('express');
var app = express();
var NewsItem = require('./models/news');
var User = require('./models/user');

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  // Not authenticated
  res.redirect('/login');
}

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
