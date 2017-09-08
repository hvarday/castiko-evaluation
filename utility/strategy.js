var path = require('path'),
	LocalStrategy = require('passport-local'),
	User = require(path.join(__dirname, '..', 'models', 'user'));

module.exports = function (passport){

    passport.use(
        // by default, local strategy uses username and password, we will override with email
        new LocalStrategy({
			usernameField: 'email',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
      function(req, username, password, done) {
			console.log(req.body)
			console.log(username, password)
        User.findOne({ email: username }, function (err, user) {

			if (err) { return done(err); }

              if (!user) { return done(null, false, req.flash('failureFlash', 'Invalid Credentials')); }

              user.verifyPassword(password)
              .then(function(val){
                  if(val)
                        return done(null, user);
                  else
                        return done(null, false, req.flash('failureFlash', 'Invalid Credentials'));
              })
              .catch(done);
        });
      }
    ));

    passport.serializeUser(function(user, cb) {
      cb(null, user._id);
    });

    passport.deserializeUser(function(id, cb) {
      User.findById(id, function (err, user) {
        if (err) { return cb(err); }
        cb(null, user);
      });
    });

}
