var auth = require('./controllers/auth');
var account = require('./controllers/account');
var article = require('./controllers/article');

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

  // ARTICLE ROUTES
  app.get('/', article.index);

  app.get('/articles/:id', article.show);

  app.get('/article/new', ensureAuthenticated, article.add);

  app.post('/articles', ensureAuthenticated, article.create);

  app.get('/articles/:id/edit', ensureAuthenticated, article.edit);

  app.put('/articles/:id', ensureAuthenticated, article.update);

  app.delete('/articles/:id', ensureAuthenticated, article.destroy);

  return app;

};