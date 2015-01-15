var mongoose = require('mongoose');
var crypto = require('crypto');

var userSchema = mongoose.Schema({
  username: String,
  password: String,
  first_name: String,
  last_name: String,
  email: String
});

userSchema.statics.hashPassword = function(input) {
  input += process.env.SALT;
  var shasum = crypto.createHash('sha512');
  shasum.update(input);
  return shasum.digest('hex');
}

userSchema.methods.validPassword = function(checkPassword) {
  return (User.hashPassword(checkPassword) === this.password);
};

module.exports = mongoose.model('User', userSchema);
