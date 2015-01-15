// TODO
var User = require('./models/user');

app.get('/account', ensureAuthenticated, function(req, res) {
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
