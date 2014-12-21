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

  // var locals = {
    
  // };

  // todo.post from jQuery
  var news = new NewsItem(
    {
      "author": "Marc Canter",
      "title": "The Internet Of Things Is Not A Shiny New Toy",
      "body": "The Internet of Things is the latest, greatest new buzzword du jour and every major technology company, industrial manufacturer, big retailer and health industry player has declared the IoT to be the next big thing. Each of these industries sees a way of taking advantage of tiny low-power intelligent devices or sensors and they’ve baked the IoT into their future product strategies."
    }
  );

  news.save(function(err) {
    if (err) {
      throw err;
    }
    else {  // if success
      res.render('./index');
    }
  });
  
   
});

// EXPORT THIS FILE AS A MODULE
module.exports.app = app;
