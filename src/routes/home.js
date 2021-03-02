const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const { selfAction } = require('../config/self');
const Contact = require('../models/Contact');

router.get('/home', ensureAuthenticated, (req, res) => {
    res.render('home/profile', {
        username: req.user.username,
        fullname: req.user.fullname
    });
});

router.get('/home/add', ensureAuthenticated, (req, res) => {
    res.render('home/add');
});

router.get('/home/contacts', ensureAuthenticated, (req, res) => {

    Contact.findAll({ where: { userid: req.user.id } })
        .then(contacts => {
            res.render('home/contacts', {
                contacts
            });
        })
        .catch(err => console.log(err));
});

// ADD CONTACT HANDLE
router.post('/home/add', (req, res) => {
    const { name, phone } = req.body;
    const userid = req.user.id;
    let errors = [];
    // Check required fields
    if(!name || !phone) errors.push({ msg: 'Please fill in all fields' });
    // CHeck if phone is valid
    const reg = /^(?=[0-9]*$)(?:.{0}|.{9})$/
    if (!reg.exec(phone)) errors.push({ msg: 'Invalid phone number' });
    
    if (errors.length > 0) {
        res.render('home/add', {
            errors,
            name,
            phone
        });
    } else {
        // Validation Passed
        const newContact = new Contact ({
            name,
            phone,
            userid
        });
        newContact.save()
            .then(() => {
                req.flash('success_msg', 'New contact added succesfully')
                res.redirect('/home/add');
            })
            .catch(err => console.log(err));
    }
});

// DELETE USER
router.get('/home/delete/:id', ensureAuthenticated, selfAction, (req, res) => {
    const { id } = req.params;
    Contact.destroy({ where: { id: id } });
    Contact.findAll({ where: { userid: req.user.id } })
    .then(() => {
        req.flash('success_msg', 'Contact Deleted Successfuly');
        res.redirect('/home/contacts');
    })
    .catch(err => console.log(err));
});

// EDIT USER

router.get('/home/edit/:id', ensureAuthenticated, selfAction, (req, res) => {
    const { id } = req.params;
    Contact.findOne({ where: { id: id } })
        .then(contact => {
            res.render('home/edit', {
                contact
            })
        })
        .catch(err => console.log(err));
});

// EDIT USER HANDLE

router.post('/home/edit/:id', ensureAuthenticated, (req, res) => {
    const { name, phone } = req.body;
    const { id } = req.params;
    let errors = [];
    // Check required fields
    if(!name || !phone) errors.push({ msg: 'Please fill in all fields' });
    // CHeck if phone is valid
    const reg = /^(?=[0-9]*$)(?:.{0}|.{9})$/
    if (!reg.exec(phone)) errors.push({ msg: 'Invalid phone number' });
    
    if (errors.length > 0) {
        res.render('home/add', {
            errors,
            name,
            phone
        });
    } else {
        // Validation Passed
        Contact.update({
            name,
            phone
        }, {
            where: { id: id }
        })
            .then(() => {
                req.flash('success_msg', 'User Edited Successfully');
                res.redirect('/home/contacts');
            })
            .catch(err => console.log(err));
    }
});

module.exports = router;
