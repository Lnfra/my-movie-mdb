var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var userSchema = new mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    // custom validator for password field
    validate: [
     function(password) {
       return password.length >= 6;
     },
     'Password should be longer'
    ]
  }
});

userSchema.pre('save', function(next) {
  var user = this;

  // Generate a salt, with a salt_work_factor of 5
  bcrypt.genSalt(5, function(err, salt) {
    if (err) return next(err);

    if (!user.isModified('password')) return next();

    // Hash the password using our new salt
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);

      // Override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.authenticate = function(password, callback) {
  // console.log('password is ' + password);
  // Compare is a bcrypt method that will return a boolean,
  // if the first argument once encrypted corresponds to the second argument
  bcrypt.compare(password, this.password, function(err, isMatch) {
    callback(null, isMatch);
  });
};

var User = mongoose.model('User', userSchema);

module.exports = User;
