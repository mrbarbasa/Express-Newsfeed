// INIT AND LIBRARIES
var express = require('express');
var app = express();

// MIDDLEWARE
app.use(express.static('./public'));
app.set('view engine', 'jade');

// ROUTES
app.get('/', function(req, res) {

  var locals = {
    
  };

  res.render('./index', locals);
});

// EXPORT THIS FILE AS A MODULE
module.exports.app = app;
