var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/User');

module.exports = function (passport) {

    // serialize and deserialize users from session
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });


    // ============= SIGNUP ================
    // =====================================
    passport.use('local-signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, function (req, email, password, done) { //callback with details from form

        //find for matching email form-database
        User.findOne({'local.email': email}, function (err, user) {
            if (err) {
                return done(err); //return errors is any
            }

            //check if user already exists
            if (user) {
                return done(null, false, req.flash('message', 'Email already in use!'));
            } else {
                //create instance of user
                var newUser = new User();
                newUser.local.email = email;
                newUser.local.password = newUser.generateHash(password);
                newUser.local.link = "";

                newUser.local.basic.name = req.body.name;
                newUser.local.basic.image = "";
                newUser.local.basic.occupation = "";

                newUser.local.social.address = "";
                newUser.local.social.email = "";
                newUser.local.social.phone = "";
                newUser.local.social.skype = "";
                newUser.local.social.github = "";
                newUser.local.social.facebook = "";
                newUser.local.social.website = "";
                newUser.local.social.linkedin = "";
                newUser.local.social.twitter = "";
                newUser.local.statement = "";

                //save to database
                newUser.save(function (err) {
                    if (err) {
                        throw err;
                    }
                    return done(null, newUser);
                });
            }
        });

    }));


    // ============= SIGN IN ===============
    // =====================================
    passport.use('local-signin', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, function (req, email, password, done) { // callback with details from form

        //find matching details in database
        User.findOne({'local.email': email}, function (err, user) {
            if (err) { //return error if any
                return done(err);
            }

            //return message if user not found
            if (!user) {
                return done(null, false, req.flash('message', 'Email not found!'));
            }

            //if email found but password is wrong
            if (!user.validPassword(password)) {
                return done(null, false, req.flash('message', 'Wrong password!'));
            }

            //finally, return the user if successful
            return done(null, user);
        });
    }));

};















