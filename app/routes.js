var NewsItem = require('./models/news');
var User = require('./models/user');
var auth = require('./controllers/auth');
var account = require('./controllers/account');
var news = require('./controllers/news');

module.exports = function(app, passport) {

  function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    // Not authenticated
    res.redirect('/login');
  }

  // AUTH ROUTES
  app.get('/signup', auth.signup);

  app.post('/signup', auth.create);

  app.get('/login', auth.login);

  app.post('/login', auth.authenticate(passport));

  app.get('/logout', auth.logout);

  // ACCOUNT ROUTES
  app.get('/account', ensureAuthenticated, account.show);

  app.get('/account/:id/edit', ensureAuthenticated, account.edit);

  app.put('/account/:id', ensureAuthenticated, account.update);

  // NEWS ROUTES
  app.get('/', news.index);

  app.get('/news/:id', news.show);

  app.get('/new_news', ensureAuthenticated, news.showNew);

  app.post('/news', ensureAuthenticated, news.create);

  app.get('/news/:id/edit', news.edit);

  app.put('/news/:id', news.update);

  app.delete('/news/:id', news.destroy);

  return app;

};