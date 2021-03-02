const express = require('express');
const app = express();
const path = require('path');
const sequelize = require('./db/db');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');


// VIEW SETTINGS
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// BODYPARSER
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// SERVER CONFIGURATION AND DB
const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => {
    console.log(`Listening at ${PORT}`);
    sequelize.sync({ force: false })
        .then(() => {
            console.log('Database Connected!');
        })
        .catch(err => {
            console.log(err);
        });
});

// EXPRESS SESSION
app.use(session({
    secret: 'Contacts-App',
    resave: true,
    saveUninitialized: true
}));

// CONNECT FLASH
app.use(flash());

// GLOBAL VAR
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// PASSPORT MIDDLEWARE
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

// ROUTES
app.use(require('./routes/'));
app.use(require('./routes/authentication'));
app.use(require('./routes/home'));
app.use(require('./routes/api'));
