var mongoose = require('mongoose');

var newsSchema = mongoose.Schema({
  title: String,
  author: String,
  body: String
});

module.exports = mongoose.model('New', newsSchema);
