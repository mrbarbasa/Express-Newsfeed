// INIT AND LIBRARIES
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var CONNECTION_STRING = 'mongodb://dbadmin:' + process.env.DBPASS + '@ds063170.mongolab.com:63170/newsdb';

// MIDDLEWARE
app.use(express.static('./public'));
app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({ extended: true }));


// MongoLab CONNECTION_STRING
mongoose.connect(CONNECTION_STRING);

var newsSchema = mongoose.Schema({
  title: String,
  author: String,
  body: String
});

var NewsItem = mongoose.model('New', newsSchema);

// ROUTES
app.get('/', function(req, res) {
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

app.get('/new_news', function(req, res) {
  res.render('./new_news');
});

app.post('/news', function(req, res) {
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
