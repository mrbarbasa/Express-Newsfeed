var mongoose = require('mongoose');

var articleSchema = mongoose.Schema({
  title: String,
  author: String,
  body: String
});

module.exports = mongoose.model('Article', articleSchema);
