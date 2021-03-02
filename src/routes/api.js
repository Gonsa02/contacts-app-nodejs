const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const Contact = require('../models/Contact');

// GET ALL USERS
router.get('/api/contacts', ensureAuthenticated, async (req, res) => {
    Contact.findAll({ where: { userid: req.user.id } })
	.then(contacts => res.json(contacts))
	.catch(err => {
	    console.log(err);
	    res.json({status: 'error'});
	});
});

// GET ONE USER
router.get('/api/contacts/:id', ensureAuthenticated, async (req, res) => {
    const { id } = req.params;
    Contact.findAll({ where: { id: id } })
	.then(contact => res.json(contact))
	.catch(err => {
	    console.log(err);
	    res.json({status: 'error'});
	});
});

module.exports = router;
