var NewsItem = require('./models/news');
var User = require('./models/user');
var account = require('./controllers/account');
var news = require('./controllers/news');

module.exports = function(app) {

  function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    // Not authenticated
    res.redirect('/login');
  }

  app.get('/account', ensureAuthenticated, account.show);

  app.get('/account/:id/edit', ensureAuthenticated, account.edit);

  app.put('/account/:id', ensureAuthenticated, account.update);

  app.get('/news/:id', news.showItem);

  app.get('/new_news', ensureAuthenticated, news.showNew);

  app.post('/news', ensureAuthenticated, news.addNew);

  app.get('/news/:id/edit', news.editGetItem);

  app.put('/news/:id', news.updateItem);

  app.delete('/news/:id', news.deleteItem);

  return app;
  
};