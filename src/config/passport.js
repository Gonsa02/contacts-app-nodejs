const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

// Load User Model
const User = require('../models/User');

module.exports = function(passport) {
    passport.use (
        new LocalStrategy( { usernameField: 'username' },
        (username, password, done) => {
            // Match User
            User.findOne({ where: { username: username } })
                .then(user => {
                    if (!user) {
                        return done(null, false, { message: 'That username is not registered'})
                    }

                    // Match Password
                    bcrypt.compare(password, user.password,
                        (err, isMatch) => {
                            if (err) throw err;

                            if (isMatch) {
                                return done(null, user);
                            } else {
                                return done(null, false, { message: 'Password Incorrect' })
                            }
                        });
                })
                .catch(err => console.log(err));
        })
    );

    passport.serializeUser((user, done) => {
        done(null, user.username);
    });

    passport.deserializeUser((username, done) => {
        User.findOne( { where: { username: username} })
            .then((user) => {
                done(null, user);
            })
            .catch((err) => {
                done(null, err);
            });
    })
}