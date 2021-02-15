const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const passport = require('passport');

router.get('/sing-up', (req, res) => {
    res.render('authentication/sing-up');
})

router.get('/login', (req, res) => {
    res.render('authentication/login');
})

router.post('/sing-up', (req, res) => {
    const { username, password, fullname } = req.body;
    let errors = [];
    // Check required fields
    if(!username || !password || !fullname) errors.push({ msg: 'Please fill in all fields' });

    // Check pass length
    if (password.length < 6) errors.push({ msg: 'Password must be at least 6 characters' });

    if (errors.length > 0) {
        res.render('authentication/sing-up', {
            errors,
            username,
            password,
            fullname
        });
    } else {
        //Validation passed
        User.findOne({ where: {username: username} })
            .then (user => {
                if (user) {
                    //User exists
                    errors.push({
                        msg: 'User already exists'
                    });
                    res.render('authentication/sing-up', {
                        errors,
                        username,
                        password,
                        fullname
                    });
                } else {

                    const newUser = new User ({
                        username,
                        password,
                        fullname
                    });
            
                    //Hash Passord
                    bcrypt.genSalt(10, (err, salt) => 
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if(err) throw err;
                            // Set password to hashed
                            newUser.password = hash;
                            // Save user
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'You are now registered and can login');
                                    res.redirect('/login');
                                })
                                .catch(err => console.log(err));
                        })
                    )
                }
            })
        
    }

});

// Login Handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/home',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
})

// Logout Handle
router.get('/logout', (req, res, next) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/login');
})

module.exports = router;