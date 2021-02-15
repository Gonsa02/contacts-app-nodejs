const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db/db');

class Contact extends Model {}

Contact.init({
    name: {
        type: DataTypes.STRING,
        alowNull: false
    },
    phone: {
        type: DataTypes.STRING,
        alowNull: false
    },
    userid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model:'users',
            key: 'ID'
        }
    },
},{
    sequelize,
    modelName: "contacts"
});

module.exports = Contact;