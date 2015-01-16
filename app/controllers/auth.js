var User = require('../models/user');

exports.signup = function(req, res) {
  var locals = {
    messages: req.flash('error')
  };
  res.render('./auth/signup', locals);
};

exports.create = function(req, res) {
  if (req.body.password !== req.body.password_confirm) {
    var locals = {
      messages: "Password confirmation does not match password."
    };
    return res.render('./auth/signup', locals);
  }

  var newUser = User({
    "username": req.body.username,
    "password": User.hashPassword(req.body.password),
    "first_name": req.body.first_name,
    "last_name": req.body.last_name,
    "email": req.body.email
  });

  newUser.save(function(err) {
    if (err) {
      throw err;
    }
    else {
      req.login(newUser, function(err) {
        if (err) {
          throw err;
        }
        return res.redirect('/');
      });
    }
  });
};

exports.login = function(req, res) {
  var locals = {
    messages: req.flash('error')
  };
  res.render('./auth/login', locals);
};

exports.authenticate = function(passport) {
  return passport.authenticate('local', { 
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true 
  });
};

exports.logout = function(req, res){
  req.logout();
  res.redirect('/');
};
