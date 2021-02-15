const Contact = require("../models/Contact");

module.exports = {
    selfAction: function(req, res, next) {
        const { id } = req.params;
        Contact.findOne({ where: { id: id }})
            .then(user => {
                if (user.userid == req.user.id) return next();
                else res.redirect('/home/contacts');
            })
            .catch(err => console.log(err));
    }
}