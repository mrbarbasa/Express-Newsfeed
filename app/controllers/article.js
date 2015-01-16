var Article = require('../models/article');

exports.index = function(req, res) {
  Article.find(function(err, articles) {
    if(err) {
      throw err;
    } else {
      var locals = {
        articles: articles,
        user: req.user
      };
      res.render('./index', locals);
    }
  });
};

exports.show = function(req, res) {
  Article.find({
    "_id": req.params.id
  }, function(err, articles) {
    if (err) {
      throw err;
    }
    else {
      var locals = {
        article: articles[0],
        user: req.user
      };
      res.render('./article/show', locals);
    }
  });
};

exports.add = function(req, res) {
  res.render('./article/new');
};

exports.create = function(req, res) {
  var article = Article({
    "title": req.body.title,
    "author": req.body.author,
    "body": req.body.body
  });

  article.save(function(err) {
    if (err) {
      throw err;
    }
    else {
      res.redirect('/'); // Can't pass locals in to redirect
    }
  });
};

exports.edit = function(req, res) {
  Article.find({
    "_id": req.params.id
  }, function(err, articles) {
    if (err) {
      throw err;
    }
    else {
      var locals = {
        article: articles[0]
      };
      res.render('./article/edit', locals);
    }
  });
};

exports.update = function(req, res) {
  Article.update({
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
      res.redirect('/articles/' + req.params.id);
    }
  });
};

exports.destroy = function(req, res) {
  Article.remove({
    "_id": req.params.id
  }, function(err) {
    if (err) {
      throw err;
    }
    else {
      res.redirect('/');
    }
  });
};
